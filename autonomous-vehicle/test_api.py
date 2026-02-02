#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
新石器无人车接口测试脚本
用于测试数据接收和导出功能
"""

import requests
import json
import sys
from datetime import datetime, timedelta
import os

# 配置
BASE_URL = "http://localhost:8060"
# 如果服务在远程服务器，可以修改为：
# BASE_URL = "http://your-server-ip:8060"

# 颜色输出
class Colors:
    GREEN = '\033[0;32m'
    RED = '\033[0;31m'
    YELLOW = '\033[1;33m'
    BLUE = '\033[0;34m'
    NC = '\033[0m'  # No Color

def print_success(msg):
    print(f"{Colors.GREEN}✓ {msg}{Colors.NC}")

def print_error(msg):
    print(f"{Colors.RED}✗ {msg}{Colors.NC}")

def print_warning(msg):
    print(f"{Colors.YELLOW}⚠ {msg}{Colors.NC}")

def print_info(msg):
    print(f"{Colors.BLUE}ℹ {msg}{Colors.NC}")

def test_service_status():
    """测试1: 检查服务是否运行"""
    print(f"\n{Colors.YELLOW}[测试1] 检查服务状态...{Colors.NC}")
    try:
        response = requests.get(f"{BASE_URL}/vehicle/online_count", timeout=5)
        if response.status_code == 200:
            print_success("服务运行正常")
            return True
        else:
            print_error(f"服务返回状态码: {response.status_code}")
            return False
    except requests.exceptions.ConnectionError:
        print_error("无法连接到服务，请确保服务已启动")
        print_info("启动命令: cd autonomous-vehicle && docker-compose up -d")
        return False
    except Exception as e:
        print_error(f"连接失败: {str(e)}")
        return False

def test_online_count():
    """测试2: 获取在线车辆数量"""
    print(f"\n{Colors.YELLOW}[测试2] 获取在线车辆数量...{Colors.NC}")
    try:
        response = requests.get(f"{BASE_URL}/vehicle/online_count", timeout=10)
        response.raise_for_status()
        data = response.json()
        online_count = data.get('data', {}).get('onlineCount', 'N/A')
        print_success(f"在线车辆数: {online_count}")
        return True
    except Exception as e:
        print_error(f"获取在线车辆数失败: {str(e)}")
        if hasattr(e, 'response') and e.response is not None:
            print_error(f"响应内容: {e.response.text}")
        return False

def test_vehicle_list():
    """测试3: 获取车辆列表"""
    print(f"\n{Colors.YELLOW}[测试3] 获取车辆列表...{Colors.NC}")
    try:
        response = requests.get(f"{BASE_URL}/vehicle/list", timeout=10)
        response.raise_for_status()
        data = response.json()
        
        if 'data' in data and isinstance(data['data'], list):
            vehicle_count = len(data['data'])
            print_success(f"成功获取车辆列表，共 {vehicle_count} 辆车")
            
            if vehicle_count > 0:
                print("\n前3辆车信息:")
                for i, vehicle in enumerate(data['data'][:3], 1):
                    print(f"  {i}. VIN: {vehicle.get('vin', 'N/A')}")
                    print(f"     VIN ID: {vehicle.get('vinId', 'N/A')}")
                    print(f"     车牌: {vehicle.get('vinCode', 'N/A')}")
                    print(f"     网格: {vehicle.get('parkName', 'N/A')} ({vehicle.get('parkCode', 'N/A')})")
                
                return data['data'][0].get('vin')  # 返回第一辆车的VIN
            else:
                print_warning("车辆列表为空")
                return None
        else:
            print_error("响应格式不正确")
            print_error(f"响应内容: {json.dumps(data, indent=2, ensure_ascii=False)}")
            return None
    except Exception as e:
        print_error(f"获取车辆列表失败: {str(e)}")
        if hasattr(e, 'response') and e.response is not None:
            print_error(f"响应内容: {e.response.text}")
        return None

def test_vehicle_info(vin):
    """测试4: 获取车辆详细信息"""
    if not vin:
        print(f"\n{Colors.YELLOW}[测试4] 跳过（没有可用车辆）{Colors.NC}")
        return False
    
    print(f"\n{Colors.YELLOW}[测试4] 获取车辆详细信息 (VIN: {vin})...{Colors.NC}")
    try:
        response = requests.post(
            f"{BASE_URL}/vehicle/info",
            json={"vin": vin},
            headers={"Content-Type": "application/json"},
            timeout=10
        )
        response.raise_for_status()
        data = response.json()
        
        if 'data' in data:
            print_success("成功获取车辆信息")
            vehicle = data['data']
            print("\n车辆状态:")
            print(f"  VIN: {vehicle.get('vin', 'N/A')}")
            print(f"  驾驶模式: {vehicle.get('driveMode', 'N/A')} (1=自动驾驶 2=远程脱困 3=近场遥控 0=缺省)")
            print(f"  车速: {vehicle.get('speed', 'N/A')} km/h")
            if 'position' in vehicle:
                pos = vehicle['position']
                print(f"  位置: 经度 {pos.get('lon', 'N/A')}, 纬度 {pos.get('lat', 'N/A')}")
            print(f"  电池电量: {vehicle.get('realBattery', 'N/A')}%")
            print(f"  是否在线: {vehicle.get('powerState', 'N/A')}")
            print(f"  累计里程: {vehicle.get('mile', 'N/A')} km")
            return True
        else:
            print_error("响应格式不正确")
            print_error(f"响应内容: {json.dumps(data, indent=2, ensure_ascii=False)}")
            return False
    except Exception as e:
        print_error(f"获取车辆信息失败: {str(e)}")
        if hasattr(e, 'response') and e.response is not None:
            print_error(f"响应内容: {e.response.text}")
        return False

def test_batch_vehicle_info(vins):
    """测试5: 批量获取车辆信息"""
    if not vins or len(vins) == 0:
        print(f"\n{Colors.YELLOW}[测试5] 跳过（没有可用车辆）{Colors.NC}")
        return False
    
    print(f"\n{Colors.YELLOW}[测试5] 批量获取车辆信息...{Colors.NC}")
    try:
        response = requests.post(
            f"{BASE_URL}/vehicle/info_list",
            json={"vin": vins[:5]},  # 最多测试5辆车
            headers={"Content-Type": "application/json"},
            timeout=10
        )
        response.raise_for_status()
        data = response.json()
        
        if 'data' in data and isinstance(data['data'], list):
            count = len(data['data'])
            print_success(f"成功批量获取 {count} 辆车的信息")
            return True
        else:
            print_error("响应格式不正确")
            return False
    except Exception as e:
        print_error(f"批量获取车辆信息失败: {str(e)}")
        if hasattr(e, 'response') and e.response is not None:
            print_error(f"响应内容: {e.response.text}")
        return False

def test_export():
    """测试6: 测试数据导出功能"""
    print(f"\n{Colors.YELLOW}[测试6] 测试数据导出功能...{Colors.NC}")
    
    # 获取最近24小时的数据
    end_time = datetime.utcnow()
    start_time = end_time - timedelta(hours=24)
    
    start_str = start_time.strftime("%Y-%m-%dT%H:%M:%SZ")
    end_str = end_time.strftime("%Y-%m-%dT%H:%M:%SZ")
    
    print_info(f"导出时间范围: {start_str} 到 {end_str}")
    
    try:
        response = requests.post(
            f"{BASE_URL}/vehicle/export",
            json={
                "startTime": start_str,
                "endTime": end_str
            },
            headers={"Content-Type": "application/json"},
            timeout=30  # 导出可能需要更长时间
        )
        
        if response.status_code == 200:
            # 保存文件
            output_file = "/tmp/vehicle_export_test.xlsx"
            with open(output_file, 'wb') as f:
                f.write(response.content)
            
            file_size = os.path.getsize(output_file)
            if file_size > 0:
                print_success(f"导出成功！文件大小: {file_size} 字节")
                print_info(f"导出文件保存在: {output_file}")
                print_info("可以使用以下命令查看:")
                print_info(f"  file {output_file}")
                print_info("  或使用 Excel/LibreOffice 打开")
                return True
            else:
                print_warning("导出响应成功，但文件大小为0（可能该时间段没有数据）")
                return False
        else:
            print_error(f"导出失败，HTTP状态码: {response.status_code}")
            print_error(f"响应内容: {response.text}")
            return False
    except Exception as e:
        print_error(f"导出失败: {str(e)}")
        return False

def main():
    print("=" * 50)
    print("新石器无人车接口测试")
    print("=" * 50)
    print(f"测试目标: {BASE_URL}")
    
    # 检查服务状态
    if not test_service_status():
        print("\n请先启动服务:")
        print("  cd autonomous-vehicle")
        print("  docker-compose up -d")
        sys.exit(1)
    
    # 执行测试
    test_online_count()
    first_vin = test_vehicle_list()
    
    if first_vin:
        test_vehicle_info(first_vin)
        test_batch_vehicle_info([first_vin])
    
    test_export()
    
    # 总结
    print("\n" + "=" * 50)
    print("测试完成")
    print("=" * 50)
    print("\n如果测试失败，请检查:")
    print("1. 服务是否正常运行: docker ps | grep autonomous")
    print("2. 配置文件是否正确: autonomous-vehicle/etc/autonomousvehicle.yaml")
    print("3. 新石器API凭证是否正确（ClientID, ClientSecret）")
    print("4. 网络连接是否正常（能否访问新石器API）")
    print("5. InfluxDB是否正常运行: docker ps | grep influxdb")
    print("\n查看服务日志:")
    print("  docker logs autonomous-vehicle-service 2>&1 | tail -50")
    print("\n查看实时日志:")
    print("  docker logs -f autonomous-vehicle-service")

if __name__ == "__main__":
    main()

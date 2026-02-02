#!/bin/bash

# 新石器无人车接口测试脚本
# 用于测试数据接收和导出功能

BASE_URL="http://localhost:8060"
# 如果服务在远程服务器，可以修改为：
# BASE_URL="http://your-server-ip:8060"

echo "=========================================="
echo "新石器无人车接口测试"
echo "=========================================="
echo ""

# 颜色定义
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 测试1: 检查服务是否运行
echo -e "${YELLOW}[测试1] 检查服务状态...${NC}"
if curl -s -o /dev/null -w "%{http_code}" "$BASE_URL/vehicle/online_count" | grep -q "200"; then
    echo -e "${GREEN}✓ 服务运行正常${NC}"
else
    echo -e "${RED}✗ 服务未运行或无法访问${NC}"
    echo "请确保服务已启动: cd autonomous-vehicle && docker-compose up -d"
    exit 1
fi
echo ""

# 测试2: 获取在线车辆数量
echo -e "${YELLOW}[测试2] 获取在线车辆数量...${NC}"
ONLINE_COUNT=$(curl -s "$BASE_URL/vehicle/online_count" | jq -r '.data.onlineCount // .data // "N/A"')
echo -e "${GREEN}在线车辆数: $ONLINE_COUNT${NC}"
echo ""

# 测试3: 获取车辆列表
echo -e "${YELLOW}[测试3] 获取车辆列表...${NC}"
VEHICLE_LIST=$(curl -s "$BASE_URL/vehicle/list")
if echo "$VEHICLE_LIST" | jq -e '.data' > /dev/null 2>&1; then
    VEHICLE_COUNT=$(echo "$VEHICLE_LIST" | jq '.data | length')
    echo -e "${GREEN}✓ 成功获取车辆列表，共 $VEHICLE_COUNT 辆车${NC}"
    
    # 显示前3辆车的信息
    if [ "$VEHICLE_COUNT" -gt 0 ]; then
        echo "前3辆车信息:"
        echo "$VEHICLE_LIST" | jq -r '.data[0:3] | .[] | "  - VIN: \(.vin), VIN ID: \(.vinId), 车牌: \(.vinCode), 网格: \(.parkName)"'
        
        # 获取第一辆车的VIN用于后续测试
        FIRST_VIN=$(echo "$VEHICLE_LIST" | jq -r '.data[0].vin // empty')
        if [ -n "$FIRST_VIN" ]; then
            echo -e "${GREEN}使用第一辆车 VIN: $FIRST_VIN 进行后续测试${NC}"
        fi
    fi
else
    echo -e "${RED}✗ 获取车辆列表失败${NC}"
    echo "响应: $VEHICLE_LIST"
    FIRST_VIN=""
fi
echo ""

# 测试4: 获取车辆详细信息（如果有车辆）
if [ -n "$FIRST_VIN" ]; then
    echo -e "${YELLOW}[测试4] 获取车辆详细信息 (VIN: $FIRST_VIN)...${NC}"
    VEHICLE_INFO=$(curl -s -X POST "$BASE_URL/vehicle/info" \
        -H "Content-Type: application/json" \
        -d "{\"vin\":\"$FIRST_VIN\"}")
    
    if echo "$VEHICLE_INFO" | jq -e '.data' > /dev/null 2>&1; then
        echo -e "${GREEN}✓ 成功获取车辆信息${NC}"
        echo "车辆状态:"
        echo "$VEHICLE_INFO" | jq -r '.data | {
            VIN: .vin,
            "驾驶模式": .driveMode,
            "车速(km/h)": .speed,
            "经度": .position.lon,
            "纬度": .position.lat,
            "电池电量": .realBattery,
            "是否在线": .powerState
        }'
    else
        echo -e "${RED}✗ 获取车辆信息失败${NC}"
        echo "响应: $VEHICLE_INFO"
    fi
    echo ""
else
    echo -e "${YELLOW}[测试4] 跳过（没有可用车辆）${NC}"
    echo ""
fi

# 测试5: 批量获取车辆信息
echo -e "${YELLOW}[测试5] 批量获取车辆信息...${NC}"
if [ -n "$FIRST_VIN" ]; then
    BATCH_INFO=$(curl -s -X POST "$BASE_URL/vehicle/info_list" \
        -H "Content-Type: application/json" \
        -d "{\"vin\":[\"$FIRST_VIN\"]}")
    
    if echo "$BATCH_INFO" | jq -e '.data' > /dev/null 2>&1; then
        BATCH_COUNT=$(echo "$BATCH_INFO" | jq '.data | length')
        echo -e "${GREEN}✓ 成功批量获取 $BATCH_COUNT 辆车的信息${NC}"
    else
        echo -e "${RED}✗ 批量获取车辆信息失败${NC}"
        echo "响应: $BATCH_INFO"
    fi
else
    echo -e "${YELLOW}跳过（没有可用车辆）${NC}"
fi
echo ""

# 测试6: 测试导出功能
echo -e "${YELLOW}[测试6] 测试数据导出功能...${NC}"
# 获取最近24小时的数据
END_TIME=$(date -u +"%Y-%m-%dT%H:%M:%SZ")
START_TIME=$(date -u -d "24 hours ago" +"%Y-%m-%dT%H:%M:%SZ" 2>/dev/null || date -u -v-24H +"%Y-%m-%dT%H:%M:%SZ" 2>/dev/null || date -u -d "1 day ago" +"%Y-%m-%dT%H:%M:%SZ")

EXPORT_RESPONSE=$(curl -s -X POST "$BASE_URL/vehicle/export" \
    -H "Content-Type: application/json" \
    -d "{\"startTime\":\"$START_TIME\",\"endTime\":\"$END_TIME\"}" \
    -o /tmp/vehicle_export_test.xlsx \
    -w "%{http_code}")

if [ "$EXPORT_RESPONSE" = "200" ]; then
    FILE_SIZE=$(stat -f%z /tmp/vehicle_export_test.xlsx 2>/dev/null || stat -c%s /tmp/vehicle_export_test.xlsx 2>/dev/null || echo "0")
    if [ "$FILE_SIZE" -gt 0 ]; then
        echo -e "${GREEN}✓ 导出成功！文件大小: $FILE_SIZE 字节${NC}"
        echo "导出文件保存在: /tmp/vehicle_export_test.xlsx"
        echo "可以使用以下命令查看:"
        echo "  file /tmp/vehicle_export_test.xlsx"
        echo "  或使用 Excel/LibreOffice 打开"
    else
        echo -e "${YELLOW}⚠ 导出响应成功，但文件大小为0（可能该时间段没有数据）${NC}"
    fi
else
    echo -e "${RED}✗ 导出失败，HTTP状态码: $EXPORT_RESPONSE${NC}"
    if [ -f /tmp/vehicle_export_test.xlsx ]; then
        echo "错误信息:"
        cat /tmp/vehicle_export_test.xlsx
    fi
fi
echo ""

# 测试7: 检查InfluxDB数据
echo -e "${YELLOW}[测试7] 检查数据存储情况...${NC}"
echo "提示: 数据会通过后台任务自动从新石器API获取并存储到InfluxDB"
echo "可以通过查看服务日志确认数据接收情况:"
echo "  docker logs autonomous-vehicle-service 2>&1 | tail -50"
echo ""

echo "=========================================="
echo "测试完成"
echo "=========================================="
echo ""
echo "如果测试失败，请检查:"
echo "1. 服务是否正常运行: docker ps | grep autonomous"
echo "2. 配置文件是否正确: autonomous-vehicle/etc/autonomousvehicle.yaml"
echo "3. 新石器API凭证是否正确（ClientID, ClientSecret）"
echo "4. 网络连接是否正常（能否访问新石器API）"
echo "5. InfluxDB是否正常运行: docker ps | grep influxdb"

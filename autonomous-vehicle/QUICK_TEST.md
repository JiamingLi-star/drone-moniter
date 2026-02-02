# 快速测试命令参考

## 一键测试

```bash
cd autonomous-vehicle

# 使用Python脚本（推荐）
python3 test_api.py

# 或使用Bash脚本
./test_api.sh
```

## 手动测试命令

### 1. 检查服务状态
```bash
curl http://localhost:8060/vehicle/online_count
```

### 2. 获取车辆列表
```bash
curl http://localhost:8060/vehicle/list | jq
```

### 3. 获取车辆信息（替换VIN）
```bash
curl -X POST http://localhost:8060/vehicle/info \
  -H "Content-Type: application/json" \
  -d '{"vin":"YOUR_VIN"}' | jq
```

### 4. 批量获取车辆信息
```bash
curl -X POST http://localhost:8060/vehicle/info_list \
  -H "Content-Type: application/json" \
  -d '{"vin":["VIN1","VIN2"]}' | jq
```

### 5. 导出数据（最近24小时）
```bash
START=$(date -u -d "24 hours ago" +"%Y-%m-%dT%H:%M:%SZ")
END=$(date -u +"%Y-%m-%dT%H:%M:%SZ")

curl -X POST http://localhost:8060/vehicle/export \
  -H "Content-Type: application/json" \
  -d "{\"startTime\":\"$START\",\"endTime\":\"$END\"}" \
  -o vehicle_records.xlsx
```

## 查看日志

```bash
# 实时日志
docker logs -f autonomous-vehicle-service

# 最近50行
docker logs autonomous-vehicle-service 2>&1 | tail -50

# 搜索错误
docker logs autonomous-vehicle-service 2>&1 | grep -i error
```

## 检查服务

```bash
# 检查容器状态
docker ps | grep autonomous

# 检查端口
netstat -tulpn | grep 8060

# 重启服务
cd autonomous-vehicle && docker-compose restart
```

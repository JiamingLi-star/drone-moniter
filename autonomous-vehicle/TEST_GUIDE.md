# 新石器无人车接口测试指南

本文档说明如何测试新石器无人车接口的数据接收和导出功能。

## 前置条件

1. **服务已启动**
   ```bash
   cd autonomous-vehicle
   docker-compose up -d
   ```

2. **检查服务状态**
   ```bash
   docker ps | grep autonomous
   ```

3. **确认配置文件正确**
   - 检查 `etc/autonomousvehicle.yaml` 中的配置
   - 确认 `ClientID` 和 `ClientSecret` 正确
   - 确认 `TokenURL` 指向正确的环境（测试/生产）

## 测试方法

### 方法1: 使用Python测试脚本（推荐）

```bash
cd autonomous-vehicle
python3 test_api.py
```

或者如果服务在远程服务器：
```bash
# 修改 test_api.py 中的 BASE_URL
python3 test_api.py
```

### 方法2: 使用Bash测试脚本

```bash
cd autonomous-vehicle
./test_api.sh
```

### 方法3: 手动测试（使用curl）

#### 1. 检查服务状态
```bash
curl http://localhost:8060/vehicle/online_count
```

#### 2. 获取车辆列表
```bash
curl http://localhost:8060/vehicle/list
```

#### 3. 获取车辆详细信息
```bash
# 替换 VIN 为实际的车辆VIN
curl -X POST http://localhost:8060/vehicle/info \
  -H "Content-Type: application/json" \
  -d '{"vin":"YOUR_VIN_HERE"}'
```

#### 4. 批量获取车辆信息
```bash
curl -X POST http://localhost:8060/vehicle/info_list \
  -H "Content-Type: application/json" \
  -d '{"vin":["VIN1","VIN2"]}'
```

#### 5. 测试数据导出
```bash
# 导出最近24小时的数据
START_TIME=$(date -u -d "24 hours ago" +"%Y-%m-%dT%H:%M:%SZ")
END_TIME=$(date -u +"%Y-%m-%dT%H:%M:%SZ")

curl -X POST http://localhost:8060/vehicle/export \
  -H "Content-Type: application/json" \
  -d "{\"startTime\":\"$START_TIME\",\"endTime\":\"$END_TIME\"}" \
  -o vehicle_records.xlsx
```

## 测试检查清单

### 数据接收测试

- [ ] **服务状态检查**
  - 服务是否正常运行
  - 端口8060是否可访问

- [ ] **获取Token**
  - 检查是否能成功获取新石器API的token
  - 查看日志确认token获取成功

- [ ] **获取车辆列表**
  - 是否能成功调用 `/vehicle/list` 接口
  - 返回的车辆列表是否正确

- [ ] **获取车辆信息**
  - 是否能成功调用 `/vehicle/info` 接口
  - 返回的车辆状态信息是否完整

- [ ] **数据存储**
  - 检查数据是否成功存储到InfluxDB
  - 查看服务日志确认数据保存成功

### 数据导出测试

- [ ] **导出接口**
  - 是否能成功调用 `/vehicle/export` 接口
  - 返回的Excel文件是否可正常打开

- [ ] **导出数据完整性**
  - 导出的数据是否包含所有必要字段
  - 时间范围是否正确
  - 数据量是否合理

## 查看日志

### 查看服务日志
```bash
# 查看最近50行日志
docker logs autonomous-vehicle-service 2>&1 | tail -50

# 实时查看日志
docker logs -f autonomous-vehicle-service

# 查看应用日志文件（如果在容器内）
docker exec autonomous-vehicle-service tail -f /app/log/app.log
```

### 关键日志信息

1. **Token获取**
   - 查找 "GetToken" 或 "access_token" 相关日志
   - 确认token获取成功

2. **API调用**
   - 查找 "HTTP Request" 相关日志
   - 确认请求URL和参数正确

3. **数据保存**
   - 查找 "SaveVehicleInfo" 或 "InfluxDao" 相关日志
   - 确认数据保存成功

4. **错误信息**
   - 查找 "error" 或 "Error" 相关日志
   - 根据错误信息排查问题

## 常见问题排查

### 1. 服务无法启动

**检查项：**
- Docker是否运行: `docker ps`
- 端口是否被占用: `netstat -tulpn | grep 8060`
- 配置文件是否正确: `cat etc/autonomousvehicle.yaml`

**解决方法：**
```bash
# 查看详细错误信息
docker logs autonomous-vehicle-service

# 重启服务
docker-compose restart
```

### 2. 无法获取车辆列表

**检查项：**
- 新石器API凭证是否正确（ClientID, ClientSecret）
- 网络连接是否正常（能否访问新石器API）
- Token是否有效

**解决方法：**
```bash
# 测试新石器API连接
curl "https://scapi.neolix.net/auth/oauth/token?grant_type=client_credentials&client_id=YOUR_CLIENT_ID&client_secret=YOUR_CLIENT_SECRET"

# 查看服务日志中的错误信息
docker logs autonomous-vehicle-service 2>&1 | grep -i error
```

### 3. 数据未保存到InfluxDB

**检查项：**
- InfluxDB是否正常运行
- InfluxDB连接配置是否正确
- 网络连接是否正常

**解决方法：**
```bash
# 检查InfluxDB容器
docker ps | grep influxdb

# 测试InfluxDB连接
docker exec influxdb influx ping

# 查看数据保存日志
docker logs autonomous-vehicle-service 2>&1 | grep -i "SaveVehicleInfo\|InfluxDao"
```

### 4. 导出功能失败

**检查项：**
- 时间范围是否正确（RFC3339格式）
- InfluxDB中是否有数据
- 文件权限是否正确

**解决方法：**
```bash
# 检查InfluxDB中的数据
# 需要进入InfluxDB容器或使用InfluxDB客户端

# 查看导出接口的错误响应
curl -v -X POST http://localhost:8060/vehicle/export \
  -H "Content-Type: application/json" \
  -d '{"startTime":"2024-01-01T00:00:00Z","endTime":"2024-01-02T00:00:00Z"}'
```

## 测试环境 vs 生产环境

### 测试环境配置
- API地址: `https://scapi.test.neolix.net/`
- 测试账号: `client_id: zlt, client_secret: zlt`

### 生产环境配置
- API地址: `https://scapi.neolix.net/`
- 需要联系产品经理申请正式账号

### 切换环境

修改 `etc/autonomousvehicle.yaml`:
```yaml
# 测试环境
TokenURL: "https://scapi.test.neolix.net/auth/oauth/token"
ClientID: "zlt"
ClientSecret: "zlt"

# 生产环境
TokenURL: "https://scapi.neolix.net/auth/oauth/token"
ClientID: "your_production_client_id"
ClientSecret: "your_production_client_secret"
```

然后重启服务:
```bash
docker-compose restart
```

## 性能测试

### 压力测试（可选）

使用 `ab` 或 `wrk` 工具进行压力测试:

```bash
# 安装ab工具
sudo apt-get install apache2-utils

# 测试获取车辆列表接口
ab -n 100 -c 10 http://localhost:8060/vehicle/list

# 测试获取车辆信息接口（需要先获取VIN）
ab -n 100 -c 10 -p post_data.json -T application/json \
   http://localhost:8060/vehicle/info
```

## 联系支持

如果遇到问题，请：
1. 查看服务日志
2. 检查配置文件
3. 参考本文档的常见问题排查
4. 联系技术支持

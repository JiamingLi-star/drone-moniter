# 服务器部署指南

本文档详细说明如何将无人机监控系统部署到服务器上。

## 一、服务器环境要求

### 1.1 系统要求
- 操作系统：Linux (Ubuntu 20.04+ / CentOS 7+ 推荐)
- 内存：至少 4GB RAM
- 磁盘空间：至少 20GB 可用空间
- 网络：可访问互联网（用于下载 Docker 镜像）

### 1.2 必需软件
- Docker (版本 20.10+)
- Docker Compose (版本 2.0+)
- Nginx (用于前端和反向代理)

## 二、安装依赖

### 2.1 安装 Docker

```bash
# 更新系统包
sudo apt-get update

# 安装必要的依赖
sudo apt-get install -y \
    ca-certificates \
    curl \
    gnupg \
    lsb-release

# 添加 Docker 官方 GPG 密钥
sudo mkdir -p /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg

# 设置 Docker 仓库
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
  $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

# 安装 Docker Engine
sudo apt-get update
sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin

# 启动 Docker 服务
sudo systemctl start docker
sudo systemctl enable docker

# 将当前用户添加到 docker 组（可选，避免每次使用 sudo）
sudo usermod -aG docker $USER
# 注意：需要重新登录才能生效
```

### 2.2 安装 Docker Compose (如果使用独立版本)

```bash
# 下载最新稳定版 Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/download/v2.36.1/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose

# 赋予可执行权限
sudo chmod +x /usr/local/bin/docker-compose

# 验证安装
docker-compose --version
```

### 2.3 安装 Nginx

```bash
# 使用包管理器安装
sudo apt-get update
sudo apt-get install -y nginx

# 启动 Nginx 服务
sudo systemctl start nginx
sudo systemctl enable nginx

# 验证安装
nginx -v
```

## 三、部署步骤

### 3.1 上传项目文件

将项目文件上传到服务器，可以使用以下方式：

```bash
# 方式1：使用 git clone（如果项目在 Git 仓库中）
git clone <repository-url> /path/to/drone-moniter
cd /path/to/drone-moniter

# 方式2：使用 scp 上传
scp -r /local/path/drone-moniter user@server:/path/to/
```

### 3.2 配置 Nginx

```bash
# 1. 创建网站根目录
sudo mkdir -p /var/www/html/drone-moniter

# 2. 复制前端文件到网站根目录
sudo cp -r ./ui/* /var/www/html/drone-moniter/

# 3. 设置正确的权限
sudo chown -R www-data:www-data /var/www/html/drone-moniter
sudo chmod -R 755 /var/www/html/drone-moniter

# 4. 复制 Nginx 配置文件
# 注意：需要根据实际服务器 IP 修改 nginx_drone.conf 中的 server_name
sudo cp ./nginx_drone.conf /etc/nginx/sites-enabled/drone-moniter.conf

# 5. 编辑配置文件，修改 server_name 为实际服务器 IP 或域名
sudo nano /etc/nginx/sites-enabled/drone-moniter.conf
# 将 server_name 192.168.1.108; 改为你的服务器 IP 或域名

# 6. 测试 Nginx 配置
sudo nginx -t

# 7. 如果测试通过，重新加载 Nginx
sudo nginx -s reload
```

### 3.3 配置服务端口

在部署前，请检查并修改各服务的配置文件，确保端口不冲突：

- `drone-api/etc/drone-api.yaml` - 默认端口 19999
- `drone-stats-service/etc/dronestats.yaml` - 默认端口 8088
- `autonomous-vehicle/etc/autonomousvehicle.yaml` - 默认端口 8060
- `influxDB` - 默认端口 8086

### 3.4 启动服务

```bash
# 确保在项目根目录
cd /path/to/drone-moniter

# 给部署脚本添加执行权限
chmod +x deploy.sh
chmod +x stop.sh

# 执行部署脚本（会自动启动所有服务）
./deploy.sh
```

部署脚本会按以下顺序启动服务：
1. 创建 Docker 网络 `my-network`
2. 启动 InfluxDB 数据库
3. 启动 drone-api 服务
4. 启动 drone-stats-service 服务（包含 MySQL）

### 3.5 验证服务状态

```bash
# 检查 Docker 容器状态
docker ps

# 应该看到以下容器运行中：
# - influxdb
# - drone-service
# - drone-stats
# - drone-mysql

# 检查 Docker 网络
docker network ls
# 应该看到 my-network

# 检查服务日志（如果有问题）
docker logs drone-service
docker logs drone-stats
docker logs influxdb
docker logs drone-mysql
```

### 3.6 测试访问

```bash
# 测试前端页面
curl http://localhost:8080

# 测试 API 服务
curl http://localhost:19999

# 测试统计服务
curl http://localhost:8088

# 测试车辆服务
curl http://localhost:8060
```

## 四、防火墙配置

如果服务器启用了防火墙，需要开放相应端口：

```bash
# Ubuntu/Debian (ufw)
sudo ufw allow 8080/tcp    # Nginx 前端端口
sudo ufw allow 19999/tcp   # drone-api 端口（如果直接访问）
sudo ufw allow 8088/tcp    # drone-stats-service 端口（如果直接访问）
sudo ufw allow 8060/tcp    # autonomous-vehicle 端口（如果直接访问）

# CentOS/RHEL (firewalld)
sudo firewall-cmd --permanent --add-port=8080/tcp
sudo firewall-cmd --permanent --add-port=19999/tcp
sudo firewall-cmd --permanent --add-port=8088/tcp
sudo firewall-cmd --permanent --add-port=8060/tcp
sudo firewall-cmd --reload
```

## 五、常用操作

### 5.1 启动所有服务

```bash
./deploy.sh
```

### 5.2 停止所有服务

```bash
./stop.sh
```

### 5.3 重启单个服务

```bash
# 重启 drone-api
cd drone-api
docker-compose restart

# 重启 drone-stats-service
cd drone-stats-service
docker-compose restart

# 重启 autonomous-vehicle
cd autonomous-vehicle
docker-compose restart
```

### 5.4 查看服务日志

```bash
# 查看所有服务日志
docker logs -f drone-service
docker logs -f drone-stats
docker logs -f influxdb
docker logs -f drone-mysql

# 查看最近 100 行日志
docker logs --tail 100 drone-service
```

### 5.5 更新服务

```bash
# 停止服务
./stop.sh

# 拉取最新代码（如果使用 git）
git pull

# 重新构建并启动
./deploy.sh
```

## 六、配置说明

### 6.1 服务端口映射

| 服务 | 容器端口 | 宿主机端口 | 说明 |
|------|---------|-----------|------|
| drone-api | 19999 | 19999 | 无人机 API 服务 |
| drone-stats-service | 8088 | 8088 | 统计服务 |
| autonomous-vehicle | 8060 | 8060 | 车辆信息服务 |
| InfluxDB | 8086 | 8086 | 时序数据库 |
| MySQL | 3306 | - | 数据库（不对外暴露） |
| Nginx | 80 | 8080 | Web 服务器 |

### 6.2 数据持久化

以下目录用于数据持久化，请确保定期备份：

- `influxDB/influxdb2/` - InfluxDB 数据
- `drone-stats-service/mysql_data/` - MySQL 数据
- `drone-api/log/` - API 服务日志
- `drone-stats-service/log/` - 统计服务日志
- `drone-stats-service/data/` - 统计数据
- `drone-stats-service/backups/` - 备份文件

### 6.3 环境变量配置

主要环境变量在各服务的 `docker-compose.yml` 中配置：

- **InfluxDB**:
  - 用户名: admin
  - 密码: 12345678
  - 组织: sysu
  - Bucket: drone_data

- **MySQL**:
  - Root 密码: root123456
  - 数据库: drone
  - 用户: admin
  - 密码: 12345678

**⚠️ 重要：生产环境请修改这些默认密码！**

## 七、故障排查

### 7.1 服务无法启动

```bash
# 检查 Docker 服务状态
sudo systemctl status docker

# 检查端口占用
sudo netstat -tulpn | grep <port>

# 查看详细错误日志
docker-compose logs
```

### 7.2 网络连接问题

```bash
# 检查 Docker 网络
docker network inspect my-network

# 测试容器间网络连通性
docker exec drone-service ping drone-stats
```

### 7.3 Nginx 配置问题

```bash
# 测试配置文件语法
sudo nginx -t

# 查看 Nginx 错误日志
sudo tail -f /var/log/nginx/error.log

# 查看访问日志
sudo tail -f /var/log/nginx/access.log
```

### 7.4 数据库连接问题

```bash
# 检查 MySQL 容器
docker exec -it drone-mysql mysql -u admin -p12345678 drone

# 检查 InfluxDB 容器
docker exec -it influxdb influx ping
```

## 八、生产环境建议

1. **安全性**:
   - 修改所有默认密码
   - 配置 SSL/TLS 证书（使用 Let's Encrypt）
   - 限制数据库端口访问
   - 配置防火墙规则

2. **性能优化**:
   - 根据实际负载调整容器资源限制
   - 配置日志轮转
   - 定期清理旧数据

3. **监控**:
   - 配置服务监控（如 Prometheus + Grafana）
   - 设置告警规则
   - 定期检查日志

4. **备份**:
   - 定期备份数据库
   - 备份配置文件
   - 测试恢复流程

## 九、快速部署检查清单

- [ ] 安装 Docker 和 Docker Compose
- [ ] 安装 Nginx
- [ ] 上传项目文件到服务器
- [ ] 配置 Nginx（修改 server_name 和端口）
- [ ] 复制前端文件到 `/var/www/html/drone-moniter`
- [ ] 修改服务配置文件中的默认密码
- [ ] 执行 `./deploy.sh` 启动服务
- [ ] 验证所有容器正常运行
- [ ] 测试前端页面访问
- [ ] 测试 API 接口
- [ ] 配置防火墙规则
- [ ] 设置定期备份任务

## 十、联系与支持

如有问题，请查看各子服务的 README.md 文件获取更详细的配置说明。

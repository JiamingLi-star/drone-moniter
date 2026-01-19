#!/bin/bash

# Update script for drone-moniter
# This script will pull latest code from GitHub and restart services

set -e

echo "=========================================="
echo "开始更新代码到服务器..."
echo "=========================================="

# Step 1: Pull latest code from GitHub
echo ""
echo "步骤 1: 从 GitHub 拉取最新代码..."
git pull origin master

if [ $? -ne 0 ]; then
    echo "错误: Git pull 失败!" >&2
    exit 1
fi
echo "✓ 代码拉取成功"

# Step 2: Stop all services
echo ""
echo "步骤 2: 停止所有服务..."
./stop.sh

if [ $? -ne 0 ]; then
    echo "警告: 停止服务时出现问题，但继续执行..." >&2
fi
echo "✓ 服务已停止"

# Step 3: Update frontend files (if UI changed)
echo ""
echo "步骤 3: 更新前端文件..."
if [ -d "./ui" ]; then
    sudo mkdir -p /var/www/html/drone-moniter
    sudo cp -r ./ui/* /var/www/html/drone-moniter/
    echo "✓ 前端文件已更新"
else
    echo "⚠ 未找到 ui 目录，跳过前端更新"
fi

# Step 4: Update nginx config (if changed)
echo ""
echo "步骤 4: 更新 Nginx 配置..."
if [ -f "./nginx_drone.conf" ]; then
    sudo cp -v ./nginx_drone.conf /etc/nginx/sites-enabled/drone-moniter.conf
    sudo nginx -t
    if [ $? -eq 0 ]; then
        sudo nginx -s reload
        echo "✓ Nginx 配置已更新并重新加载"
    else
        echo "⚠ Nginx 配置测试失败，请手动检查"
    fi
else
    echo "⚠ 未找到 nginx_drone.conf，跳过 Nginx 更新"
fi

# Step 5: Rebuild and start services
echo ""
echo "步骤 5: 重新构建并启动服务..."
./deploy.sh

if [ $? -ne 0 ]; then
    echo "错误: 服务启动失败!" >&2
    exit 1
fi
echo "✓ 服务已启动"

# Step 6: Verify services
echo ""
echo "步骤 6: 验证服务状态..."
sleep 5
docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}" | grep -E "drone|influx"

echo ""
echo "=========================================="
echo "更新完成！"
echo "=========================================="
echo ""
echo "服务状态检查："
echo "  - 查看所有容器: docker ps"
echo "  - 查看服务日志: docker logs <container-name>"
echo "  - 测试前端: curl http://localhost:8080"
echo "  - 测试 API: curl http://localhost:19999"
echo ""

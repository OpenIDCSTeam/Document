# Docker/Podman 配置教程

本教程将指导您完成 Docker/Podman 容器环境的配置，使其能够被 OpenIDCS 管理。

## 概述

Docker 和 Podman 是流行的容器化平台，OpenIDCS 支持通过 TLS 加密连接远程管理容器。

### Docker vs Podman

| 特性 | Docker | Podman |
|------|--------|--------|
| 守护进程 | 需要 dockerd | 无守护进程（daemonless） |
| Root 权限 | 需要 | 支持 rootless 模式 |
| Docker Hub | 原生支持 | 兼容 |
| Compose | docker-compose | podman-compose |
| 远程 API | TCP+TLS | 兼容 Docker API |
| 推荐场景 | 通用容器化 | 安全性要求高的环境 |

## 支持的Linux发行版

OpenIDCS 提供的自动配置脚本支持以下发行版：

| 发行版 | 版本 | 包管理器 | Docker | Podman |
|--------|------|---------|--------|--------|
| Ubuntu | 18.04+ | apt | ✅ | ✅ |
| Debian | 10+ | apt | ✅ | ✅ |
| CentOS | 7/8 | yum/dnf | ✅ | ✅ |
| RHEL | 7/8/9 | yum/dnf | ✅ | ✅ |
| Rocky Linux | 8/9 | dnf | ✅ | ✅ |
| AlmaLinux | 8/9 | dnf | ✅ | ✅ |
| Fedora | 36+ | dnf | ✅ | ✅ |
| Arch Linux | Latest | pacman | ✅ | ✅ |
| Manjaro | Latest | pacman | ✅ | ✅ |

## 快速开始（推荐）

### 使用自动配置脚本

OpenIDCS 提供了自动配置脚本，可以一键完成所有配置：

```bash
# 1. 上传脚本到服务器
scp HostConfig/setups-oci.sh user@your-server:/tmp/

# 2. SSH 登录服务器
ssh user@your-server

# 3. 运行配置脚本
cd /tmp
sudo bash setups-oci.sh
```

脚本会自动完成以下操作：
- ✅ 检测系统类型和版本
- ✅ 安装 Docker 或 Podman
- ✅ 生成 TLS 证书
- ✅ 配置远程访问
- ✅ 创建网桥（docker-pub, docker-nat）
- ✅ 配置防火墙规则
- ✅ 安装 ttyd Web Terminal
- ✅ 配置开机自启动

### 脚本选项

```bash
# 查看帮助
sudo bash setups-oci.sh -h

# 强制重新安装
sudo bash setups-oci.sh -f

# 卸载容器引擎
sudo bash setups-oci.sh -d
```

## 手动配置（高级）

如果您需要更精细的控制，可以按照以下步骤手动配置。

### 步骤 1：安装 Docker

#### Ubuntu/Debian

```bash
# 更新包索引
sudo apt-get update

# 安装依赖
sudo apt-get install -y \
    ca-certificates \
    curl \
    gnupg \
    lsb-release

# 添加 Docker GPG 密钥
sudo mkdir -p /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | \
    sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
sudo chmod a+r /etc/apt/keyrings/docker.gpg

# 添加 Docker 仓库
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] \
  https://download.docker.com/linux/ubuntu \
  $(lsb_release -cs) stable" | \
  sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

# 安装 Docker
sudo apt-get update
sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin

# 启动 Docker
sudo systemctl start docker
sudo systemctl enable docker

# 验证安装
sudo docker run hello-world
```

#### CentOS/RHEL/Rocky/AlmaLinux

```bash
# 安装依赖
sudo yum install -y yum-utils

# 添加 Docker 仓库
sudo yum-config-manager --add-repo \
    https://download.docker.com/linux/centos/docker-ce.repo

# 安装 Docker
sudo yum install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin

# 启动 Docker
sudo systemctl start docker
sudo systemctl enable docker

# 验证安装
sudo docker run hello-world
```

#### Fedora

```bash
# 安装 Docker
sudo dnf -y install dnf-plugins-core
sudo dnf config-manager --add-repo \
    https://download.docker.com/linux/fedora/docker-ce.repo
sudo dnf install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin

# 启动 Docker
sudo systemctl start docker
sudo systemctl enable docker
```

#### Arch Linux

```bash
# 安装 Docker
sudo pacman -S docker docker-compose

# 启动 Docker
sudo systemctl start docker
sudo systemctl enable docker

# 添加用户到 docker 组
sudo usermod -aG docker $USER
```

### 步骤 2：配置 TLS 证书

为了安全地远程访问 Docker，需要配置 TLS 证书。

```bash
# 创建证书目录
sudo mkdir -p /etc/docker/certs
cd /etc/docker/certs

# 设置服务器 IP（替换为您的实际 IP）
SERVER_IP="your-server-ip"

# 生成 CA 证书
sudo openssl genrsa -out ca-key.pem 4096
sudo openssl req -new -x509 -days 365 -key ca-key.pem -sha256 -out ca.pem \
    -subj "/C=CN/ST=Beijing/L=Beijing/O=OpenIDCS/CN=docker-ca"

# 生成服务器证书
sudo openssl genrsa -out server-key.pem 4096
sudo openssl req -subj "/CN=$SERVER_IP" -sha256 -new -key server-key.pem \
    -out server.csr

# 配置 SAN（Subject Alternative Name）
echo "subjectAltName = IP:$SERVER_IP,IP:127.0.0.1" > extfile.cnf
echo "extendedKeyUsage = serverAuth" >> extfile.cnf

sudo openssl x509 -req -days 365 -sha256 -in server.csr \
    -CA ca.pem -CAkey ca-key.pem -CAcreateserial \
    -out server-cert.pem -extfile extfile.cnf

# 生成客户端证书
sudo openssl genrsa -out client-key.pem 4096
sudo openssl req -subj '/CN=client' -new -key client-key.pem -out client.csr
echo "extendedKeyUsage = clientAuth" > extfile-client.cnf
sudo openssl x509 -req -days 365 -sha256 -in client.csr \
    -CA ca.pem -CAkey ca-key.pem -CAcreateserial \
    -out client-cert.pem -extfile extfile-client.cnf

# 设置权限
sudo chmod 0400 ca-key.pem server-key.pem client-key.pem
sudo chmod 0444 ca.pem server-cert.pem client-cert.pem

# 清理临时文件
sudo rm -f server.csr client.csr extfile.cnf extfile-client.cnf
```

### 步骤 3：配置 Docker Daemon

编辑或创建 `/etc/docker/daemon.json`：

```json
{
  "hosts": ["unix:///var/run/docker.sock", "tcp://0.0.0.0:2376"],
  "tls": true,
  "tlsverify": true,
  "tlscacert": "/etc/docker/certs/ca.pem",
  "tlscert": "/etc/docker/certs/server-cert.pem",
  "tlskey": "/etc/docker/certs/server-key.pem",
  "log-driver": "json-file",
  "log-opts": {
    "max-size": "10m",
    "max-file": "3"
  },
  "storage-driver": "overlay2"
}
```

::: warning 注意
如果您的系统使用 systemd 管理 Docker，需要修改 systemd 配置文件。
:::

编辑 `/lib/systemd/system/docker.service`，找到 `ExecStart` 行并修改为：

```ini
ExecStart=/usr/bin/dockerd
```

重新加载并重启 Docker：

```bash
sudo systemctl daemon-reload
sudo systemctl restart docker
```

验证配置：

```bash
# 检查 Docker 是否监听 2376 端口
sudo netstat -tlnp | grep 2376

# 或使用 ss 命令
sudo ss -tlnp | grep 2376
```

### 步骤 4：创建网桥

创建公网和内网网桥：

```bash
# 创建公网网桥
sudo docker network create \
    --driver bridge \
    --subnet=172.18.0.0/16 \
    --gateway=172.18.0.1 \
    docker-pub

# 创建内网网桥
sudo docker network create \
    --driver bridge \
    --subnet=172.19.0.0/16 \
    --gateway=172.19.0.1 \
    docker-nat

# 验证网桥
sudo docker network ls
```

### 步骤 5：配置防火墙

#### Ubuntu/Debian (ufw)

```bash
# 允许 Docker API 端口
sudo ufw allow 2376/tcp

# 允许 ttyd Web Terminal 端口（可选）
sudo ufw allow 7681/tcp

# 重新加载防火墙
sudo ufw reload
```

#### CentOS/RHEL/Rocky/AlmaLinux (firewalld)

```bash
# 允许 Docker API 端口
sudo firewall-cmd --permanent --add-port=2376/tcp

# 允许 ttyd Web Terminal 端口（可选）
sudo firewall-cmd --permanent --add-port=7681/tcp

# 重新加载防火墙
sudo firewall-cmd --reload
```

#### 限制访问（推荐）

为了安全，建议只允许主控端 IP 访问：

```bash
# 使用 iptables
sudo iptables -A INPUT -p tcp --dport 2376 -s 主控端IP/24 -j ACCEPT
sudo iptables -A INPUT -p tcp --dport 2376 -j DROP

# 保存规则
sudo iptables-save | sudo tee /etc/iptables/rules.v4
```

### 步骤 6：安装 ttyd Web Terminal（可选）

ttyd 提供基于 Web 的终端访问功能。

```bash
# 下载 ttyd
cd /tmp
wget https://github.com/tsl0922/ttyd/releases/download/1.7.3/ttyd.x86_64
sudo mv ttyd.x86_64 /usr/local/bin/ttyd
sudo chmod +x /usr/local/bin/ttyd

# 创建 systemd 服务
sudo tee /etc/systemd/system/ttyd.service > /dev/null <<EOF
[Unit]
Description=ttyd Web Terminal
After=network.target

[Service]
Type=simple
ExecStart=/usr/local/bin/ttyd -p 7681 -i 0.0.0.0 bash
Restart=always
RestartSec=3

[Install]
WantedBy=multi-user.target
EOF

# 启动服务
sudo systemctl daemon-reload
sudo systemctl enable ttyd
sudo systemctl start ttyd
```

## 客户端配置

### 下载证书到主控端

在主控端执行：

```bash
# 创建证书目录
mkdir -p ~/docker-certs

# 从服务器下载证书
scp user@your-server:/etc/docker/certs/ca.pem ~/docker-certs/
scp user@your-server:/etc/docker/certs/client-cert.pem ~/docker-certs/
scp user@your-server:/etc/docker/certs/client-key.pem ~/docker-certs/
```

### 测试连接

```bash
# 使用 docker 命令测试
docker --tlsverify \
    --tlscacert=~/docker-certs/ca.pem \
    --tlscert=~/docker-certs/client-cert.pem \
    --tlskey=~/docker-certs/client-key.pem \
    -H=tcp://your-server:2376 ps

# 如果成功，应该看到容器列表（可能为空）
```

### 在 OpenIDCS 中添加主机

1. 登录 OpenIDCS Web 界面
2. 进入"主机管理"页面
3. 点击"添加主机"
4. 填写配置：
   - **主机名称**：docker-01
   - **主机类型**：Docker
   - **主机地址**：your-server-ip
   - **主机端口**：2376
   - **证书路径**：~/docker-certs
   - **公网网桥**：docker-pub
   - **内网网桥**：docker-nat
5. 点击"测试连接"
6. 点击"保存"

## 使用 Podman（替代方案）

### 安装 Podman

#### Ubuntu/Debian

```bash
sudo apt-get update
sudo apt-get install -y podman
```

#### CentOS/RHEL/Rocky/AlmaLinux

```bash
sudo yum install -y podman
```

#### Fedora

```bash
sudo dnf install -y podman
```

### 配置 Podman

Podman 兼容 Docker API，配置方式类似：

```bash
# 启用 Podman socket
sudo systemctl enable podman.socket
sudo systemctl start podman.socket

# 配置 TLS（与 Docker 相同）
# 参考上面的 TLS 配置步骤
```

## 故障排查

### 问题 1：连接被拒绝

**错误信息**：`Connection refused`

**解决方案**：

```bash
# 1. 检查 Docker 服务状态
sudo systemctl status docker

# 2. 检查端口监听
sudo netstat -tlnp | grep 2376

# 3. 检查防火墙
sudo ufw status
sudo firewall-cmd --list-ports

# 4. 查看 Docker 日志
sudo journalctl -u docker -n 50
```

### 问题 2：TLS 证书错误

**错误信息**：`TLS handshake error`

**解决方案**：

```bash
# 1. 验证证书文件存在
ls -la /etc/docker/certs/

# 2. 检查证书权限
sudo chmod 0400 /etc/docker/certs/*-key.pem
sudo chmod 0444 /etc/docker/certs/*.pem

# 3. 重新生成证书
# 参考上面的证书生成步骤
```

### 问题 3：容器无法访问网络

**解决方案**：

```bash
# 1. 检查网桥
sudo docker network ls
sudo docker network inspect docker-nat

# 2. 检查 iptables 规则
sudo iptables -L -n

# 3. 重启 Docker
sudo systemctl restart docker
```

### 问题 4：发行版特定问题

#### Ubuntu/Debian GPG 密钥错误

```bash
sudo rm /etc/apt/keyrings/docker.gpg
sudo mkdir -p /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | \
    sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
```

#### CentOS 8 Stream 仓库问题

```bash
sudo dnf config-manager --set-enabled powertools
```

#### Fedora cgroup v2 问题

```bash
# 切换到 cgroup v1
sudo grubby --update-kernel=ALL --args="systemd.unified_cgroup_hierarchy=0"
sudo reboot

# 或使用 Podman（原生支持 cgroup v2）
```

## 最佳实践

### 安全建议

1. **使用 TLS 加密**：始终启用 TLS 验证
2. **限制访问**：使用防火墙限制访问来源
3. **定期更新证书**：证书有效期为 365 天，需定期更新
4. **最小权限原则**：避免使用 root 运行容器
5. **定期更新**：及时更新 Docker/Podman 版本

### 性能优化

1. **选择合适的存储驱动**：推荐使用 overlay2
2. **配置日志轮转**：避免日志文件过大
3. **限制容器资源**：设置 CPU 和内存限制
4. **使用镜像缓存**：配置本地镜像仓库

### 监控与维护

```bash
# 查看 Docker 状态
sudo docker info

# 查看容器资源使用
sudo docker stats

# 清理未使用的资源
sudo docker system prune -a

# 查看日志
sudo journalctl -u docker -f
```

## 下一步

- 📖 查看 [LXC/LXD 配置](/vm/lxd) 配置另一种容器技术
- 🖥️ 查看 [VMware 配置](/vm/vmware) 配置虚拟机平台
- 🚀 返回 [快速上手](/guide/quick-start) 开始使用

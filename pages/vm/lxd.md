# LXC/LXD 配置教程

本教程将指导您完成 LXC/LXD 容器环境的配置，使其能够被 OpenIDCS 远程管理。

## 概述

LXD 是基于 LXC 的下一代系统容器管理器，提供了更现代化的管理接口和远程访问能力。

### LXC vs LXD

| 特性 | LXC | LXD |
|------|-----|-----|
| 管理方式 | 命令行工具 | REST API + 命令行 |
| 远程管理 | 不支持 | 原生支持 HTTPS |
| 镜像管理 | 手动 | 自动化镜像服务器 |
| 快照 | 支持 | 增强支持 |
| 迁移 | 复杂 | 简单（实时迁移） |
| 推荐场景 | 本地使用 | 远程管理、集群 |

### 为什么选择 LXD？

- ✅ **跨平台管理**：可以从 Windows/macOS 远程管理 Linux 容器
- ✅ **安全认证**：基于 TLS 证书的安全连接
- ✅ **完整 API**：RESTful API 支持所有操作
- ✅ **高性能**：系统级容器，接近原生性能
- ✅ **易于使用**：简单的命令行和 API 接口

## 快速开始（推荐）

### 使用自动配置脚本

```bash
# 1. 上传脚本到服务器
scp HostConfig/setups-lxd.sh user@your-server:/tmp/

# 2. SSH 登录服务器
ssh user@your-server

# 3. 运行配置脚本
cd /tmp
sudo bash setups-lxd.sh
```

脚本会自动完成：
- ✅ 安装 LXD
- ✅ 初始化 LXD
- ✅ 配置远程访问
- ✅ 生成 TLS 证书
- ✅ 创建网桥（br-pub, br-nat）
- ✅ 配置防火墙
- ✅ 配置存储池

## 手动配置

### 步骤 1：安装 LXD

#### Ubuntu/Debian

```bash
# 方式 1：使用 apt 安装（Ubuntu 18.04+）
sudo apt update
sudo apt install -y lxd

# 方式 2：使用 snap 安装（推荐，获取最新版本）
sudo snap install lxd
```

#### 其他发行版

```bash
# CentOS/RHEL（需要 EPEL 仓库）
sudo yum install -y epel-release
sudo yum install -y snapd
sudo systemctl enable --now snapd.socket
sudo snap install lxd

# Arch Linux
sudo pacman -S lxd
```

### 步骤 2：初始化 LXD

```bash
# 运行初始化向导
sudo lxd init
```

初始化过程中的选项：

```
Would you like to use LXD clustering? (yes/no) [default=no]: no
Do you want to configure a new storage pool? (yes/no) [default=yes]: yes
Name of the new storage pool [default=default]: default
Name of the storage backend to use (dir, lvm, zfs, btrfs, ceph) [default=zfs]: dir
Would you like to connect to a MAAS server? (yes/no) [default=no]: no
Would you like to create a new local network bridge? (yes/no) [default=yes]: yes
What should the new bridge be called? [default=lxdbr0]: lxdbr0
What IPv4 address should be used? (CIDR subnet notation, "auto" or "none") [default=auto]: auto
What IPv6 address should be used? (CIDR subnet notation, "auto" or "none") [default=auto]: none
Would you like the LXD server to be available over the network? (yes/no) [default=no]: yes
Address to bind LXD to (not including port) [default=all]: all
Port to bind LXD to [default=8443]: 8443
Trust password for new clients: [设置一个强密码]
Again: [再次输入密码]
Would you like stale cached images to be updated automatically? (yes/no) [default=yes]: yes
Would you like a YAML "lxd init" preseed to be printed? (yes/no) [default=no]: no
```

::: tip 提示
- **存储后端**：`dir` 最简单，`zfs` 性能最好
- **网络**：选择 `yes` 创建默认网桥
- **远程访问**：必须选择 `yes` 才能远程管理
- **信任密码**：用于首次连接认证
:::

### 步骤 3：配置远程访问

```bash
# 设置监听地址（如果初始化时未设置）
sudo lxc config set core.https_address "[::]:8443"

# 设置信任密码
sudo lxc config set core.trust_password "your-strong-password"

# 查看配置
sudo lxc config show
```

### 步骤 4：创建网桥

```bash
# 创建公网网桥
sudo lxc network create br-pub \
    ipv4.address=none \
    ipv6.address=none \
    ipv4.nat=false \
    ipv6.nat=false

# 创建内网网桥（带 NAT）
sudo lxc network create br-nat \
    ipv4.address=10.0.0.1/24 \
    ipv4.nat=true \
    ipv6.address=none

# 查看网桥
sudo lxc network list
```

### 步骤 5：配置防火墙

```bash
# Ubuntu/Debian
sudo ufw allow 8443/tcp
sudo ufw reload

# CentOS/RHEL
sudo firewall-cmd --permanent --add-port=8443/tcp
sudo firewall-cmd --reload
```

### 步骤 6：导出客户端证书

```bash
# 查找证书位置
# snap 安装：/var/snap/lxd/common/config/
# apt 安装：/var/lib/lxd/

# 导出证书（snap 安装）
sudo cp /var/snap/lxd/common/config/client.crt /tmp/
sudo cp /var/snap/lxd/common/config/client.key /tmp/
sudo chmod 644 /tmp/client.crt /tmp/client.key

# 或者（apt 安装）
sudo cp /var/lib/lxd/client.crt /tmp/
sudo cp /var/lib/lxd/client.key /tmp/
sudo chmod 644 /tmp/client.crt /tmp/client.key
```

## 客户端配置

### 下载证书到主控端

```bash
# 创建证书目录
mkdir -p ~/lxd-certs

# 从服务器下载证书
scp user@your-server:/tmp/client.crt ~/lxd-certs/
scp user@your-server:/tmp/client.key ~/lxd-certs/
```

### 测试连接

#### 方式 1：使用 lxc 命令（需要安装 LXD 客户端）

```bash
# 添加远程服务器
lxc remote add myserver https://your-server:8443
# 输入信任密码

# 列出远程服务器
lxc remote list

# 测试连接
lxc list myserver:
```

#### 方式 2：使用 Python 测试

```python
from pylxd import Client

# 连接到 LXD
client = Client(
    endpoint='https://your-server:8443',
    cert=('~/lxd-certs/client.crt', '~/lxd-certs/client.key'),
    verify=False  # 生产环境应该验证证书
)

# 测试连接
print(client.api.get().json())

# 列出容器
containers = client.containers.all()
print(f"Found {len(containers)} containers")
```

### 在 OpenIDCS 中添加主机

1. 登录 OpenIDCS Web 界面
2. 进入"主机管理"页面
3. 点击"添加主机"
4. 填写配置：
   - **主机名称**：lxd-01
   - **主机类型**：LXD
   - **主机地址**：your-server-ip
   - **主机端口**：8443
   - **证书路径**：~/lxd-certs
   - **公网网桥**：br-pub
   - **内网网桥**：br-nat
   - **容器路径**：/var/lib/lxd/containers（snap）或 /var/snap/lxd/common/lxd/containers（apt）
5. 点击"测试连接"
6. 点击"保存"

## 容器管理

### 创建容器

```bash
# 从镜像创建容器
sudo lxc launch ubuntu:22.04 my-container

# 创建但不启动
sudo lxc init ubuntu:22.04 my-container

# 指定配置
sudo lxc launch ubuntu:22.04 my-container \
    -c limits.cpu=2 \
    -c limits.memory=4GB
```

### 管理容器

```bash
# 列出容器
sudo lxc list

# 启动容器
sudo lxc start my-container

# 停止容器
sudo lxc stop my-container

# 重启容器
sudo lxc restart my-container

# 删除容器
sudo lxc delete my-container --force

# 进入容器
sudo lxc exec my-container -- bash
```

### 配置容器

```bash
# 设置 CPU 限制
sudo lxc config set my-container limits.cpu 2

# 设置内存限制
sudo lxc config set my-container limits.memory 4GB

# 设置磁盘限制
sudo lxc config device override my-container root size=20GB

# 添加网卡
sudo lxc config device add my-container eth0 nic \
    nictype=bridged \
    parent=br-nat \
    name=eth0
```

### 快照和备份

```bash
# 创建快照
sudo lxc snapshot my-container snap1

# 列出快照
sudo lxc info my-container

# 恢复快照
sudo lxc restore my-container snap1

# 删除快照
sudo lxc delete my-container/snap1

# 导出容器
sudo lxc export my-container my-container.tar.gz

# 导入容器
sudo lxc import my-container.tar.gz
```

## 镜像管理

### 使用官方镜像

```bash
# 列出可用镜像
sudo lxc image list images:

# 列出 Ubuntu 镜像
sudo lxc image list images: ubuntu

# 下载镜像
sudo lxc image copy images:ubuntu/22.04 local: --alias ubuntu-22.04

# 列出本地镜像
sudo lxc image list
```

### 自定义镜像

```bash
# 从容器创建镜像
sudo lxc publish my-container --alias my-custom-image

# 从快照创建镜像
sudo lxc publish my-container/snap1 --alias my-snapshot-image

# 导出镜像
sudo lxc image export my-custom-image

# 导入镜像
sudo lxc image import image.tar.gz --alias imported-image
```

## 网络配置

### 配置静态 IP

```bash
# 方式 1：使用 cloud-init
sudo lxc config set my-container cloud-init.network-config - <<EOF
version: 2
ethernets:
  eth0:
    addresses:
      - 252.227.81.100/24
    gateway4: 10.0.0.1
    nameservers:
      addresses:
        - 8.8.8.8
        - 8.8.4.4
EOF

# 方式 2：直接编辑容器内配置
sudo lxc exec my-container -- bash
# 然后编辑 /etc/netplan/50-cloud-init.yaml
```

### 端口转发

```bash
# 添加代理设备（端口转发）
sudo lxc config device add my-container myport80 proxy \
    listen=tcp:0.0.0.0:8080 \
    connect=tcp:127.0.0.1:80

# 删除代理
sudo lxc config device remove my-container myport80
```

## 故障排查

### 问题 1：无法连接到 LXD

**错误信息**：`Unable to connect to LXD`

**解决方案**：

```bash
# 1. 检查 LXD 服务状态
sudo systemctl status lxd
sudo systemctl status snap.lxd.daemon

# 2. 检查监听端口
sudo netstat -tlnp | grep 8443
sudo ss -tlnp | grep 8443

# 3. 检查防火墙
sudo ufw status
sudo firewall-cmd --list-ports

# 4. 查看 LXD 日志
sudo journalctl -u lxd -n 50
sudo journalctl -u snap.lxd.daemon -n 50
```

### 问题 2：证书认证失败

**解决方案**：

```bash
# 1. 重新生成证书
sudo lxd init --auto

# 2. 添加客户端证书到信任列表
sudo lxc config trust add client.crt

# 3. 或使用信任密码
sudo lxc config set core.trust_password "new-password"
```

### 问题 3：容器无法启动

**解决方案**：

```bash
# 1. 查看容器日志
sudo lxc info my-container --show-log

# 2. 检查存储空间
sudo lxc storage list
sudo lxc storage info default

# 3. 检查网络配置
sudo lxc network list
sudo lxc network show br-nat
```

### 问题 4：网络不通

**解决方案**：

```bash
# 1. 检查网桥状态
sudo lxc network show br-nat
ip link show br-nat

# 2. 检查 iptables 规则
sudo iptables -L -n -v
sudo iptables -t nat -L -n -v

# 3. 重启网络
sudo lxc network delete br-nat
sudo lxc network create br-nat ipv4.address=10.0.0.1/24 ipv4.nat=true
```

## 高级配置

### 资源限制

```bash
# CPU 限制
sudo lxc config set my-container limits.cpu 2
sudo lxc config set my-container limits.cpu.allowance 50%

# 内存限制
sudo lxc config set my-container limits.memory 4GB
sudo lxc config set my-container limits.memory.enforce hard

# 磁盘 I/O 限制
sudo lxc config device set my-container root limits.read 20MB
sudo lxc config device set my-container root limits.write 10MB

# 网络带宽限制
sudo lxc config device set my-container eth0 limits.ingress 100Mbit
sudo lxc config device set my-container eth0 limits.egress 100Mbit
```

### 安全配置

```bash
# 启用安全特性
sudo lxc config set my-container security.nesting true
sudo lxc config set my-container security.privileged false

# 限制系统调用
sudo lxc config set my-container raw.lxc "lxc.seccomp.profile = /path/to/seccomp/profile"

# 设置 AppArmor 配置
sudo lxc config set my-container raw.apparmor "profile my-container flags=(attach_disconnected,mediate_deleted) {"
```

### 存储配置

```bash
# 创建存储池
sudo lxc storage create mypool dir source=/data/lxd

# 使用存储池
sudo lxc launch ubuntu:22.04 my-container -s mypool

# 添加额外磁盘
sudo lxc storage volume create mypool data-vol
sudo lxc config device add my-container data disk \
    pool=mypool \
    source=data-vol \
    path=/mnt/data
```

## 最佳实践

### 性能优化

1. **使用 ZFS 存储**：提供更好的性能和快照功能
2. **合理分配资源**：避免过度分配 CPU 和内存
3. **使用镜像缓存**：减少重复下载
4. **定期清理**：删除未使用的镜像和快照

### 安全建议

1. **使用 TLS 证书**：始终启用证书认证
2. **限制网络访问**：使用防火墙限制访问来源
3. **定期更新**：及时更新 LXD 和容器镜像
4. **最小权限**：避免使用特权容器
5. **监控日志**：定期检查系统日志

### 备份策略

```bash
# 定期备份脚本
#!/bin/bash
DATE=$(date +%Y%m%d)
BACKUP_DIR="/backup/lxd"

# 备份所有容器
for container in $(lxc list -c n --format csv); do
    lxc export $container $BACKUP_DIR/${container}_${DATE}.tar.gz
done

# 保留最近 7 天的备份
find $BACKUP_DIR -name "*.tar.gz" -mtime +7 -delete
```

## 下一步

- 🐳 查看 [Docker 配置](/vm/docker) 了解容器化应用管理
- 🖥️ 查看 [VMware 配置](/vm/vmware) 配置虚拟机平台
- 🚀 返回 [快速上手](/guide/quick-start) 开始使用

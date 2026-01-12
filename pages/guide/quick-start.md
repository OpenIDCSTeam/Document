# 快速上手

本指南将帮助您在 5 分钟内快速部署并开始使用 OpenIDCS。

## 环境要求

在开始之前，请确保您的系统满足以下要求：

### 系统要求

| 组件 | 最低要求 | 推荐配置 |
|------|----------|----------|
| **操作系统** | Windows 10 / Ubuntu 18.04 / CentOS 7 / macOS 10.14 | Windows Server 2019 / Ubuntu 20.04 LTS / CentOS 8 / macOS 12 |
| **Python** | 3.8.0 | 3.9.x 或 3.10.x |
| **内存** | 4GB RAM | 8GB+ RAM |
| **存储** | 2GB 可用空间 | 10GB+ 可用空间 |
| **CPU** | 双核处理器 | 四核+ 处理器 |

### 网络端口

确保以下端口未被占用：

| 端口 | 用途 |
|------|------|
| **1880** | Web管理界面 |
| **6080** | VNC代理服务 |
| **7681** | WebSocket终端 |

## 快速安装

### Windows 环境

```batch
:: 1. 下载项目
git clone https://github.com/OpenIDCSTeam/OpenIDCS-Client.git
cd OpenIDCS-Client

:: 2. 安装依赖
pip install -r HostConfig/requirements.txt

:: 3. 启动服务
python HostServer.py

:: 4. 访问管理界面
:: 打开浏览器访问 http://localhost:1880
```

### Linux 环境（Ubuntu/Debian）

```bash
# 1. 安装系统依赖
sudo apt update
sudo apt install -y python3 python3-pip python3-venv git

# 2. 下载项目
git clone https://github.com/OpenIDCSTeam/OpenIDCS-Client.git
cd OpenIDCS-Client

# 3. 创建虚拟环境（推荐）
python3 -m venv venv
source venv/bin/activate

# 4. 安装依赖
pip install --upgrade pip
pip install -r HostConfig/requirements.txt

# 5. 启动服务
python HostServer.py

# 6. 访问管理界面
# 打开浏览器访问 http://localhost:1880
```

### Linux 环境（CentOS/RHEL）

```bash
# 1. 安装系统依赖
sudo yum update -y
sudo yum install -y python3 python3-pip git gcc python3-devel

# 2. 下载项目
git clone https://github.com/OpenIDCSTeam/OpenIDCS-Client.git
cd OpenIDCS-Client

# 3. 创建虚拟环境
python3 -m venv venv
source venv/bin/activate

# 4. 安装依赖
pip install --upgrade pip
pip install -r HostConfig/requirements.txt

# 5. 启动服务
python HostServer.py
```

### macOS 环境

```bash
# 1. 安装 Homebrew（如果未安装）
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# 2. 安装 Python
brew install python@3.9

# 3. 下载项目
git clone https://github.com/OpenIDCSTeam/OpenIDCS-Client.git
cd OpenIDCS-Client

# 4. 创建虚拟环境
python3 -m venv venv
source venv/bin/activate

# 5. 安装依赖
pip install --upgrade pip
pip install -r HostConfig/requirements.txt

# 6. 启动服务
python HostServer.py
```

## 首次登录

### 1. 访问管理界面

启动服务后，打开浏览器访问：

```
http://localhost:1880
```

### 2. 获取访问Token

首次启动时，系统会在控制台输出访问Token，类似于：

```
========================================
OpenIDCS Server Started Successfully!
========================================
Access Token: abc123def456ghi789jkl012mno345pqr678stu901vwx234yz
Web Interface: http://localhost:1880
========================================
```

### 3. 使用Token登录

在登录页面输入Token即可登录系统。

### 4. 创建管理员账户

首次登录后，建议立即创建管理员账户：

1. 进入"用户管理"页面
2. 点击"创建用户"
3. 填写用户信息：
   - 用户名：admin
   - 密码：设置强密码
   - 邮箱：管理员邮箱
   - 角色：管理员
4. 点击"创建"

## 添加虚拟化主机

### 添加 VMware Workstation 主机

1. 进入"主机管理"页面
2. 点击"添加主机"
3. 填写主机信息：
   - **主机名称**：workstation-01
   - **主机类型**：VMware Workstation
   - **主机地址**：192.168.1.100
   - **用户名**：administrator
   - **密码**：主机密码
   - **虚拟机路径**：C:\Virtual Machines\
4. 点击"测试连接"验证配置
5. 点击"保存"

### 添加 Docker 主机

1. 进入"主机管理"页面
2. 点击"添加主机"
3. 填写主机信息：
   - **主机名称**：docker-01
   - **主机类型**：Docker
   - **主机地址**：192.168.1.101
   - **证书路径**：/path/to/certs
   - **网桥配置**：docker-pub, docker-nat
4. 点击"测试连接"
5. 点击"保存"

::: tip 提示
添加主机前，请确保已完成相应的虚拟化平台配置。详见：
- [Docker/Podman 配置](/vm/docker)
- [LXC/LXD 配置](/vm/lxd)
- [VMware 配置](/vm/vmware)
:::

## 创建第一个虚拟机

### 1. 进入虚拟机管理

点击左侧菜单的"虚拟机管理"。

### 2. 创建虚拟机

点击"创建虚拟机"按钮，填写配置：

#### 基本信息
- **虚拟机名称**：test-vm-01
- **所属主机**：选择已添加的主机
- **操作系统**：选择操作系统模板

#### 资源配置
- **CPU核心数**：2
- **内存大小**：4 GB
- **磁盘大小**：20 GB

#### 网络配置
- **网络类型**：NAT
- **IP地址**：自动分配或手动指定

### 3. 启动虚拟机

创建完成后，点击虚拟机列表中的"启动"按钮。

### 4. 访问虚拟机

#### 通过VNC控制台

1. 点击虚拟机名称进入详情页
2. 点击"控制台"标签
3. 在浏览器中直接访问虚拟机桌面

#### 通过SSH终端

1. 点击虚拟机名称进入详情页
2. 点击"终端"标签
3. 在浏览器中打开SSH终端

## 配置网络访问

### 配置端口转发

如果需要从外部访问虚拟机的服务：

1. 进入虚拟机详情页
2. 点击"网络"标签
3. 点击"添加端口转发"
4. 配置转发规则：
   - **主机端口**：8080
   - **虚拟机端口**：80
   - **协议**：TCP
5. 点击"保存"

现在可以通过 `http://主机IP:8080` 访问虚拟机的80端口服务。

### 配置Web代理

如果需要通过域名访问虚拟机：

1. 进入"Web代理"页面
2. 点击"添加代理"
3. 配置代理规则：
   - **域名**：test.example.com
   - **目标地址**：虚拟机IP:端口
   - **SSL**：启用（可选）
4. 点击"保存"

## 用户管理

### 创建普通用户

1. 进入"用户管理"页面
2. 点击"创建用户"
3. 填写用户信息：
   - **用户名**：user01
   - **密码**：用户密码
   - **邮箱**：user01@example.com
   - **角色**：普通用户
4. 设置资源配额：
   - **CPU配额**：4核
   - **内存配额**：8 GB
   - **存储配额**：100 GB
   - **虚拟机数量**：5台
5. 设置权限：
   - ✅ 创建虚拟机
   - ✅ 修改虚拟机
   - ❌ 删除虚拟机
6. 点击"创建"

## 监控与维护

### 查看系统状态

在"仪表盘"页面可以查看：
- 主机资源使用情况
- 虚拟机运行状态
- 用户资源使用统计
- 最近操作日志

### 查看虚拟机性能

1. 进入虚拟机详情页
2. 点击"监控"标签
3. 查看实时性能图表：
   - CPU使用率
   - 内存使用率
   - 磁盘I/O
   - 网络流量

### 备份虚拟机

1. 进入虚拟机详情页
2. 点击"备份"标签
3. 点击"创建备份"
4. 输入备份说明
5. 点击"开始备份"

## 常见问题

### 无法访问管理界面

**问题**：浏览器无法打开 http://localhost:1880

**解决方案**：
1. 检查服务是否正常运行
2. 检查端口是否被占用：`netstat -ano | findstr 1880`（Windows）或 `lsof -i :1880`（Linux）
3. 检查防火墙设置

### 无法连接虚拟化主机

**问题**：添加主机时提示连接失败

**解决方案**：
1. 检查主机地址是否正确
2. 检查网络连接是否正常：`ping 主机IP`
3. 检查虚拟化平台服务是否运行
4. 检查用户名和密码是否正确
5. 查看详细错误日志

### 虚拟机创建失败

**问题**：创建虚拟机时报错

**解决方案**：
1. 检查主机资源是否充足
2. 检查操作系统模板是否存在
3. 检查用户配额是否超限
4. 查看详细错误日志

## 下一步

恭喜！您已经成功部署并开始使用 OpenIDCS。

接下来您可以：

- 📖 阅读 [配置指南](/config/server) 了解详细配置
- 🐳 学习 [虚拟机配置](/vm/docker) 配置更多虚拟化平台
- 🔧 查看 [功能概览](/guide/features) 了解更多功能
- 💬 加入 [社区讨论](https://gitter.im/OpenIDCSTeam/community) 获取帮助

## 获取帮助

如果遇到问题，可以通过以下方式获取帮助：

- 📚 查看 [完整文档](https://github.com/OpenIDCSTeam/OpenIDCS-Client/wiki)
- 🐛 提交 [Issue](https://github.com/OpenIDCSTeam/OpenIDCS-Client/issues)
- 💬 加入 [Gitter 讨论](https://gitter.im/OpenIDCSTeam/community)
- 📧 发送邮件到 openidcs@team.org

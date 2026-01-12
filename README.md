# OpenIDCS 文档站

这是 OpenIDCS 项目的官方文档站，基于 [Valaxy](https://valaxy.site/) 和 [valaxy-theme-press](https://github.com/YunYouJun/valaxy/tree/main/packages/valaxy-theme-press) 构建。

## 📚 文档内容

### 平台简介
- **项目介绍**：了解 OpenIDCS 的背景、核心优势和技术架构
- **功能概览**：详细了解 OpenIDCS 提供的各项功能
- **快速上手**：5分钟快速部署和开始使用

### 配置指南
- **受控端配置**：配置 Docker、LXD、VMware 等虚拟化平台
- **主控端配置**：部署和配置 OpenIDCS 管理服务器

### 虚拟机配置
- **Docker/Podman 配置**：详细的容器平台配置教程
- **LXC/LXD 配置**：系统容器配置指南
- **VMware 配置**：VMware Workstation 和 ESXi 配置

### 关于项目
- **开源协议**：AGPLv3 许可证说明
- **免责声明**：使用风险和责任限制
- **关于团队**：项目愿景、团队介绍和贡献方式

## 🚀 快速开始

### 安装依赖

```bash
cd docs
npm install
```

### 本地开发

```bash
npm run dev
```

访问 http://localhost:4859 查看文档站。

### 构建生产版本

```bash
npm run build
```

构建后的文件将输出到 `dist` 目录。

### 预览生产版本

```bash
npm run preview
```

## 📁 目录结构

```
docs/
├── package.json          # 项目配置
├── valaxy.config.ts      # Valaxy 配置文件
├── pages/                # 文档页面
│   ├── index.md          # 首页
│   ├── guide/            # 平台简介
│   │   ├── introduction.md
│   │   ├── features.md
│   │   └── quick-start.md
│   ├── config/           # 配置指南
│   │   ├── client.md
│   │   └── server.md
│   ├── vm/               # 虚拟机配置
│   │   ├── docker.md
│   │   ├── lxd.md
│   │   └── vmware.md
│   └── about/            # 关于项目
│       ├── license.md
│       ├── disclaimer.md
│       └── team.md
└── public/               # 静态资源（图片、图标等）
```

## ✨ 特性

- 📖 **清晰的文档结构**：按功能模块组织，易于查找
- 🎨 **现代化设计**：基于 valaxy-theme-press 主题
- 🔍 **全文搜索**：快速查找所需内容
- 📱 **响应式设计**：支持移动端访问
- 🌙 **深色模式**：支持深色/浅色主题切换
- 🚀 **快速加载**：静态站点生成，加载速度快

## 🛠️ 技术栈

- [Valaxy](https://valaxy.site/) - 静态站点生成器
- [valaxy-theme-press](https://github.com/YunYouJun/valaxy/tree/main/packages/valaxy-theme-press) - 文档主题
- [Vue 3](https://vuejs.org/) - 前端框架
- [Vite](https://vitejs.dev/) - 构建工具
- [Markdown](https://www.markdownguide.org/) - 文档格式

## 📝 贡献文档

欢迎贡献文档！请遵循以下步骤：

1. Fork 项目
2. 创建文档分支：`git checkout -b docs/your-feature`
3. 编辑 Markdown 文件
4. 提交更改：`git commit -am 'Add some documentation'`
5. 推送分支：`git push origin docs/your-feature`
6. 创建 Pull Request

### 文档编写规范

- 使用清晰的标题层级
- 提供代码示例和命令
- 添加必要的提示和警告
- 使用表格和列表组织信息
- 添加相关链接和参考

## 📄 许可证

文档内容采用 [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/) 许可证。

代码示例采用 [MIT License](https://opensource.org/licenses/MIT) 许可证。

## 🔗 相关链接

- [OpenIDCS 主项目](https://github.com/OpenIDCSTeam/OpenIDCS-Client)
- [Valaxy 文档](https://valaxy.site/)
- [valaxy-theme-press](https://github.com/YunYouJun/valaxy/tree/main/packages/valaxy-theme-press)

## 💬 反馈

如果您发现文档中的错误或有改进建议，请：

- 提交 [Issue](https://github.com/OpenIDCSTeam/OpenIDCS-Client/issues)
- 加入 [Gitter 讨论](https://gitter.im/OpenIDCSTeam/community)
- 发送邮件到 openidcs@team.org

---

**OpenIDCS Team** - *Open Source, Open Future*
"# Document" 

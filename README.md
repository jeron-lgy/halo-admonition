# Halo Admonition

面向 Halo 2.26+ 默认编辑器的可视化内容组件插件，让作者无需直接编写 HTML 或 Markdown 即可插入提示框、渐变按钮和外链卡片。

## 已实现

- 在默认编辑器“更多组件”中注册“提示框与按钮”。
- 同时支持 `/` Slash Command 搜索插入。
- 提示框：类型、标题、显示标题、折叠、默认展开、强调色/背景色/文字色、内置图标、自定义 Emoji/图片 URL、纯文本正文。
- 按钮：组件列表只保留一个按钮类型，可与普通文字处于同一段落，支持渐变起止色、文字、链接、内置/自定义图标及胶囊圆角；点击后在按钮所在段落下方展开设置区。旧文章中的独立按钮组继续兼容。
- 外链卡片：保留手工编辑和常用预设，并支持从 URL 或平台分享文案中自动读取标题、说明、站点图标和预览图。解析顺序为平台接口、oEmbed/Open Graph/JSON-LD、平台默认信息；内置 GitHub、Bilibili、Behance、小红书、新片场、Dribbble、ArtStation、Pinterest、官网、文档、下载、在线工具、游戏、社区和反馈预设。
- 编辑器内实时预览，作者无需接触 HTML 或 Markdown。
- 前台样式由插件直接注入并隔离常见主题全局规则；折叠使用原生 `details/summary`。
- 危险链接协议与客户输入均经过安全处理；自动读取限制为公网 HTTP(S)、80/443 端口、最多 3 次跳转和 2 MB 页面数据。

## 安装

从 GitHub Releases 下载 JAR 后，在 Halo Console 的“插件”页面上传、安装并启用。

## 构建

要求 Java 21、Node.js 20.19+/22.12+、pnpm：

```powershell
.\gradlew.bat build
```

插件包生成在 `build/libs/`。

## 开源来源

本项目包含基于以下开源项目修改或重新实现的部分：

- [acanyo/plugin-content-widgets](https://github.com/acanyo/plugin-content-widgets)：Halo 默认编辑器扩展、组件选择器和构建工程的部分实现，GPL-3.0。
- [x1renn/hexo-admonition-new](https://github.com/x1renn/hexo-admonition-new)：提示框语法、类型体系与视觉设计参考，MIT。

本项目不是上述项目的官方版本。详细来源、修改范围和许可证位置见 [THIRD_PARTY_NOTICES.md](./THIRD_PARTY_NOTICES.md)。

## 许可证

本项目整体依据 [GNU GPL v3.0 only](./LICENSE) 发布。

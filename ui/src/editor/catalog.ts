import type {
  AdmonitionAttrs,
  AdmonitionType,
  ButtonConfig,
  ButtonGroupAttrs,
  ComponentDefinition,
  ExternalCardAttrs,
  InlineButtonAttrs,
} from './types'

export interface IconDefinition {
  name: string
  label: string
  svg: string
}

export const ICONS: IconDefinition[] = [
  {
    name: 'external-link',
    label: '外链',
    svg: '<path d="M14 3h7v7M10 14 21 3M21 14v5a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5"/>',
  },
  { name: 'home', label: '首页', svg: '<path d="m3 11 9-8 9 8v10h-6v-6H9v6H3z"/>' },
  {
    name: 'gamepad',
    label: '游戏',
    svg: '<path d="M8 12h4m-2-2v4m7-2h.01M19 14h.01M6.5 7h11a4.5 4.5 0 0 1 4.3 5.8l-1.4 4.5a2.5 2.5 0 0 1-4.3.8L14.5 16h-5l-1.6 2.1a2.5 2.5 0 0 1-4.3-.8l-1.4-4.5A4.5 4.5 0 0 1 6.5 7Z"/>',
  },
  {
    name: 'cube',
    label: '工具',
    svg: '<path d="m12 3 8 4.5v9L12 21l-8-4.5v-9L12 3Zm0 9 8-4.5M12 12 4 7.5M12 12v9"/>',
  },
  {
    name: 'feedback',
    label: '反馈',
    svg: '<path d="M21 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4v8ZM8 9h8M8 13h5"/>',
  },
  {
    name: 'video',
    label: '视频',
    svg: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m10 9 5 3-5 3V9Z"/>',
  },
  {
    name: 'image',
    label: '作品',
    svg: '<rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="9" cy="9" r="2"/><path d="m4 17 5-5 4 4 2-2 5 5"/>',
  },
  {
    name: 'palette',
    label: '设计',
    svg: '<path d="M12 3a9 9 0 1 0 0 18h1.5a2 2 0 0 0 0-4H12a1.5 1.5 0 0 1 0-3h3a6 6 0 0 0 0-12h-3Z"/><circle cx="7.5" cy="10" r=".8"/><circle cx="9" cy="6.5" r=".8"/><circle cx="14" cy="6" r=".8"/>',
  },
  {
    name: 'rules',
    label: '规则',
    svg: '<path d="M9 5h6M9 3h6v4H9zM7 5H5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2M7 12l2 2 4-4M7 18h8"/>',
  },
  {
    name: 'book',
    label: '文档',
    svg: '<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20V4H6.5A2.5 2.5 0 0 0 4 6.5v13Zm0 0A2.5 2.5 0 0 0 6.5 22H20v-5"/>',
  },
  { name: 'download', label: '下载', svg: '<path d="M12 3v12m0 0 5-5m-5 5-5-5M5 21h14"/>' },
  { name: 'code', label: '代码', svg: '<path d="m8 9-4 3 4 3m8-6 4 3-4 3m-2-9-4 12"/>' },
  { name: 'mail', label: '邮件', svg: '<path d="M3 5h18v14H3zM3 6l9 7 9-7"/>' },
  {
    name: 'rocket',
    label: '火箭',
    svg: '<path d="M14 4c2.5-2.5 5-2 6-2 0 1 .5 3.5-2 6l-5 5-5-5 6-4ZM8 8l-4 1-2 3 6 1m5-5 1-4 3-2 1 6M8 16c-2 0-4 2-4 4 2 0 4-2 4-4Z"/>',
  },
  {
    name: 'link',
    label: '链接',
    svg: '<path d="M10 13a5 5 0 0 0 7.5.5l2-2a5 5 0 0 0-7-7l-1.2 1.2M14 11a5 5 0 0 0-7.5-.5l-2 2a5 5 0 0 0 7 7l1.2-1.2"/>',
  },
  { name: 'arrow-right', label: '箭头', svg: '<path d="M5 12h14m-6-6 6 6-6 6"/>' },
  {
    name: 'note',
    label: '便签',
    svg: '<path d="M5 3h14v18H5zM8 7h8M8 11h8M8 15h5"/>',
  },
  {
    name: 'info',
    label: '信息',
    svg: '<circle cx="12" cy="12" r="9"/><path d="M12 11v6M12 7h.01"/>',
  },
  {
    name: 'warning',
    label: '警告',
    svg: '<path d="M12 3 2 21h20L12 3Zm0 6v5m0 3h.01"/>',
  },
  {
    name: 'danger',
    label: '危险',
    svg: '<path d="M8 3h8l5 5v8l-5 5H8l-5-5V8l5-5Zm1 6 6 6m0-6-6 6"/>',
  },
  {
    name: 'bug',
    label: 'Bug',
    svg: '<path d="M8 8h8v9a4 4 0 0 1-8 0V8Zm2-4 2 2 2-2M4 13h4m8 0h4M5 8l3 2m11-2-3 2M5 18l3-2m11 2-3-2"/>',
  },
  {
    name: 'tip',
    label: '提示',
    svg: '<path d="M9 18h6m-5 3h4M8.5 15a7 7 0 1 1 7 0c-.8.6-1.5 1.4-1.5 2h-4c0-.6-.7-1.4-1.5-2Z"/>',
  },
  {
    name: 'success',
    label: '成功',
    svg: '<circle cx="12" cy="12" r="9"/><path d="m8 12 3 3 5-6"/>',
  },
  {
    name: 'question',
    label: '问题',
    svg: '<circle cx="12" cy="12" r="9"/><path d="M9.5 9a2.7 2.7 0 1 1 4.2 2.2c-1 .7-1.7 1.2-1.7 2.8M12 17h.01"/>',
  },
  {
    name: 'quote',
    label: '引用',
    svg: '<path d="M10 11H5a4 4 0 0 1 4-4h1v8H5m14-4h-5a4 4 0 0 1 4-4h1v8h-5"/>',
  },
]

export const ICON_MAP = new Map(ICONS.map((icon) => [icon.name, icon]))

export const ADMONITION_TYPES: Array<{
  value: AdmonitionType
  label: string
  defaultTitle: string
  icon: string
  accentColor: string
  backgroundColor: string
  textColor: string
}> = [
  { value: 'anote', label: '便签', defaultTitle: 'Note', icon: 'note', accentColor: '#448aff', backgroundColor: '#eff6ff', textColor: '#1e3a8a' },
  { value: 'info', label: '信息', defaultTitle: 'Info', icon: 'info', accentColor: '#00b8d4', backgroundColor: '#ecfeff', textColor: '#164e63' },
  { value: 'todo', label: '待办', defaultTitle: 'To Do', icon: 'rules', accentColor: '#0ea5e9', backgroundColor: '#f0f9ff', textColor: '#0c4a6e' },
  { value: 'warning', label: '警告', defaultTitle: 'Warning', icon: 'warning', accentColor: '#ff9100', backgroundColor: '#fff7ed', textColor: '#7c2d12' },
  { value: 'danger', label: '危险', defaultTitle: 'Danger', icon: 'danger', accentColor: '#ff5252', backgroundColor: '#fef2f2', textColor: '#7f1d1d' },
  { value: 'bug', label: 'Bug', defaultTitle: 'Bug', icon: 'bug', accentColor: '#ef4444', backgroundColor: '#fef2f2', textColor: '#7f1d1d' },
  { value: 'tip', label: '技巧', defaultTitle: 'Tip', icon: 'tip', accentColor: '#00bfa5', backgroundColor: '#f0fdfa', textColor: '#134e4a' },
  { value: 'success', label: '成功', defaultTitle: 'Success', icon: 'success', accentColor: '#22c55e', backgroundColor: '#f0fdf4', textColor: '#14532d' },
  { value: 'question', label: '问题', defaultTitle: 'Question', icon: 'question', accentColor: '#22c55e', backgroundColor: '#f0fdf4', textColor: '#14532d' },
  { value: 'example', label: '示例', defaultTitle: 'Example', icon: 'code', accentColor: '#7c4dff', backgroundColor: '#f5f3ff', textColor: '#4c1d95' },
  { value: 'quote', label: '引用', defaultTitle: 'Quote', icon: 'quote', accentColor: '#71717a', backgroundColor: '#f4f4f5', textColor: '#27272a' },
]

export const ADMONITION_TYPE_MAP = new Map(ADMONITION_TYPES.map((type) => [type.value, type]))

export const BUTTON_PRESETS: Array<{
  value: string
  label: string
  text: string
  icon: string
}> = [
  { value: 'external', label: '外部链接', text: '前往访问', icon: 'external-link' },
  { value: 'home', label: '首页', text: '首页', icon: 'home' },
  { value: 'games', label: '游戏', text: '游戏', icon: 'gamepad' },
  { value: 'tools', label: '工具', text: '三维工具', icon: 'cube' },
  { value: 'feedback', label: '反馈', text: '问题反馈', icon: 'feedback' },
  { value: 'rules', label: '规则', text: '社区规则', icon: 'rules' },
  { value: 'docs', label: '文档', text: '文档', icon: 'book' },
  { value: 'download', label: '下载', text: '下载', icon: 'download' },
  { value: 'github', label: 'GitHub', text: 'GitHub', icon: 'code' },
  { value: 'email', label: '邮件', text: '联系我们', icon: 'mail' },
]

export const BUTTON_PRESET_MAP = new Map(BUTTON_PRESETS.map((preset) => [preset.value, preset]))

export const EXTERNAL_CARD_PRESETS: Array<{
  value: string
  label: string
  eyebrow: string
  title: string
  description: string
  href: string
  icon: string
  accentColor: string
  backgroundColor: string
  textColor: string
}> = [
  {
    value: 'github',
    label: 'GitHub',
    eyebrow: 'GITHUB',
    title: '在 GitHub 上查看',
    description: '查看源码、Issue、发布版本与项目动态。',
    href: 'https://github.com/',
    icon: 'code',
    accentColor: '#60a5fa',
    backgroundColor: '#0f172a',
    textColor: '#f8fafc',
  },
  {
    value: 'bilibili',
    label: 'Bilibili',
    eyebrow: 'BILIBILI',
    title: '在哔哩哔哩观看',
    description: '查看视频、动态与创作者主页。',
    href: 'https://www.bilibili.com/',
    icon: 'video',
    accentColor: '#fb7299',
    backgroundColor: '#fff1f5',
    textColor: '#831843',
  },
  {
    value: 'behance',
    label: 'Behance',
    eyebrow: 'BEHANCE',
    title: '在 Behance 查看作品',
    description: '浏览完整项目、创作过程与设计师主页。',
    href: 'https://www.behance.net/',
    icon: 'palette',
    accentColor: '#1769ff',
    backgroundColor: '#eff6ff',
    textColor: '#172554',
  },
  {
    value: 'xiaohongshu',
    label: '小红书',
    eyebrow: '小红书',
    title: '在小红书查看笔记',
    description: '查看作品详情、创作说明与作者主页。',
    href: 'https://www.xiaohongshu.com/',
    icon: 'image',
    accentColor: '#ff2442',
    backgroundColor: '#fff1f2',
    textColor: '#881337',
  },
  {
    value: 'xinpianchang',
    label: '新片场',
    eyebrow: '新片场',
    title: '在新片场观看作品',
    description: '查看影片、幕后信息与创作团队。',
    href: 'https://www.xinpianchang.com/',
    icon: 'video',
    accentColor: '#f5b400',
    backgroundColor: '#fffbeb',
    textColor: '#713f12',
  },
  {
    value: 'dribbble',
    label: 'Dribbble',
    eyebrow: 'DRIBBBLE',
    title: '在 Dribbble 查看作品',
    description: '浏览设计稿、动效与创作者主页。',
    href: 'https://dribbble.com/',
    icon: 'palette',
    accentColor: '#ea4c89',
    backgroundColor: '#fdf2f8',
    textColor: '#831843',
  },
  {
    value: 'artstation',
    label: 'ArtStation',
    eyebrow: 'ARTSTATION',
    title: '在 ArtStation 查看作品',
    description: '浏览概念设计、三维作品与艺术家主页。',
    href: 'https://www.artstation.com/',
    icon: 'image',
    accentColor: '#13aff0',
    backgroundColor: '#082f49',
    textColor: '#f0f9ff',
  },
  {
    value: 'pinterest',
    label: 'Pinterest',
    eyebrow: 'PINTEREST',
    title: '在 Pinterest 查看灵感',
    description: '查看图片、灵感画板与相关创意。',
    href: 'https://www.pinterest.com/',
    icon: 'image',
    accentColor: '#e60023',
    backgroundColor: '#fff1f2',
    textColor: '#881337',
  },
  {
    value: 'website',
    label: '官方网站',
    eyebrow: 'OFFICIAL WEBSITE',
    title: '访问官方网站',
    description: '了解产品、服务与最新动态。',
    href: '#',
    icon: 'external-link',
    accentColor: '#3b82f6',
    backgroundColor: '#eff6ff',
    textColor: '#1e3a8a',
  },
  {
    value: 'docs',
    label: '文档中心',
    eyebrow: 'DOCUMENTATION',
    title: '阅读使用文档',
    description: '查看安装、配置、教程与常见问题。',
    href: '#',
    icon: 'book',
    accentColor: '#8b5cf6',
    backgroundColor: '#f5f3ff',
    textColor: '#4c1d95',
  },
  {
    value: 'download',
    label: '下载页面',
    eyebrow: 'DOWNLOAD',
    title: '下载最新版本',
    description: '获取最新安装包、更新记录与校验信息。',
    href: '#',
    icon: 'download',
    accentColor: '#06b6d4',
    backgroundColor: '#ecfeff',
    textColor: '#164e63',
  },
  {
    value: 'tools',
    label: '在线工具',
    eyebrow: 'ONLINE TOOL',
    title: '打开在线工具',
    description: '无需安装，直接在浏览器中使用。',
    href: '#',
    icon: 'cube',
    accentColor: '#14b8a6',
    backgroundColor: '#f0fdfa',
    textColor: '#134e4a',
  },
  {
    value: 'games',
    label: '游戏页面',
    eyebrow: 'GAME',
    title: '进入游戏页面',
    description: '查看玩法介绍、更新公告与相关资源。',
    href: '#',
    icon: 'gamepad',
    accentColor: '#f97316',
    backgroundColor: '#fff7ed',
    textColor: '#7c2d12',
  },
  {
    value: 'community',
    label: '社区论坛',
    eyebrow: 'COMMUNITY',
    title: '加入社区讨论',
    description: '交流经验、分享作品并获得社区帮助。',
    href: '#',
    icon: 'feedback',
    accentColor: '#22c55e',
    backgroundColor: '#f0fdf4',
    textColor: '#14532d',
  },
  {
    value: 'feedback',
    label: '问题反馈',
    eyebrow: 'FEEDBACK',
    title: '提交问题反馈',
    description: '报告问题、提出建议或查看处理进度。',
    href: '#',
    icon: 'rules',
    accentColor: '#ef4444',
    backgroundColor: '#fef2f2',
    textColor: '#7f1d1d',
  },
]

export const EXTERNAL_CARD_PRESET_MAP = new Map(
  EXTERNAL_CARD_PRESETS.map((preset) => [preset.value, preset]),
)

export const COMPONENTS: ComponentDefinition[] = [
  {
    id: 'admonition',
    title: '提示框',
    description: '提示、警告、错误、折叠说明等内容。',
    category: '提示',
    keywords: ['提示框', '警告', 'admonition', 'alert', '折叠'],
  },
  {
    id: 'inlineButton',
    title: '按钮',
    description: '可放在文字前后、不独占一行的渐变胶囊按钮。',
    category: '操作',
    keywords: ['行内按钮', '渐变', '胶囊', 'inline', 'button', '链接'],
  },
  {
    id: 'externalCard',
    title: '外链卡片',
    description: 'GitHub、官网、文档、下载等横向链接卡片。',
    category: '链接',
    keywords: ['外链', '卡片', 'GitHub', '官网', '文档', '下载', 'link', 'card'],
  },
]

export function createDefaultAdmonitionAttrs(): AdmonitionAttrs {
  const palette = ADMONITION_TYPE_MAP.get('info')!
  return {
    type: 'info',
    title: 'Info',
    showTitle: true,
    icon: 'info',
    customIcon: '',
    accentColor: palette.accentColor,
    backgroundColor: palette.backgroundColor,
    textColor: palette.textColor,
    content: '这里写提示内容。',
    collapsible: false,
    open: true,
  }
}

export function createButton(overrides: Partial<ButtonConfig> = {}): ButtonConfig {
  return {
    id: crypto.randomUUID(),
    preset: 'external',
    text: '前往访问',
    href: '#',
    icon: 'external-link',
    customIcon: '',
    iconPosition: 'after',
    shape: 'rounded',
    variant: 'primary',
    backgroundColor: '#0ea5ff',
    backgroundEndColor: '#1d3fd8',
    textColor: '#ffffff',
    newWindow: false,
    ...overrides,
  }
}

export function createDefaultButtonGroupAttrs(): ButtonGroupAttrs {
  return { buttons: [createButton()] }
}

export function createDefaultInlineButtonAttrs(): InlineButtonAttrs {
  const button = createButton({ shape: 'pill' })
  return {
    text: button.text,
    href: button.href,
    icon: button.icon,
    customIcon: button.customIcon,
    iconPosition: button.iconPosition,
    shape: button.shape,
    backgroundColor: button.backgroundColor,
    backgroundEndColor: button.backgroundEndColor,
    textColor: button.textColor,
    newWindow: button.newWindow,
  }
}

export function createDefaultExternalCardAttrs(): ExternalCardAttrs {
  const preset = EXTERNAL_CARD_PRESET_MAP.get('github')!
  return {
    preset: preset.value,
    eyebrow: preset.eyebrow,
    title: preset.title,
    description: preset.description,
    href: preset.href,
    icon: preset.icon,
    customIcon: '',
    accentColor: preset.accentColor,
    backgroundColor: preset.backgroundColor,
    textColor: preset.textColor,
    platform: preset.value,
    imageUrl: '',
    showImage: true,
    autoMetadata: true,
    newWindow: true,
  }
}

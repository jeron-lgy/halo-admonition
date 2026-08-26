export type AdmonitionType =
  | 'anote'
  | 'info'
  | 'todo'
  | 'warning'
  | 'danger'
  | 'bug'
  | 'tip'
  | 'success'
  | 'question'
  | 'example'
  | 'quote'

export interface AdmonitionAttrs {
  type: AdmonitionType
  title: string
  showTitle: boolean
  icon: string
  customIcon: string
  accentColor: string
  backgroundColor: string
  textColor: string
  content: string
  collapsible: boolean
  open: boolean
}

export type ButtonShape = 'square' | 'rounded' | 'pill'
export type ButtonVariant = 'default' | 'primary' | 'outline' | 'ghost'
export type ButtonIconPosition = 'before' | 'after'

export interface ButtonConfig {
  id: string
  preset: string
  text: string
  href: string
  icon: string
  customIcon: string
  iconPosition: ButtonIconPosition
  shape: ButtonShape
  variant: ButtonVariant
  backgroundColor: string
  backgroundEndColor: string
  textColor: string
  newWindow: boolean
}

export interface ButtonGroupAttrs {
  buttons: ButtonConfig[]
}

export interface InlineButtonAttrs {
  text: string
  href: string
  icon: string
  customIcon: string
  iconPosition: ButtonIconPosition
  backgroundColor: string
  backgroundEndColor: string
  textColor: string
  newWindow: boolean
}

export interface ExternalCardAttrs {
  preset: string
  eyebrow: string
  title: string
  description: string
  href: string
  icon: string
  customIcon: string
  accentColor: string
  backgroundColor: string
  textColor: string
  platform: string
  imageUrl: string
  showImage: boolean
  autoMetadata: boolean
  newWindow: boolean
}

export type ComponentKind = 'admonition' | 'inlineButton' | 'externalCard'

export interface ComponentDefinition {
  id: ComponentKind
  title: string
  description: string
  category: string
  keywords: string[]
}

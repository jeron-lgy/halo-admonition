import { ADMONITION_TYPE_MAP, EXTERNAL_CARD_PRESET_MAP, ICON_MAP } from './catalog'
import type {
  AdmonitionAttrs,
  ButtonConfig,
  ButtonGroupAttrs,
  ExternalCardAttrs,
  InlineButtonAttrs,
} from './types'

const SVG_NS = 'http://www.w3.org/2000/svg'

export function safeColor(value: string, fallback: string): string {
  const color = value.trim()
  return /^#(?:[\da-f]{3}|[\da-f]{6}|[\da-f]{8})$/i.test(color) ? color : fallback
}

export function safeHref(value: string): string {
  const href = value.trim()
  if (!href) return '#'
  if (/^(?:https?:|mailto:|tel:)/i.test(href)) return href
  if (/^(?:[./]|#|\?)/.test(href)) return href
  if (!/^[a-z][a-z\d+.-]*:/i.test(href)) return href
  return '#'
}

function safeImageUrl(value: string): string | undefined {
  const url = value.trim()
  if (/^https?:\/\//i.test(url) || /^\/(?!\/)/.test(url)) return url
  return undefined
}

function createIcon(iconName: string, customIcon: string): HTMLElement | SVGElement | undefined {
  const customImage = safeImageUrl(customIcon)
  if (customImage) {
    const image = document.createElement('img')
    image.src = customImage
    image.alt = ''
    image.loading = 'lazy'
    image.referrerPolicy = 'no-referrer'
    return image
  }

  if (customIcon.trim()) {
    const custom = document.createElement('span')
    custom.textContent = customIcon.trim()
    return custom
  }

  const definition = ICON_MAP.get(iconName)
  if (!definition) return undefined
  const svg = document.createElementNS(SVG_NS, 'svg')
  svg.setAttribute('viewBox', '0 0 24 24')
  svg.setAttribute('width', '20')
  svg.setAttribute('height', '20')
  svg.setAttribute('fill', 'none')
  svg.setAttribute('stroke', 'currentColor')
  svg.setAttribute('stroke-width', '1.8')
  svg.setAttribute('stroke-linecap', 'round')
  svg.setAttribute('stroke-linejoin', 'round')
  svg.setAttribute('aria-hidden', 'true')
  svg.innerHTML = definition.svg
  return svg
}

function appendIcon(parent: HTMLElement, iconName: string, customIcon: string, className: string) {
  const icon = createIcon(iconName, customIcon)
  if (!icon) return
  icon.classList.add(className)
  icon.setAttribute('aria-hidden', 'true')
  // Some Halo themes apply `svg { width: 100% }`. Inline important sizing keeps
  // article icons compact even when the theme uses an equally important reset.
  icon.style.setProperty('display', 'inline-block', 'important')
  icon.style.setProperty('width', '1.15em', 'important')
  icon.style.setProperty('height', '1.15em', 'important')
  icon.style.setProperty('max-width', '1.15em', 'important')
  icon.style.setProperty('max-height', '1.15em', 'important')
  parent.append(icon)
}

function createAdmonitionTitle(attrs: AdmonitionAttrs, tagName: 'div' | 'summary') {
  const title = document.createElement(tagName)
  title.className = 'halo-admonition-title'
  appendIcon(title, attrs.icon, attrs.customIcon, 'halo-admonition-icon')

  const text = document.createElement('span')
  text.className = 'halo-admonition-title-text'
  text.textContent = attrs.title
  title.append(text)

  if (attrs.collapsible) {
    const chevron = document.createElement('span')
    chevron.className = 'halo-admonition-chevron'
    chevron.setAttribute('aria-hidden', 'true')
    title.append(chevron)
  }
  return title
}

function createPlainTextContent(value: string) {
  const content = document.createElement('div')
  content.className = 'halo-admonition-content'
  value.split('\n').forEach((line, index, lines) => {
    content.append(document.createTextNode(line))
    if (index < lines.length - 1) content.append(document.createElement('br'))
  })
  return content
}

export function createAdmonitionElement(attrs: AdmonitionAttrs): HTMLElement {
  const palette = ADMONITION_TYPE_MAP.get(attrs.type) ?? ADMONITION_TYPE_MAP.get('info')!
  const accentColor = safeColor(attrs.accentColor, palette.accentColor)
  const backgroundColor = safeColor(attrs.backgroundColor, palette.backgroundColor)
  const textColor = safeColor(attrs.textColor, palette.textColor)
  const aside = document.createElement('aside')
  aside.className = `halo-admonition halo-admonition-${attrs.type}`
  aside.dataset.haloAdmonition = 'true'
  aside.dataset.type = attrs.type
  aside.dataset.title = attrs.title
  aside.dataset.showTitle = String(attrs.showTitle)
  aside.dataset.icon = attrs.icon
  aside.dataset.customIcon = attrs.customIcon
  aside.dataset.accentColor = accentColor
  aside.dataset.backgroundColor = backgroundColor
  aside.dataset.textColor = textColor
  aside.dataset.collapsible = String(attrs.collapsible)
  aside.dataset.open = String(attrs.open)
  aside.style.setProperty('--halo-admonition-border', accentColor)
  aside.style.setProperty('--halo-admonition-bg', backgroundColor)
  aside.style.setProperty('--halo-admonition-title-bg', `color-mix(in srgb, ${accentColor} 12%, ${backgroundColor})`)
  aside.style.setProperty('--halo-admonition-title-color', accentColor)
  aside.style.setProperty('--halo-admonition-text-color', textColor)

  const content = createPlainTextContent(attrs.content)
  if (attrs.collapsible) {
    const details = document.createElement('details')
    details.className = 'halo-admonition-details'
    details.open = attrs.open
    if (attrs.showTitle) details.append(createAdmonitionTitle(attrs, 'summary'))
    details.append(content)
    aside.append(details)
  } else {
    if (attrs.showTitle) aside.append(createAdmonitionTitle(attrs, 'div'))
    aside.append(content)
  }
  return aside
}

function textWithBreaks(element: Element | null): string {
  if (!element) return ''
  let result = ''
  for (const node of element.childNodes) {
    if (node.nodeType === Node.TEXT_NODE) result += node.textContent ?? ''
    else if (node instanceof HTMLBRElement) result += '\n'
    else if (node instanceof Element) result += textWithBreaks(node)
  }
  return result
}

export function parseAdmonitionElement(element: HTMLElement): AdmonitionAttrs {
  const rawType = element.dataset.type ?? 'info'
  const type = ADMONITION_TYPE_MAP.has(rawType as AdmonitionAttrs['type'])
    ? (rawType as AdmonitionAttrs['type'])
    : 'info'
  const typeDefinition = ADMONITION_TYPE_MAP.get(type)
  return {
    type,
    title:
      element.dataset.title ??
      element.querySelector('.halo-admonition-title-text')?.textContent ??
      typeDefinition?.defaultTitle ??
      'Info',
    showTitle: element.dataset.showTitle !== 'false',
    icon: element.dataset.icon || typeDefinition?.icon || 'info',
    customIcon: element.dataset.customIcon ?? '',
    accentColor: safeColor(element.dataset.accentColor ?? '', typeDefinition?.accentColor ?? '#00b8d4'),
    backgroundColor: safeColor(element.dataset.backgroundColor ?? '', typeDefinition?.backgroundColor ?? '#ecfeff'),
    textColor: safeColor(element.dataset.textColor ?? '', typeDefinition?.textColor ?? '#164e63'),
    content: textWithBreaks(element.querySelector('.halo-admonition-content')),
    collapsible: element.dataset.collapsible === 'true' || Boolean(element.querySelector('details')),
    open: element.dataset.open === 'true' || Boolean(element.querySelector('details[open]')),
  }
}

function createButtonElement(button: ButtonConfig): HTMLAnchorElement {
  const backgroundColor = safeColor(button.backgroundColor, '#0ea5ff')
  const backgroundEndColor = safeColor(button.backgroundEndColor, '#1d3fd8')
  const textColor = safeColor(button.textColor, '#ffffff')
  const anchor = document.createElement('a')
  anchor.className = `halo-button halo-button-${button.shape} halo-button-${button.variant}`
  anchor.href = safeHref(button.href)
  anchor.dataset.haloButton = 'true'
  anchor.dataset.id = button.id
  anchor.dataset.preset = button.preset
  anchor.dataset.icon = button.icon
  anchor.dataset.customIcon = button.customIcon
  anchor.dataset.iconPosition = button.iconPosition
  anchor.dataset.shape = button.shape
  anchor.dataset.variant = button.variant
  anchor.dataset.backgroundColor = backgroundColor
  anchor.dataset.backgroundEndColor = backgroundEndColor
  anchor.dataset.textColor = textColor
  anchor.style.setProperty('--halo-button-bg', `linear-gradient(105deg, ${backgroundColor}, ${backgroundEndColor})`)
  anchor.style.setProperty('--halo-button-bg-hover', `linear-gradient(105deg, color-mix(in srgb, ${backgroundColor} 88%, #fff), color-mix(in srgb, ${backgroundEndColor} 86%, #000))`)
  anchor.style.setProperty('--halo-button-color', textColor)
  anchor.style.setProperty('--halo-button-border', backgroundColor)
  anchor.style.setProperty('--halo-button-primary', backgroundColor)
  const borderRadius =
    button.shape === 'pill' ? '999px' : button.shape === 'square' ? '0.3rem' : '0.75rem'
  anchor.style.setProperty('border-radius', borderRadius, 'important')
  if (button.shape === 'pill') {
    anchor.style.setProperty('padding-inline', '1.15rem', 'important')
  }
  if (button.newWindow) {
    anchor.target = '_blank'
    anchor.rel = 'noopener noreferrer'
  }

  const text = document.createElement('span')
  text.className = 'halo-button-text'
  text.textContent = button.text

  const iconHost = document.createElement('span')
  iconHost.className = 'halo-button-icon-host'
  if (button.iconPosition !== 'none') {
    appendIcon(iconHost, button.icon, button.customIcon, 'halo-button-icon')
  }

  if (!iconHost.hasChildNodes()) anchor.append(text)
  else if (button.iconPosition === 'after') anchor.append(text, iconHost)
  else anchor.append(iconHost, text)
  return anchor
}

export function createButtonGroupElement(attrs: ButtonGroupAttrs): HTMLElement {
  const group = document.createElement('div')
  group.className = 'halo-button-group'
  group.dataset.haloButtonGroup = 'true'
  group.setAttribute('role', 'group')
  group.setAttribute('aria-label', '相关链接')
  attrs.buttons.forEach((button) => group.append(createButtonElement(button)))
  return group
}

export function parseButtonGroupElement(element: HTMLElement): ButtonGroupAttrs {
  const buttons = Array.from(element.querySelectorAll<HTMLAnchorElement>('[data-halo-button]')).map(
    (anchor, index): ButtonConfig => ({
      id: anchor.dataset.id || `button-${index + 1}`,
      preset: anchor.dataset.preset ?? '',
      text: anchor.querySelector('.halo-button-text')?.textContent ?? anchor.textContent ?? '按钮',
      href: anchor.getAttribute('href') ?? '#',
      icon: anchor.dataset.icon ?? '',
      customIcon: anchor.dataset.customIcon ?? '',
      iconPosition:
        anchor.dataset.iconPosition === 'none'
          ? 'none'
          : anchor.dataset.iconPosition === 'before'
            ? 'before'
            : 'after',
      shape:
        anchor.dataset.shape === 'square' || anchor.dataset.shape === 'pill'
          ? anchor.dataset.shape
          : 'rounded',
      variant:
        anchor.dataset.variant === 'primary' ||
        anchor.dataset.variant === 'outline' ||
        anchor.dataset.variant === 'ghost'
          ? anchor.dataset.variant
          : 'default',
      backgroundColor: safeColor(anchor.dataset.backgroundColor ?? '', '#0ea5ff'),
      backgroundEndColor: safeColor(anchor.dataset.backgroundEndColor ?? '', '#1d3fd8'),
      textColor: safeColor(anchor.dataset.textColor ?? '', '#ffffff'),
      newWindow: anchor.target === '_blank',
    }),
  )
  return { buttons }
}

export function createInlineButtonElement(attrs: InlineButtonAttrs): HTMLElement {
  const wrapper = document.createElement('span')
  wrapper.className = 'halo-inline-button-shell'
  wrapper.dataset.haloInlineButton = 'true'
  wrapper.dataset.text = attrs.text
  wrapper.dataset.href = attrs.href
  wrapper.dataset.icon = attrs.icon
  wrapper.dataset.customIcon = attrs.customIcon
  wrapper.dataset.iconPosition = attrs.iconPosition
  wrapper.dataset.shape = attrs.shape
  wrapper.dataset.backgroundColor = safeColor(attrs.backgroundColor, '#0ea5ff')
  wrapper.dataset.backgroundEndColor = safeColor(attrs.backgroundEndColor, '#1d3fd8')
  wrapper.dataset.textColor = safeColor(attrs.textColor, '#ffffff')
  wrapper.dataset.newWindow = String(attrs.newWindow)
  const anchor = createButtonElement({
    id: 'inline',
    preset: '',
    variant: 'primary',
    ...attrs,
  })
  anchor.classList.add('halo-inline-button')
  delete anchor.dataset.haloButton
  delete anchor.dataset.id
  delete anchor.dataset.preset
  wrapper.append(anchor)
  return wrapper
}

export function parseInlineButtonElement(element: HTMLElement): InlineButtonAttrs {
  const anchor = element.matches('a')
    ? (element as HTMLAnchorElement)
    : element.querySelector<HTMLAnchorElement>('a.halo-inline-button')
  return {
    text:
      element.dataset.text ?? anchor?.querySelector('.halo-button-text')?.textContent ?? '开始免费试用',
    href: element.dataset.href ?? anchor?.getAttribute('href') ?? '#',
    icon: element.dataset.icon ?? anchor?.dataset.icon ?? '',
    customIcon: element.dataset.customIcon ?? anchor?.dataset.customIcon ?? '',
    iconPosition:
      (element.dataset.iconPosition ?? anchor?.dataset.iconPosition) === 'none'
        ? 'none'
        : (element.dataset.iconPosition ?? anchor?.dataset.iconPosition) === 'before'
          ? 'before'
          : 'after',
    shape:
      (element.dataset.shape ?? anchor?.dataset.shape) === 'square'
        ? 'square'
        : (element.dataset.shape ?? anchor?.dataset.shape) === 'rounded'
          ? 'rounded'
          : 'pill',
    backgroundColor: safeColor(
      element.dataset.backgroundColor ?? anchor?.dataset.backgroundColor ?? '',
      '#0ea5ff',
    ),
    backgroundEndColor: safeColor(
      element.dataset.backgroundEndColor ?? anchor?.dataset.backgroundEndColor ?? '',
      '#1d3fd8',
    ),
    textColor: safeColor(element.dataset.textColor ?? anchor?.dataset.textColor ?? '', '#ffffff'),
    newWindow:
      element.dataset.newWindow === 'true' || anchor?.getAttribute('target') === '_blank',
  }
}

export function createExternalCardElement(attrs: ExternalCardAttrs): HTMLElement {
  const accentColor = safeColor(attrs.accentColor, '#60a5fa')
  const backgroundColor = safeColor(attrs.backgroundColor, '#0f172a')
  const textColor = safeColor(attrs.textColor, '#f8fafc')
  const wrapper = document.createElement('div')
  wrapper.className = 'halo-external-card-shell'
  wrapper.dataset.haloExternalCard = 'true'
  wrapper.dataset.preset = attrs.preset
  wrapper.dataset.eyebrow = attrs.eyebrow
  wrapper.dataset.title = attrs.title
  wrapper.dataset.description = attrs.description
  wrapper.dataset.icon = attrs.icon
  wrapper.dataset.customIcon = attrs.customIcon
  wrapper.dataset.accentColor = accentColor
  wrapper.dataset.backgroundColor = backgroundColor
  wrapper.dataset.textColor = textColor
  wrapper.dataset.platform = attrs.platform
  wrapper.dataset.imageUrl = attrs.imageUrl
  wrapper.dataset.showImage = String(attrs.showImage)
  wrapper.dataset.autoMetadata = String(attrs.autoMetadata)

  const card = document.createElement('a')
  card.className = 'halo-external-card'
  card.href = safeHref(attrs.href)
  card.style.setProperty('--halo-external-card-accent', accentColor)
  card.style.setProperty('--halo-external-card-bg', backgroundColor)
  card.style.setProperty('--halo-external-card-color', textColor)
  card.style.setProperty('display', 'grid', 'important')
  const imageUrl = safeImageUrl(attrs.imageUrl)
  card.style.setProperty(
    'grid-template-columns',
    imageUrl && attrs.showImage
      ? 'auto minmax(0, 1fr) minmax(5.5rem, 7.5rem) auto'
      : 'auto minmax(0, 1fr) auto',
    'important',
  )
  card.style.setProperty('width', '100%', 'important')
  card.style.setProperty('border-radius', '1rem', 'important')
  card.style.setProperty('background', backgroundColor, 'important')
  card.style.setProperty('color', textColor, 'important')
  card.setAttribute('aria-label', attrs.title || '外部链接')
  if (attrs.newWindow) {
    card.target = '_blank'
    card.rel = 'noopener noreferrer'
  }

  const iconHost = document.createElement('span')
  iconHost.className = 'halo-external-card-icon-host'
  appendIcon(iconHost, attrs.icon, attrs.customIcon, 'halo-external-card-icon')

  const copy = document.createElement('span')
  copy.className = 'halo-external-card-copy'
  if (attrs.eyebrow.trim()) {
    const eyebrow = document.createElement('span')
    eyebrow.className = 'halo-external-card-eyebrow'
    eyebrow.textContent = attrs.eyebrow
    copy.append(eyebrow)
  }
  const title = document.createElement('strong')
  title.className = 'halo-external-card-title'
  title.textContent = attrs.title
  copy.append(title)
  if (attrs.description.trim()) {
    const description = document.createElement('span')
    description.className = 'halo-external-card-description'
    description.textContent = attrs.description
    copy.append(description)
  }

  const arrow = document.createElement('span')
  arrow.className = 'halo-external-card-arrow'
  appendIcon(arrow, 'arrow-right', '', 'halo-external-card-arrow-icon')
  card.append(iconHost, copy)
  if (imageUrl && attrs.showImage) {
    const media = document.createElement('span')
    media.className = 'halo-external-card-media'
    const image = document.createElement('img')
    image.src = imageUrl
    image.alt = ''
    image.loading = 'lazy'
    image.referrerPolicy = 'no-referrer'
    media.append(image)
    card.append(media)
  }
  card.append(arrow)
  wrapper.append(card)
  return wrapper
}

export function parseExternalCardElement(element: HTMLElement): ExternalCardAttrs {
  const card = element.matches('a')
    ? (element as HTMLAnchorElement)
    : element.querySelector<HTMLAnchorElement>('a.halo-external-card')
  const presetName = element.dataset.preset ?? 'github'
  const preset =
    EXTERNAL_CARD_PRESET_MAP.get(presetName) ?? EXTERNAL_CARD_PRESET_MAP.get('github')!
  return {
    preset: presetName,
    eyebrow:
      element.dataset.eyebrow ??
      element.querySelector('.halo-external-card-eyebrow')?.textContent ??
      preset.eyebrow,
    title:
      element.dataset.title ??
      element.querySelector('.halo-external-card-title')?.textContent ??
      preset.title,
    description:
      element.dataset.description ??
      element.querySelector('.halo-external-card-description')?.textContent ??
      preset.description,
    href: card?.getAttribute('href') ?? preset.href,
    icon: element.dataset.icon ?? preset.icon,
    customIcon: element.dataset.customIcon ?? '',
    accentColor: safeColor(element.dataset.accentColor ?? '', preset.accentColor),
    backgroundColor: safeColor(element.dataset.backgroundColor ?? '', preset.backgroundColor),
    textColor: safeColor(element.dataset.textColor ?? '', preset.textColor),
    platform: element.dataset.platform ?? presetName,
    imageUrl: element.dataset.imageUrl ?? '',
    showImage: element.dataset.showImage !== 'false',
    autoMetadata: element.dataset.autoMetadata !== 'false',
    newWindow: card?.getAttribute('target') === '_blank',
  }
}

import { describe, expect, it } from 'vitest'
import { createButton, createDefaultExternalCardAttrs, createDefaultInlineButtonAttrs } from '../catalog'
import {
  createAdmonitionElement,
  createButtonGroupElement,
  createExternalCardElement,
  createInlineButtonElement,
  parseAdmonitionElement,
  parseButtonGroupElement,
  parseExternalCardElement,
  parseInlineButtonElement,
  safeColor,
  safeHref,
} from '../render'

describe('safeHref', () => {
  it('allows site links and ordinary web links', () => {
    expect(safeHref('/tools')).toBe('/tools')
    expect(safeHref('https://example.com')).toBe('https://example.com')
    expect(safeHref('mailto:hello@example.com')).toBe('mailto:hello@example.com')
  })

  it('blocks executable URL schemes', () => {
    expect(safeHref('javascript:alert(1)')).toBe('#')
    expect(safeHref('data:text/html,<script>alert(1)</script>')).toBe('#')
  })
})

describe('safeColor', () => {
  it('keeps hex colors and rejects CSS injection', () => {
    expect(safeColor('#2563eb', '#000000')).toBe('#2563eb')
    expect(safeColor('red; background:url(javascript:1)', '#000000')).toBe('#000000')
  })
})

describe('admonition rendering', () => {
  it('renders native details and keeps customer text as text', () => {
    const element = createAdmonitionElement({
      type: 'warning',
      title: '<img src=x onerror=alert(1)>',
      showTitle: true,
      icon: 'warning',
      customIcon: '',
      accentColor: '#ff9100',
      backgroundColor: '#fff7ed',
      textColor: '#7c2d12',
      content: '<script>alert(1)</script>\n第二行',
      collapsible: true,
      open: false,
    })

    expect(element.querySelector('details')).not.toBeNull()
    expect(element.querySelector('details')?.hasAttribute('open')).toBe(false)
    expect(element.querySelector('.halo-admonition-title-text')?.textContent).toBe(
      '<img src=x onerror=alert(1)>',
    )
    expect(element.querySelector('script')).toBeNull()
    expect(element.innerHTML).toContain('&lt;script&gt;')
  })

  it('round trips visual-editor attributes', () => {
    const original = {
      type: 'tip' as const,
      title: '小技巧',
      showTitle: true,
      icon: 'rocket',
      customIcon: '🚀',
      accentColor: '#00bfa5',
      backgroundColor: '#f0fdfa',
      textColor: '#134e4a',
      content: '第一行\n第二行',
      collapsible: true,
      open: true,
    }
    const parsed = parseAdmonitionElement(createAdmonitionElement(original))
    expect(parsed).toEqual(original)
  })
})

describe('button group rendering', () => {
  it('renders secure links, shapes, and icon placement', () => {
    const buttons = [
      createButton({
        id: 'safe',
        text: '前往访问',
        href: 'https://example.com',
        icon: 'external-link',
        iconPosition: 'after',
        shape: 'pill',
        variant: 'primary',
        newWindow: true,
      }),
      createButton({ id: 'unsafe', text: '<script>', href: 'javascript:alert(1)' }),
    ]
    const element = createButtonGroupElement({ buttons })
    const links = element.querySelectorAll('a')

    expect(links[0]?.classList.contains('halo-button-pill')).toBe(true)
    expect(links[0]?.target).toBe('_blank')
    expect(links[0]?.rel).toBe('noopener noreferrer')
    expect(links[0]?.lastElementChild?.classList.contains('halo-button-icon-host')).toBe(true)
    expect(links[0]?.querySelector('svg')?.style.width).toBe('1.15em')
    expect(links[0]?.style.getPropertyValue('--halo-button-bg')).toContain('linear-gradient')
    expect(links[0]?.style.getPropertyValue('--halo-button-bg')).toContain('#0ea5ff')
    expect(links[0]?.style.borderRadius).toBe('999px')
    expect(links[0]?.style.getPropertyPriority('border-radius')).toBe('important')
    expect(links[1]?.getAttribute('href')).toBe('#')
    expect(links[1]?.querySelector('script')).toBeNull()
  })

  it('round trips button configuration', () => {
    const original = createButton({
      id: 'button-1',
      preset: 'tools',
      text: '三维工具',
      href: '/tools',
      icon: 'cube',
      customIcon: '',
      iconPosition: 'after',
      shape: 'rounded',
      variant: 'outline',
      newWindow: false,
    })
    const parsed = parseButtonGroupElement(createButtonGroupElement({ buttons: [original] }))
    expect(parsed.buttons).toEqual([original])
  })
})

describe('inline button rendering', () => {
  it('renders as an inline wrapper and round trips its gradient settings', () => {
    const original = createDefaultInlineButtonAttrs()
    const element = createInlineButtonElement(original)
    const link = element.querySelector<HTMLAnchorElement>('.halo-inline-button')

    expect(element.tagName).toBe('SPAN')
    expect(element.dataset.haloInlineButton).toBe('true')
    expect(link?.style.getPropertyValue('--halo-button-bg')).toContain('linear-gradient')
    expect(parseInlineButtonElement(element)).toEqual(original)
  })

  it('supports every corner style and removes icon spacing when the icon is hidden', () => {
    const original = {
      ...createDefaultInlineButtonAttrs(),
      iconPosition: 'none' as const,
      shape: 'square' as const,
    }
    const element = createInlineButtonElement(original)
    const link = element.querySelector<HTMLAnchorElement>('.halo-inline-button')!

    expect(link.classList.contains('halo-button-square')).toBe(true)
    expect(link.style.borderRadius).toBe('0.3rem')
    expect(link.querySelector('.halo-button-icon-host')).toBeNull()
    expect(link.children).toHaveLength(1)
    expect(parseInlineButtonElement(element)).toEqual(original)
  })

  it('keeps legacy inline buttons pill-shaped when no shape was stored', () => {
    const element = createInlineButtonElement(createDefaultInlineButtonAttrs())
    element.removeAttribute('data-shape')
    element.querySelector('.halo-inline-button')?.removeAttribute('data-shape')

    expect(parseInlineButtonElement(element).shape).toBe('pill')
  })
})

describe('external card rendering', () => {
  it('renders a secure, styled GitHub card', () => {
    const element = createExternalCardElement(createDefaultExternalCardAttrs())
    const card = element.querySelector<HTMLAnchorElement>('.halo-external-card')!

    expect(element.dataset.haloExternalCard).toBe('true')
    expect(element.tagName).toBe('DIV')
    expect(card.getAttribute('href')).toBe('https://github.com/')
    expect(card.target).toBe('_blank')
    expect(element.querySelector('.halo-external-card-title')?.textContent).toBe(
      '在 GitHub 上查看',
    )
    expect(card.style.getPropertyValue('--halo-external-card-bg')).toBe('#0f172a')
    expect(card.style.display).toBe('grid')
    expect(card.style.getPropertyPriority('display')).toBe('important')
    expect(card.style.background).toBe('rgb(15, 23, 42)')
  })

  it('renders an automatically read preview image when enabled', () => {
    const element = createExternalCardElement({
      ...createDefaultExternalCardAttrs(),
      imageUrl: 'https://example.com/preview.jpg',
      showImage: true,
    })
    expect(element.querySelector('.halo-external-card-media img')?.getAttribute('src')).toBe(
      'https://example.com/preview.jpg',
    )
  })

  it('round trips editable card attributes and blocks dangerous links', () => {
    const original = {
      ...createDefaultExternalCardAttrs(),
      preset: 'docs',
      eyebrow: 'DOCS',
      title: '使用文档',
      description: '从这里开始。',
      href: 'javascript:alert(1)',
      icon: 'book',
      accentColor: '#8b5cf6',
      backgroundColor: '#f5f3ff',
      textColor: '#4c1d95',
      newWindow: false,
    }
    const element = createExternalCardElement(original)
    expect(element.querySelector('.halo-external-card')?.getAttribute('href')).toBe('#')
    expect(parseExternalCardElement(element)).toEqual({ ...original, href: '#' })
  })

  it('recovers legacy class-only cards that were parsed as normal links', () => {
    const legacy = document.createElement('a')
    legacy.className = 'halo-external-card'
    legacy.href = 'https://github.com/x1renn/hexo-admonition-new'
    legacy.innerHTML = [
      '<span class="halo-external-card-eyebrow">GITHUB</span>',
      '<strong class="halo-external-card-title">查看项目</strong>',
      '<span class="halo-external-card-description">项目源码与动态。</span>',
    ].join('')

    expect(parseExternalCardElement(legacy)).toMatchObject({
      preset: 'github',
      eyebrow: 'GITHUB',
      title: '查看项目',
      description: '项目源码与动态。',
      href: 'https://github.com/x1renn/hexo-admonition-new',
    })
  })
})

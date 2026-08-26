import AdmonitionNodeView from '@/components/AdmonitionNodeView.vue'
import ButtonGroupNodeView from '@/components/ButtonGroupNodeView.vue'
import ExternalCardNodeView from '@/components/ExternalCardNodeView.vue'
import InlineButtonNodeView from '@/components/InlineButtonNodeView.vue'
import { Node, VueNodeViewRenderer } from '@halo-dev/richtext-editor'
import {
  createDefaultAdmonitionAttrs,
  createDefaultButtonGroupAttrs,
  createDefaultExternalCardAttrs,
  createDefaultInlineButtonAttrs,
} from './catalog'
import { ADMONITION_NODE, BUTTON_GROUP_NODE, EXTERNAL_CARD_NODE, INLINE_BUTTON_NODE } from './node-names'
import {
  createAdmonitionElement,
  createButtonGroupElement,
  createExternalCardElement,
  createInlineButtonElement,
  parseAdmonitionElement,
  parseButtonGroupElement,
  parseExternalCardElement,
  parseInlineButtonElement,
} from './render'

export const AdmonitionExtension = Node.create({
  name: ADMONITION_NODE,
  group: 'block',
  atom: true,
  draggable: true,

  addAttributes() {
    const defaults = createDefaultAdmonitionAttrs()
    return Object.fromEntries(
      Object.entries(defaults).map(([name, value]) => [name, { default: value }]),
    )
  },

  parseHTML() {
    return [
      {
        tag: 'aside[data-halo-admonition]',
        getAttrs: (element: HTMLElement) => parseAdmonitionElement(element),
      },
    ]
  },

  renderHTML({ node }) {
    return createAdmonitionElement(node.attrs as ReturnType<typeof createDefaultAdmonitionAttrs>) as unknown as [
      string,
      Record<string, unknown>,
    ]
  },

  addNodeView() {
    return VueNodeViewRenderer(AdmonitionNodeView)
  },
})

export const ButtonGroupExtension = Node.create({
  name: BUTTON_GROUP_NODE,
  group: 'block',
  atom: true,
  draggable: true,

  addAttributes() {
    return {
      buttons: {
        default: createDefaultButtonGroupAttrs().buttons,
      },
    }
  },

  parseHTML() {
    return [
      {
        tag: 'div[data-halo-button-group]',
        getAttrs: (element: HTMLElement) => parseButtonGroupElement(element),
      },
    ]
  },

  renderHTML({ node }) {
    return createButtonGroupElement({ buttons: node.attrs.buttons }) as unknown as [
      string,
      Record<string, unknown>,
    ]
  },

  addNodeView() {
    return VueNodeViewRenderer(ButtonGroupNodeView)
  },
})

export const InlineButtonExtension = Node.create({
  name: INLINE_BUTTON_NODE,
  priority: 1000,
  group: 'inline',
  inline: true,
  atom: true,
  selectable: true,

  addAttributes() {
    const defaults = createDefaultInlineButtonAttrs()
    return Object.fromEntries(
      Object.entries(defaults).map(([name, value]) => [name, { default: value }]),
    )
  },

  parseHTML() {
    return [
      {
        tag: 'span[data-halo-inline-button]',
        getAttrs: (element: HTMLElement) => parseInlineButtonElement(element),
      },
    ]
  },

  renderHTML({ node }) {
    return createInlineButtonElement(
      node.attrs as ReturnType<typeof createDefaultInlineButtonAttrs>,
    ) as unknown as [string, Record<string, unknown>]
  },

  addNodeView() {
    return VueNodeViewRenderer(InlineButtonNodeView)
  },
})

export const ExternalCardExtension = Node.create({
  name: EXTERNAL_CARD_NODE,
  priority: 1000,
  group: 'block',
  atom: true,
  draggable: true,

  addAttributes() {
    const defaults = createDefaultExternalCardAttrs()
    return Object.fromEntries(
      Object.entries(defaults).map(([name, value]) => [name, { default: value }]),
    )
  },

  parseHTML() {
    return [
      {
        tag: 'p',
        priority: 1000,
        getAttrs: (element: HTMLElement) => {
          const legacyCard = element.querySelector<HTMLElement>(':scope > a.halo-external-card')
          return legacyCard ? parseExternalCardElement(legacyCard) : false
        },
      },
      {
        tag: 'div[data-halo-external-card]',
        getAttrs: (element: HTMLElement) => parseExternalCardElement(element),
      },
      {
        tag: 'a[data-halo-external-card]',
        getAttrs: (element: HTMLElement) => parseExternalCardElement(element),
      },
      {
        tag: 'a.halo-external-card',
        getAttrs: (element: HTMLElement) => parseExternalCardElement(element),
      },
    ]
  },

  renderHTML({ node }) {
    return createExternalCardElement(
      node.attrs as ReturnType<typeof createDefaultExternalCardAttrs>,
    ) as unknown as [string, Record<string, unknown>]
  },

  addNodeView() {
    return VueNodeViewRenderer(ExternalCardNodeView)
  },
})

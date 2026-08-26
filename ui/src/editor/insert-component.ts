/*
 * SPDX-FileCopyrightText: 2026 Handsome and plugin-content-widgets contributors
 * SPDX-FileCopyrightText: 2026 jeron-lgy
 * SPDX-License-Identifier: GPL-3.0-only
 *
 * Adapted from https://github.com/acanyo/plugin-content-widgets.
 */
import type { Editor, Range } from '@halo-dev/richtext-editor'
import {
  createDefaultAdmonitionAttrs,
  createDefaultExternalCardAttrs,
  createDefaultInlineButtonAttrs,
} from './catalog'
import { ADMONITION_NODE, EXTERNAL_CARD_NODE, INLINE_BUTTON_NODE } from './node-names'
import type { ComponentKind } from './types'

export function insertComponent(editor: Editor, kind: ComponentKind, range?: Range) {
  const content =
    kind === 'admonition'
      ? { type: ADMONITION_NODE, attrs: createDefaultAdmonitionAttrs() }
      : kind === 'inlineButton'
        ? { type: INLINE_BUTTON_NODE, attrs: createDefaultInlineButtonAttrs() }
        : { type: EXTERNAL_CARD_NODE, attrs: createDefaultExternalCardAttrs() }

  const chain = editor.chain().focus()
  if (range) {
    chain.deleteRange(range).insertContent(content).run()
    return
  }

  const selection = editor.state.selection as typeof editor.state.selection & {
    node?: { isBlock?: boolean }
  }

  if (kind === 'inlineButton') {
    chain.insertContent(content).run()
    return
  }

  // Clicking the toolbar while an atom node is selected must append a component,
  // not silently replace the selected component.
  if (selection.node?.isBlock) {
    chain.insertContentAt(selection.to, content).run()
    return
  }

  chain.insertContent(content).run()
}

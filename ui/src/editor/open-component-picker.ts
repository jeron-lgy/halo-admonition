/*
 * SPDX-FileCopyrightText: 2026 Handsome and plugin-content-widgets contributors
 * SPDX-FileCopyrightText: 2026 jeron-lgy
 * SPDX-License-Identifier: GPL-3.0-only
 *
 * Adapted from https://github.com/acanyo/plugin-content-widgets.
 */
import ComponentPicker from '@/components/ComponentPicker.vue'
import type { Editor, Range } from '@halo-dev/richtext-editor'
import { createApp } from 'vue'
import { insertComponent } from './insert-component'
import type { ComponentKind } from './types'

let activeApp: ReturnType<typeof createApp> | undefined
let activeContainer: HTMLDivElement | undefined

export function openComponentPicker(editor: Editor, range?: Range) {
  activeApp?.unmount()
  activeContainer?.remove()

  const container = document.createElement('div')
  container.dataset.haloAdmonitionPicker = 'true'
  document.body.append(container)

  const close = () => {
    app.unmount()
    container.remove()
    if (activeApp === app) {
      activeApp = undefined
      activeContainer = undefined
    }
  }

  const select = (kind: ComponentKind) => {
    insertComponent(editor, kind, range)
    close()
  }

  const app = createApp(ComponentPicker, {
    onClose: close,
    onSelect: select,
  })
  activeApp = app
  activeContainer = container
  app.mount(container)
}

/*
 * SPDX-FileCopyrightText: 2026 Handsome and plugin-content-widgets contributors
 * SPDX-FileCopyrightText: 2026 jeron-lgy
 * SPDX-License-Identifier: GPL-3.0-only
 *
 * Adapted from https://github.com/acanyo/plugin-content-widgets.
 */
import { definePlugin } from '@halo-dev/ui-shared'
import './styles/content.css'
import './styles/editor.css'

export default definePlugin({
  components: {},
  routes: [],
  extensionPoints: {
    'default:editor:extension:create': async () => {
      const { AdmonitionExtension, ButtonGroupExtension, ExternalCardExtension, InlineButtonExtension } = await import('./editor/nodes')
      const { ComponentMenuExtension } = await import('./editor/menu-extension')
      return [AdmonitionExtension, InlineButtonExtension, ButtonGroupExtension, ExternalCardExtension, ComponentMenuExtension]
    },
  },
})

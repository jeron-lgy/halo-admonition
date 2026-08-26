/*
 * SPDX-FileCopyrightText: 2026 Handsome and plugin-content-widgets contributors
 * SPDX-FileCopyrightText: 2026 jeron-lgy
 * SPDX-License-Identifier: GPL-3.0-only
 *
 * Adapted from https://github.com/acanyo/plugin-content-widgets.
 */
import { IconMagic, IconPlug } from '@halo-dev/components'
import {
  Extension,
  ToolboxItem,
  type CommandMenuItemType,
  type ExtensionOptions,
  type ToolboxItemType,
} from '@halo-dev/richtext-editor'
import { markRaw } from 'vue'
import { openComponentPicker } from './open-component-picker'

export const ComponentMenuExtension = Extension.create<ExtensionOptions>({
  name: 'haloAdmonitionComponentMenu',

  addOptions() {
    return {
      ...this.parent?.(),
      getCommandMenuItems(): CommandMenuItemType {
        return {
          priority: 78,
          icon: markRaw(IconMagic),
          title: '提示框、按钮与外链卡片',
          keywords: ['提示框', '按钮', '外链卡片', 'GitHub', 'admonition', 'button', 'link', '组件'],
          command: ({ editor, range }) => openComponentPicker(editor, range),
        }
      },
      getToolboxItems({ editor }): ToolboxItemType {
        return {
          priority: 78,
          component: markRaw(ToolboxItem),
          props: {
            editor,
            icon: markRaw(IconPlug),
            title: '提示框、按钮与外链卡片',
            description: '插入可视化提示框、按钮组和常用外链卡片',
            action: () => openComponentPicker(editor),
          },
        }
      },
    }
  },
})

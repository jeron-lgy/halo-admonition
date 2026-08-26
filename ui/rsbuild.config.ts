/*
 * SPDX-FileCopyrightText: 2026 Handsome and plugin-content-widgets contributors
 * SPDX-FileCopyrightText: 2026 jeron-lgy
 * SPDX-License-Identifier: GPL-3.0-only
 *
 * Adapted from https://github.com/acanyo/plugin-content-widgets.
 */
import type { RsbuildConfig } from '@rsbuild/core'
import { pluginSass } from '@rsbuild/plugin-sass'
import { rsbuildConfig } from '@halo-dev/ui-plugin-bundler-kit'
import Icons from 'unplugin-icons/rspack'

export default rsbuildConfig({
  rsbuild: {
    resolve: {
      alias: {
        '@': './src',
      },
    },
    plugins: [pluginSass()],
    tools: {
      rspack: {
        plugins: [Icons({ compiler: 'vue3' })],
      },
    },
  },
}) as RsbuildConfig

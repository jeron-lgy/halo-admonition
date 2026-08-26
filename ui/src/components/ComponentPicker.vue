<script setup lang="ts">
/*
 * SPDX-FileCopyrightText: 2026 Handsome and plugin-content-widgets contributors
 * SPDX-FileCopyrightText: 2026 jeron-lgy
 * SPDX-License-Identifier: GPL-3.0-only
 *
 * Adapted from https://github.com/acanyo/plugin-content-widgets.
 */
import { COMPONENTS } from '@/editor/catalog'
import type { ComponentKind } from '@/editor/types'
import { computed, ref } from 'vue'
import IconClose from '~icons/ri/close-line'
import IconSearch from '~icons/ri/search-line'

const emit = defineEmits<{
  close: []
  select: [kind: ComponentKind]
}>()

const keyword = ref('')
const filteredComponents = computed(() => {
  const value = keyword.value.trim().toLowerCase()
  if (!value) return COMPONENTS
  return COMPONENTS.filter((component) =>
    [component.title, component.description, ...component.keywords]
      .join(' ')
      .toLowerCase()
      .includes(value),
  )
})
</script>

<template>
  <div class="halo-component-picker-overlay" @click.self="emit('close')">
    <section
      class="halo-component-picker"
      role="dialog"
      aria-modal="true"
      aria-label="内容组件"
    >
      <header>
        <div>
          <h2>内容组件</h2>
          <p>选择后插入到当前光标位置，点击组件即可可视化编辑。</p>
        </div>
        <button type="button" class="halo-picker-close" aria-label="关闭" @click="emit('close')">
          <IconClose />
        </button>
      </header>

      <label class="halo-picker-search">
        <IconSearch />
        <input v-model="keyword" type="search" placeholder="搜索组件" autofocus />
      </label>

      <div class="halo-component-grid">
        <button
          v-for="component in filteredComponents"
          :key="component.id"
          type="button"
          class="halo-component-card"
          @click="emit('select', component.id)"
        >
          <span class="halo-component-card-icon" aria-hidden="true">
            {{ component.id === 'admonition' ? 'ℹ️' : component.id === 'inlineButton' ? 'CTA' : 'GH' }}
          </span>
          <span>
            <strong>{{ component.title }}</strong>
            <small>{{ component.description }}</small>
          </span>
        </button>
      </div>

      <p v-if="!filteredComponents.length" class="halo-picker-empty">没有找到匹配的组件。</p>
    </section>
  </div>
</template>

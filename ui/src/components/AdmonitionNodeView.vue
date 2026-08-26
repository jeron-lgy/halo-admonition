<script setup lang="ts">
import { NodeViewWrapper, nodeViewProps } from '@halo-dev/richtext-editor'
import { computed } from 'vue'
import IconDelete from '~icons/ri/delete-bin-2-line'
import { ADMONITION_TYPES, ADMONITION_TYPE_MAP } from '@/editor/catalog'
import { createAdmonitionElement } from '@/editor/render'
import type { AdmonitionAttrs, AdmonitionType } from '@/editor/types'
import IconPicker from './IconPicker.vue'

const props = defineProps(nodeViewProps)
const attrs = computed(() => props.node.attrs as AdmonitionAttrs)
const previewHtml = computed(() => createAdmonitionElement(attrs.value).outerHTML)

function update(patch: Partial<AdmonitionAttrs>) {
  props.updateAttributes({ ...attrs.value, ...patch })
}

function updateText(name: 'title' | 'content' | 'customIcon', event: Event) {
  update({ [name]: (event.target as HTMLInputElement | HTMLTextAreaElement).value })
}

function updateType(event: Event) {
  const type = (event.target as HTMLSelectElement).value as AdmonitionType
  const definition = ADMONITION_TYPE_MAP.get(type)
  update({
    type,
    title: definition?.defaultTitle ?? attrs.value.title,
    icon: definition?.icon ?? attrs.value.icon,
    accentColor: definition?.accentColor ?? attrs.value.accentColor,
    backgroundColor: definition?.backgroundColor ?? attrs.value.backgroundColor,
    textColor: definition?.textColor ?? attrs.value.textColor,
  })
}

function updateColor(name: 'accentColor' | 'backgroundColor' | 'textColor', event: Event) {
  update({ [name]: (event.target as HTMLInputElement).value })
}

function updateBoolean(name: 'showTitle' | 'collapsible' | 'open', event: Event) {
  update({ [name]: (event.target as HTMLInputElement).checked })
}

function removeNode() {
  const position = props.getPos()
  if (typeof position !== 'number') return
  props.editor.commands.command(({ tr }) => {
    tr.delete(position, position + props.node.nodeSize)
    return true
  })
}
</script>

<template>
  <NodeViewWrapper
    as="div"
    class="halo-editor-node"
    :class="{ 'is-selected': props.selected }"
  >
    <div class="halo-editor-node-preview" v-html="previewHtml" />

    <section
      v-if="props.selected"
      class="halo-editor-panel"
      contenteditable="false"
      @mousedown.stop
      @click.stop
      @keydown.stop
    >
      <header class="halo-editor-panel-head">
        <div>
          <strong>提示框</strong>
          <span>块级组件</span>
        </div>
        <button type="button" class="halo-delete-button" aria-label="删除提示框" @click="removeNode">
          <IconDelete />
        </button>
      </header>

      <div class="halo-form-grid">
        <label class="halo-field">
          <span class="halo-field-label">类型</span>
          <select :value="attrs.type" @change="updateType">
            <option v-for="item in ADMONITION_TYPES" :key="item.value" :value="item.value">
              {{ item.label }}
            </option>
          </select>
        </label>

        <label class="halo-field">
          <span class="halo-field-label">标题</span>
          <input type="text" :value="attrs.title" @input="updateText('title', $event)" />
        </label>
      </div>

      <div class="halo-toggle-row">
        <label><input type="checkbox" :checked="attrs.showTitle" @change="updateBoolean('showTitle', $event)" /> 显示标题</label>
        <label><input type="checkbox" :checked="attrs.collapsible" @change="updateBoolean('collapsible', $event)" /> 允许折叠</label>
        <label v-if="attrs.collapsible"><input type="checkbox" :checked="attrs.open" @change="updateBoolean('open', $event)" /> 默认展开</label>
      </div>

      <div class="halo-color-grid" aria-label="提示框颜色">
        <label class="halo-color-field">
          <span>强调色</span>
          <span class="halo-color-control">
            <input type="color" :value="attrs.accentColor" aria-label="强调色" @input="updateColor('accentColor', $event)" />
            <code>{{ attrs.accentColor }}</code>
          </span>
        </label>
        <label class="halo-color-field">
          <span>背景色</span>
          <span class="halo-color-control">
            <input type="color" :value="attrs.backgroundColor" aria-label="背景色" @input="updateColor('backgroundColor', $event)" />
            <code>{{ attrs.backgroundColor }}</code>
          </span>
        </label>
        <label class="halo-color-field">
          <span>文字色</span>
          <span class="halo-color-control">
            <input type="color" :value="attrs.textColor" aria-label="文字色" @input="updateColor('textColor', $event)" />
            <code>{{ attrs.textColor }}</code>
          </span>
        </label>
      </div>

      <IconPicker
        :model-value="attrs.icon"
        :custom-icon="attrs.customIcon"
        @update:model-value="update({ icon: $event })"
        @update:custom-icon="update({ customIcon: $event })"
      />

      <label class="halo-field">
        <span class="halo-field-label">正文</span>
        <textarea
          rows="5"
          :value="attrs.content"
          placeholder="这里写提示内容。"
          @input="updateText('content', $event)"
        />
      </label>
    </section>
  </NodeViewWrapper>
</template>

<script setup lang="ts">
import { NodeViewWrapper, nodeViewProps } from '@halo-dev/richtext-editor'
import { computed } from 'vue'
import IconDelete from '~icons/ri/delete-bin-2-line'
import { createInlineButtonElement } from '@/editor/render'
import type { InlineButtonAttrs } from '@/editor/types'
import IconPicker from './IconPicker.vue'

const props = defineProps(nodeViewProps)
const attrs = computed(() => props.node.attrs as InlineButtonAttrs)
const previewHtml = computed(() => createInlineButtonElement(attrs.value).outerHTML)

function update(patch: Partial<InlineButtonAttrs>) {
  props.updateAttributes({ ...attrs.value, ...patch })
}

function updateText(name: 'text' | 'href' | 'customIcon', event: Event) {
  update({ [name]: (event.target as HTMLInputElement).value })
}

function updateColor(name: 'backgroundColor' | 'backgroundEndColor' | 'textColor', event: Event) {
  update({ [name]: (event.target as HTMLInputElement).value })
}

function openEditor() {
  const position = props.getPos()
  if (typeof position === 'number') props.editor.commands.setNodeSelection(position)
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
    as="span"
    class="halo-inline-button-node"
    :class="{ 'is-selected': props.selected }"
    contenteditable="false"
    @mousedown.prevent.stop="openEditor"
    @click.prevent.stop="openEditor"
  >
    <span class="halo-inline-button-preview" v-html="previewHtml" />

    <span
      v-if="props.selected"
      class="halo-inline-button-panel-host"
      contenteditable="false"
      @mousedown.stop
      @click.stop
      @keydown.stop
    >
      <section class="halo-editor-panel halo-inline-editor-panel">
        <header class="halo-editor-panel-head">
          <div>
            <strong>按钮</strong>
            <span>行内组件</span>
          </div>
          <button type="button" class="halo-delete-button" aria-label="删除按钮" @click="removeNode">
            <IconDelete />
          </button>
        </header>

        <div class="halo-form-grid halo-form-grid-three">
          <label class="halo-field">
            <span class="halo-field-label">按钮文字</span>
            <input type="text" :value="attrs.text" @input="updateText('text', $event)" />
          </label>
          <label class="halo-field">
            <span class="halo-field-label">图标位置</span>
            <select :value="attrs.iconPosition" @change="update({ iconPosition: ($event.target as HTMLSelectElement).value as InlineButtonAttrs['iconPosition'] })">
              <option value="none">不显示</option>
              <option value="before">文字前</option>
              <option value="after">文字后</option>
            </select>
          </label>
          <label class="halo-field">
            <span class="halo-field-label">圆角</span>
            <select :value="attrs.shape" @change="update({ shape: ($event.target as HTMLSelectElement).value as InlineButtonAttrs['shape'] })">
              <option value="square">小圆角</option>
              <option value="rounded">圆角</option>
              <option value="pill">胶囊</option>
            </select>
          </label>
        </div>

        <label class="halo-field">
          <span class="halo-field-label">链接</span>
          <input type="text" :value="attrs.href" placeholder="https:// 或 /站内路径" @input="updateText('href', $event)" />
        </label>

        <div class="halo-color-grid" aria-label="按钮颜色">
          <label class="halo-color-field">
            <span>渐变起始色</span>
            <span class="halo-color-control">
              <input type="color" :value="attrs.backgroundColor" aria-label="按钮渐变起始色" @input="updateColor('backgroundColor', $event)" />
              <code>{{ attrs.backgroundColor }}</code>
            </span>
          </label>
          <label class="halo-color-field">
            <span>渐变结束色</span>
            <span class="halo-color-control">
              <input type="color" :value="attrs.backgroundEndColor" aria-label="按钮渐变结束色" @input="updateColor('backgroundEndColor', $event)" />
              <code>{{ attrs.backgroundEndColor }}</code>
            </span>
          </label>
          <label class="halo-color-field">
            <span>文字与图标色</span>
            <span class="halo-color-control">
              <input type="color" :value="attrs.textColor" aria-label="按钮文字色" @input="updateColor('textColor', $event)" />
              <code>{{ attrs.textColor }}</code>
            </span>
          </label>
        </div>

        <label class="halo-checkbox-field">
          <input type="checkbox" :checked="attrs.newWindow" @change="update({ newWindow: ($event.target as HTMLInputElement).checked })" />
          新窗口打开
        </label>

        <IconPicker
          :model-value="attrs.icon"
          :custom-icon="attrs.customIcon"
          @update:model-value="update({ icon: $event })"
          @update:custom-icon="update({ customIcon: $event })"
        />
      </section>
    </span>
  </NodeViewWrapper>
</template>

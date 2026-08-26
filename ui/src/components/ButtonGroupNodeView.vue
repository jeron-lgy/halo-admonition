<script setup lang="ts">
import { NodeViewWrapper, nodeViewProps } from '@halo-dev/richtext-editor'
import { computed } from 'vue'
import IconAdd from '~icons/ri/add-line'
import IconDelete from '~icons/ri/delete-bin-2-line'
import IconFileCopy from '~icons/ri/file-copy-line'
import IconArrowUp from '~icons/ri/arrow-up-line'
import IconArrowDown from '~icons/ri/arrow-down-line'
import { BUTTON_PRESETS, BUTTON_PRESET_MAP, createButton } from '@/editor/catalog'
import { createButtonGroupElement } from '@/editor/render'
import type { ButtonConfig, ButtonGroupAttrs } from '@/editor/types'
import IconPicker from './IconPicker.vue'

const props = defineProps(nodeViewProps)
const attrs = computed(() => props.node.attrs as ButtonGroupAttrs)
const previewHtml = computed(() => createButtonGroupElement(attrs.value).outerHTML)

function updateButtons(buttons: ButtonConfig[]) {
  props.updateAttributes({ buttons })
}

function updateButton(index: number, patch: Partial<ButtonConfig>) {
  const buttons = attrs.value.buttons.map((button, buttonIndex) =>
    buttonIndex === index ? { ...button, ...patch } : { ...button },
  )
  updateButtons(buttons)
}

function updateText(index: number, name: 'text' | 'href' | 'customIcon', event: Event) {
  updateButton(index, { [name]: (event.target as HTMLInputElement).value })
}

function updateSelect(
  index: number,
  name: 'iconPosition' | 'shape' | 'variant',
  event: Event,
) {
  updateButton(index, { [name]: (event.target as HTMLSelectElement).value })
}

function updateColor(index: number, name: 'backgroundColor' | 'backgroundEndColor' | 'textColor', event: Event) {
  updateButton(index, { [name]: (event.target as HTMLInputElement).value })
}

function applyPreset(index: number, event: Event) {
  const presetName = (event.target as HTMLSelectElement).value
  const preset = BUTTON_PRESET_MAP.get(presetName)
  if (!preset) {
    updateButton(index, { preset: '' })
    return
  }
  updateButton(index, { preset: presetName, text: preset.text, icon: preset.icon, customIcon: '' })
}

function addButton() {
  updateButtons([...attrs.value.buttons.map((button) => ({ ...button })), createButton()])
}

function duplicateButton(index: number) {
  const buttons = attrs.value.buttons.map((button) => ({ ...button }))
  const source = buttons[index]
  if (!source) return
  buttons.splice(index + 1, 0, { ...source, id: crypto.randomUUID() })
  updateButtons(buttons)
}

function removeButton(index: number) {
  if (attrs.value.buttons.length === 1) return
  updateButtons(attrs.value.buttons.filter((_, buttonIndex) => buttonIndex !== index))
}

function moveButton(index: number, offset: number) {
  const nextIndex = index + offset
  if (nextIndex < 0 || nextIndex >= attrs.value.buttons.length) return
  const buttons = attrs.value.buttons.map((button) => ({ ...button }))
  const [button] = buttons.splice(index, 1)
  if (!button) return
  buttons.splice(nextIndex, 0, button)
  updateButtons(buttons)
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
    <div class="halo-editor-node-preview" @click.prevent v-html="previewHtml" />

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
          <strong>按钮组</strong>
          <span>{{ attrs.buttons.length }} 个按钮</span>
        </div>
        <button type="button" class="halo-delete-button" aria-label="删除按钮组" @click="removeNode">
          <IconDelete />
        </button>
      </header>

      <article v-for="(button, index) in attrs.buttons" :key="button.id" class="halo-button-editor-card">
        <header>
          <strong>按钮 {{ index + 1 }}</strong>
          <div class="halo-card-actions">
            <button type="button" title="上移" :disabled="index === 0" @click="moveButton(index, -1)"><IconArrowUp /></button>
            <button type="button" title="下移" :disabled="index === attrs.buttons.length - 1" @click="moveButton(index, 1)"><IconArrowDown /></button>
            <button type="button" title="复制" @click="duplicateButton(index)"><IconFileCopy /></button>
            <button type="button" title="删除" :disabled="attrs.buttons.length === 1" @click="removeButton(index)"><IconDelete /></button>
          </div>
        </header>

        <div class="halo-form-grid">
          <label class="halo-field">
            <span class="halo-field-label">常用预设</span>
            <select :value="button.preset" @change="applyPreset(index, $event)">
              <option value="">自定义</option>
              <option v-for="preset in BUTTON_PRESETS" :key="preset.value" :value="preset.value">
                {{ preset.label }}
              </option>
            </select>
          </label>
          <label class="halo-field">
            <span class="halo-field-label">按钮文字</span>
            <input type="text" :value="button.text" @input="updateText(index, 'text', $event)" />
          </label>
        </div>

        <label class="halo-field">
          <span class="halo-field-label">链接</span>
          <input type="text" :value="button.href" placeholder="https:// 或 /站内路径" @input="updateText(index, 'href', $event)" />
        </label>

        <div class="halo-form-grid halo-form-grid-three">
          <label class="halo-field">
            <span class="halo-field-label">图标位置</span>
            <select :value="button.iconPosition" @change="updateSelect(index, 'iconPosition', $event)">
              <option value="before">文字前</option>
              <option value="after">文字后</option>
            </select>
          </label>
          <label class="halo-field">
            <span class="halo-field-label">圆角</span>
            <select :value="button.shape" @change="updateSelect(index, 'shape', $event)">
              <option value="square">小圆角</option>
              <option value="rounded">圆角</option>
              <option value="pill">胶囊</option>
            </select>
          </label>
          <label class="halo-field">
            <span class="halo-field-label">样式</span>
            <select :value="button.variant" @change="updateSelect(index, 'variant', $event)">
              <option value="default">默认</option>
              <option value="primary">主色</option>
              <option value="outline">描边</option>
              <option value="ghost">透明</option>
            </select>
          </label>
        </div>

        <div class="halo-color-grid" :aria-label="`按钮 ${index + 1} 颜色`">
          <label class="halo-color-field">
            <span>渐变起始色</span>
            <span class="halo-color-control">
              <input type="color" :value="button.backgroundColor" aria-label="按钮渐变起始色" @input="updateColor(index, 'backgroundColor', $event)" />
              <code>{{ button.backgroundColor }}</code>
            </span>
          </label>
          <label class="halo-color-field">
            <span>渐变结束色</span>
            <span class="halo-color-control">
              <input type="color" :value="button.backgroundEndColor || '#1d3fd8'" aria-label="按钮渐变结束色" @input="updateColor(index, 'backgroundEndColor', $event)" />
              <code>{{ button.backgroundEndColor || '#1d3fd8' }}</code>
            </span>
          </label>
          <label class="halo-color-field">
            <span>文字与图标色</span>
            <span class="halo-color-control">
              <input type="color" :value="button.textColor" aria-label="按钮文字与图标色" @input="updateColor(index, 'textColor', $event)" />
              <code>{{ button.textColor }}</code>
            </span>
          </label>
        </div>

        <label class="halo-checkbox-field">
          <input type="checkbox" :checked="button.newWindow" @change="updateButton(index, { newWindow: ($event.target as HTMLInputElement).checked })" />
          新窗口打开
        </label>

        <IconPicker
          :model-value="button.icon"
          :custom-icon="button.customIcon"
          @update:model-value="updateButton(index, { icon: $event })"
          @update:custom-icon="updateButton(index, { customIcon: $event })"
        />
      </article>

      <button type="button" class="halo-add-button" @click="addButton">
        <IconAdd /> 添加按钮
      </button>
    </section>
  </NodeViewWrapper>
</template>

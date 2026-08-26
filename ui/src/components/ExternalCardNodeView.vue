<script setup lang="ts">
import { NodeViewWrapper, nodeViewProps } from '@halo-dev/richtext-editor'
import { computed, ref } from 'vue'
import IconDelete from '~icons/ri/delete-bin-2-line'
import IconRefresh from '~icons/ri/refresh-line'
import { EXTERNAL_CARD_PRESETS, EXTERNAL_CARD_PRESET_MAP } from '@/editor/catalog'
import { readLinkMetadata } from '@/editor/link-metadata'
import { createExternalCardElement } from '@/editor/render'
import type { ExternalCardAttrs } from '@/editor/types'
import IconPicker from './IconPicker.vue'

const props = defineProps(nodeViewProps)
const attrs = computed(() => props.node.attrs as ExternalCardAttrs)
const previewHtml = computed(() => createExternalCardElement(attrs.value).outerHTML)
const metadataLoading = ref(false)
const metadataMessage = ref('')

function update(patch: Partial<ExternalCardAttrs>) {
  props.updateAttributes({ ...attrs.value, ...patch })
}

function selectNode() {
  const position = props.getPos()
  if (typeof position !== 'number') return
  props.editor.commands.setNodeSelection(position)
}

function updateText(
  name: 'eyebrow' | 'title' | 'description' | 'href' | 'customIcon' | 'imageUrl',
  event: Event,
) {
  update({
    [name]: (event.target as HTMLInputElement | HTMLTextAreaElement).value,
    ...(name === 'href' ? {} : { autoMetadata: false }),
  })
}

function updateColor(name: 'accentColor' | 'backgroundColor' | 'textColor', event: Event) {
  update({ [name]: (event.target as HTMLInputElement).value })
}

function applyPreset(event: Event) {
  const presetName = (event.target as HTMLSelectElement).value
  const preset = EXTERNAL_CARD_PRESET_MAP.get(presetName)
  if (!preset) {
    update({ preset: '' })
    return
  }
  update({
    preset: preset.value,
    eyebrow: preset.eyebrow,
    title: preset.title,
    description: preset.description,
    href: preset.href,
    icon: preset.icon,
    customIcon: '',
    accentColor: preset.accentColor,
    backgroundColor: preset.backgroundColor,
    textColor: preset.textColor,
    platform: preset.value,
    imageUrl: '',
    autoMetadata: false,
  })
}

async function fetchMetadata(force = false) {
  const href = attrs.value.href.trim()
  if (!href || href === '#' || (!force && !attrs.value.autoMetadata)) return
  metadataLoading.value = true
  metadataMessage.value = '正在读取网页信息…'
  try {
    const metadata = await readLinkMetadata(href)
    const preset = EXTERNAL_CARD_PRESET_MAP.get(metadata.platform)
      ?? EXTERNAL_CARD_PRESET_MAP.get('website')!
    update({
      preset: preset.value,
      platform: metadata.platform || preset.value,
      eyebrow: metadata.siteName || preset.eyebrow,
      title: metadata.title || preset.title,
      description: metadata.description || preset.description,
      href: metadata.url || href,
      icon: preset.icon,
      customIcon: metadata.iconUrl,
      imageUrl: metadata.imageUrl,
      showImage: Boolean(metadata.imageUrl),
      accentColor: preset.accentColor,
      backgroundColor: preset.backgroundColor,
      textColor: preset.textColor,
      autoMetadata: true,
    })
    metadataMessage.value = metadata.source === 'fallback'
      ? '目标网站限制了自动读取，已识别平台并填入默认信息；你仍可手工修改。'
      : metadata.imageUrl
        ? '已读取真实标题、说明、图标和预览图。'
        : '已读取真实标题、说明和网站图标。'
  } catch (error) {
    metadataMessage.value = error instanceof Error ? error.message : '无法读取该网站信息。'
  } finally {
    metadataLoading.value = false
  }
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
    <div
      class="halo-editor-node-preview"
      @mousedown.prevent.stop="selectNode"
      @click.prevent.stop="selectNode"
      v-html="previewHtml"
    />

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
          <strong>外链卡片</strong>
          <span>单卡片组件</span>
        </div>
        <button type="button" class="halo-delete-button" aria-label="删除外链卡片" @click="removeNode">
          <IconDelete />
        </button>
      </header>

      <div class="halo-form-grid">
        <label class="halo-field">
          <span class="halo-field-label">常用预设</span>
          <select :value="attrs.preset" @change="applyPreset">
            <option value="">自定义</option>
            <option v-for="preset in EXTERNAL_CARD_PRESETS" :key="preset.value" :value="preset.value">
              {{ preset.label }}
            </option>
          </select>
        </label>
        <label class="halo-field">
          <span class="halo-field-label">顶部标签</span>
          <input type="text" :value="attrs.eyebrow" placeholder="例如 GITHUB" @input="updateText('eyebrow', $event)" />
        </label>
      </div>

      <label class="halo-field">
        <span class="halo-field-label">标题</span>
        <input type="text" :value="attrs.title" @input="updateText('title', $event)" />
      </label>

      <label class="halo-field">
        <span class="halo-field-label">说明</span>
        <textarea rows="3" :value="attrs.description" @input="updateText('description', $event)" />
      </label>

      <label class="halo-field">
        <span class="halo-field-label">链接</span>
        <span class="halo-metadata-url-row">
          <input type="text" :value="attrs.href" placeholder="https:// 或 /站内路径" @input="updateText('href', $event)" @blur="fetchMetadata()" />
          <button type="button" :disabled="metadataLoading" @click="fetchMetadata(true)">
            <IconRefresh /> {{ metadataLoading ? '读取中' : '读取网站信息' }}
          </button>
        </span>
      </label>

      <label class="halo-checkbox-field">
        <input type="checkbox" :checked="attrs.autoMetadata" @change="update({ autoMetadata: ($event.target as HTMLInputElement).checked })" />
        链接变化后自动读取标题、说明、图标与预览图
      </label>
      <p v-if="metadataMessage" class="halo-metadata-message">{{ metadataMessage }}</p>

      <div class="halo-color-grid" aria-label="外链卡片颜色">
        <label class="halo-color-field">
          <span>强调色</span>
          <span class="halo-color-control">
            <input type="color" :value="attrs.accentColor" aria-label="卡片强调色" @input="updateColor('accentColor', $event)" />
            <code>{{ attrs.accentColor }}</code>
          </span>
        </label>
        <label class="halo-color-field">
          <span>背景色</span>
          <span class="halo-color-control">
            <input type="color" :value="attrs.backgroundColor" aria-label="卡片背景色" @input="updateColor('backgroundColor', $event)" />
            <code>{{ attrs.backgroundColor }}</code>
          </span>
        </label>
        <label class="halo-color-field">
          <span>文字色</span>
          <span class="halo-color-control">
            <input type="color" :value="attrs.textColor" aria-label="卡片文字色" @input="updateColor('textColor', $event)" />
            <code>{{ attrs.textColor }}</code>
          </span>
        </label>
      </div>

      <label class="halo-checkbox-field">
        <input type="checkbox" :checked="attrs.newWindow" @change="update({ newWindow: ($event.target as HTMLInputElement).checked })" />
        新窗口打开
      </label>

      <div class="halo-form-grid">
        <label class="halo-field">
          <span class="halo-field-label">右侧预览图地址</span>
          <input type="text" :value="attrs.imageUrl" placeholder="自动读取页面封面，也可以手工填写图片 URL" @input="updateText('imageUrl', $event)" />
          <small class="halo-field-help">用于卡片右侧封面，不是点击跳转地址。</small>
        </label>
        <label class="halo-checkbox-field halo-preview-toggle">
          <input type="checkbox" :checked="attrs.showImage" @change="update({ showImage: ($event.target as HTMLInputElement).checked })" />
          显示右侧预览图
        </label>
      </div>

      <IconPicker
        :model-value="attrs.icon"
        :custom-icon="attrs.customIcon"
        @update:model-value="update({ icon: $event, autoMetadata: false })"
        @update:custom-icon="update({ customIcon: $event, autoMetadata: false })"
      />
    </section>
  </NodeViewWrapper>
</template>

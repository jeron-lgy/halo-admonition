<script setup lang="ts">
import { ICONS } from '@/editor/catalog'

const props = defineProps<{
  modelValue: string
  customIcon: string
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
  'update:customIcon': [value: string]
}>()

function selectIcon(name: string) {
  emit('update:modelValue', name)
  emit('update:customIcon', '')
}

function updateCustom(event: Event) {
  emit('update:customIcon', (event.target as HTMLInputElement).value)
}
</script>

<template>
  <div class="halo-field halo-icon-picker">
    <span class="halo-field-label">图标</span>
    <div class="halo-icon-grid" role="listbox" aria-label="选择内置图标">
      <button
        v-for="icon in ICONS"
        :key="icon.name"
        type="button"
        class="halo-icon-option"
        :class="{ 'is-active': !props.customIcon && props.modelValue === icon.name }"
        :title="icon.label"
        :aria-label="icon.label"
        :aria-selected="!props.customIcon && props.modelValue === icon.name"
        @click="selectIcon(icon.name)"
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="1.8"
          stroke-linecap="round"
          stroke-linejoin="round"
          aria-hidden="true"
          v-html="icon.svg"
        />
      </button>
    </div>
    <label class="halo-field halo-custom-icon-field">
      <span class="halo-field-label">自定义图标</span>
      <input
        type="text"
        :value="props.customIcon"
        placeholder="输入 Emoji 或图片 URL，例如 🚀"
        @input="updateCustom"
      />
    </label>
  </div>
</template>

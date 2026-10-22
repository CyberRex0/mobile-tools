<script setup lang="ts">
import type { RadioTechnology } from '@/types'

const model = defineModel<RadioTechnology>({ required: true })
</script>

<template>
  <div role="tablist" class="tabs tabs-box bg-base-200 p-1" aria-label="無線方式">
    <button role="tab" class="tab flex-1" :class="{ 'tab-active': model === 'lte' }" :aria-selected="model === 'lte'" @click="model = 'lte'">
      <span class="font-semibold">LTE</span>
    </button>
    <button role="tab" class="tab flex-1" :class="{ 'tab-active': model === 'nr' }" :aria-selected="model === 'nr'" @click="model = 'nr'">
      <span class="font-semibold">NR</span>
    </button>
  </div>
</template>

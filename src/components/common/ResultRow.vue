<script setup lang="ts">
defineProps<{ label: string; value: string; hint?: string; prominent?: boolean }>()
</script>

<template>
  <div class="flex items-start justify-between gap-5 border-b border-base-300 py-3 last:border-0">
    <div><div class="text-sm text-base-content/60">{{ label }}</div><div v-if="hint" class="numeric mt-0.5 break-all text-xs text-base-content/60">{{ hint }}</div></div>
    <output class="numeric break-all text-right" :class="prominent ? 'text-xl font-bold text-primary' : 'font-semibold'">{{ value }}</output>
  </div>
</template>

<script setup lang="ts">
import type { HistoryEntry } from '@/history'

defineProps<{ entries: readonly HistoryEntry[] }>()
const emit = defineEmits<{ restore: [entry: HistoryEntry] }>()
const dateLabel = (timestamp: number) => new Date(timestamp).toLocaleString('ja-JP', {
  month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit',
})

function restore(entry: HistoryEntry) {
  emit('restore', entry)
  window.scrollTo({ top: 0, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' })
}
</script>

<template>
  <details class="collapse collapse-arrow mt-8 border border-base-300 bg-base-200/50">
    <summary class="collapse-title flex items-center gap-3 font-bold">
      計算履歴 <span class="badge badge-ghost numeric">{{ entries.length }}</span>
    </summary>
    <div class="collapse-content">
      <div v-if="entries.length" class="grid grid-cols-1 gap-4 pt-2 pb-2 sm:grid-cols-2">
        <button
          v-for="entry in entries" :key="entry.id" type="button"
          class="card card-border min-w-0 w-full cursor-pointer bg-base-100 text-left shadow-md transition-shadow hover:shadow-lg focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
          :aria-label="`${entry.title}、${entry.values.map((value) => `${value.label} ${value.value}`).join('、')}を復元`"
          @click="restore(entry)"
        >
          <span class="card-body w-full gap-3">
            <span class="flex flex-wrap items-center justify-between gap-2">
              <span class="text-sm font-bold">{{ entry.title }}</span>
              <time :datetime="new Date(entry.createdAt).toISOString()" class="numeric text-xs text-base-content/60">{{ dateLabel(entry.createdAt) }}</time>
            </span>
            <span v-if="entry.context" class="text-xs text-base-content/70">{{ entry.context }}</span>
            <span class="space-y-2">
              <span v-for="value in entry.values" :key="value.label" class="flex items-start justify-between gap-3">
                <span class="shrink-0 text-xs text-base-content/60">{{ value.label }}</span>
                <span class="numeric min-w-0 break-all text-right text-sm font-bold">{{ value.value }}</span>
              </span>
            </span>
          </span>
        </button>
      </div>
      <p v-else class="py-3 text-sm text-base-content/60">履歴はありません</p>
    </div>
  </details>
</template>

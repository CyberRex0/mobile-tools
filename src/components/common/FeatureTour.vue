<script setup lang="ts">
import { computed } from 'vue'
import { useFeatureTour } from '@/composables/useFeatureTour'
import type { ToolName } from '@/types'

const props = defineProps<{ screen: ToolName; menuOpen: boolean }>()
const emit = defineEmits<{ navigate: [screen: ToolName] }>()
const { visible, step, last, next, skip } = useFeatureTour(() => props.screen)
const content = computed(() => ({
  'cell-id': {
    title: 'メニューから機能を切り替え',
    message: '左上のメニューから、ARFCN計算や設定の画面を開けます。',
  },
  arfcn: {
    title: 'ARFCN計算',
    message: 'ARFCNと周波数を相互変換できます。地域ごとのバンド候補も表示します。',
  },
  settings: {
    title: '設定',
    message: '計算履歴の削除はこちらから。左上のメニューで各計算画面に戻れます。',
  },
})[props.screen])

function advance() {
  const screen = next()
  if (screen) emit('navigate', screen)
}
</script>

<template>
  <aside
    v-if="visible && !menuOpen"
    class="card card-border absolute top-full left-0 z-40 mt-3 w-[min(21rem,calc(100vw-1.5rem))] bg-base-100 text-base-content shadow-xl"
    aria-label="機能の案内" aria-live="polite"
    @keydown.esc="skip"
  >
    <span aria-hidden="true" class="absolute -top-1.5 left-4 size-3 rotate-45 border-t border-l border-base-300 bg-base-100"></span>
    <div class="card-body gap-3 p-5">
      <div class="flex items-start justify-between gap-3">
        <h2 class="text-sm font-bold">{{ content.title }}</h2>
        <span class="numeric shrink-0 text-xs text-base-content/60">{{ step }} / 3</span>
      </div>
      <p class="text-sm leading-6">{{ content.message }}</p>
      <div class="card-actions mt-1 items-center justify-between">
        <button type="button" class="btn btn-ghost btn-sm min-h-11" @click="skip">スキップ</button>
        <button type="button" class="btn btn-sm min-h-11" @click="advance">{{ last ? '完了' : '次へ' }}</button>
      </div>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { computed, shallowRef } from 'vue'
import { useCalculationHistory, type HistoryTool } from '@/history'

const history = useCalculationHistory()
const message = shallowRef('')
const cellCount = computed(() => history.entries.value.filter((entry) => entry.tool === 'cell-id').length)
const arfcnCount = computed(() => history.entries.value.filter((entry) => entry.tool === 'arfcn').length)

function clear(tool?: HistoryTool) {
  history.clear(tool)
  message.value = `${tool === 'cell-id' ? 'セルID計算の' : tool === 'arfcn' ? 'ARFCN計算の' : 'すべての'}履歴を削除しました`
}
</script>

<template>
  <section class="mx-auto w-full max-w-5xl">
    <header class="mb-6"><h1 class="text-2xl font-bold tracking-tight sm:text-3xl">設定</h1></header>
    <div class="card card-border max-w-2xl bg-base-100 shadow-sm">
      <div class="card-body gap-5">
        <h2 class="card-title">計算履歴</h2>
        <div class="flex flex-wrap items-center justify-between gap-3 border-b border-base-300 pb-4">
          <div><div class="text-sm font-bold">セルID計算</div><div class="numeric mt-1 text-sm text-base-content/60">{{ cellCount }}件</div></div>
          <button class="btn btn-soft" :disabled="!cellCount" aria-label="セルID計算の履歴を削除" @click="clear('cell-id')">削除</button>
        </div>
        <div class="flex flex-wrap items-center justify-between gap-3 border-b border-base-300 pb-4">
          <div><div class="text-sm font-bold">ARFCN計算</div><div class="numeric mt-1 text-sm text-base-content/60">{{ arfcnCount }}件</div></div>
          <button class="btn btn-soft" :disabled="!arfcnCount" aria-label="ARFCN計算の履歴を削除" @click="clear('arfcn')">削除</button>
        </div>
        <button class="btn btn-soft btn-error w-full sm:w-fit" :disabled="!cellCount && !arfcnCount" @click="clear()">すべての履歴を削除</button>
        <p v-if="message" role="status" class="text-sm text-base-content/70">{{ message }}</p>
      </div>
    </div>
  </section>
</template>

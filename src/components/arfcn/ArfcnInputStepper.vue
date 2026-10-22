<script setup lang="ts">
const model = defineModel<string>({ required: true })
const props = defineProps<{ max: number }>()

function adjust(delta: number) {
  const parsed = Number.parseInt(model.value, 10)
  const current = Number.isFinite(parsed) ? parsed : 0
  model.value = Math.min(props.max, Math.max(0, current + delta)).toString()
}
</script>

<template>
  <div class="grid grid-cols-4 sm:grid-cols-[auto_auto_minmax(0,1fr)_auto_auto] items-stretch gap-1.5 sm:gap-2">
    <button type="button" class="btn btn-soft btn-square h-auto w-full sm:w-auto min-h-14 sm:min-h-16" aria-label="ARFCNを10減らす" @click="adjust(-10)">
      <span class="numeric text-xs sm:text-sm">−10</span>
    </button>
    <button type="button" class="btn btn-soft btn-square h-auto w-full sm:w-auto min-h-14 sm:min-h-16" aria-label="ARFCNを1減らす" @click="adjust(-1)">
      <span class="numeric text-sm sm:text-base">−1</span>
    </button>
    <input
      v-model="model"
      inputmode="numeric"
      class="input input-xl numeric col-span-4 row-start-1 h-auto sm:col-span-1 sm:col-start-3 sm:row-start-1 min-h-14 w-full min-w-0 px-2 text-center text-xl font-bold sm:min-h-16 sm:text-2xl"
      placeholder="0"
      aria-label="ARFCN"
    />
    <button type="button" class="btn btn-soft btn-square h-auto w-full sm:w-auto min-h-14 sm:min-h-16" aria-label="ARFCNを1増やす" @click="adjust(1)">
      <span class="numeric text-sm sm:text-base">+1</span>
    </button>
    <button type="button" class="btn btn-soft btn-square h-auto w-full sm:w-auto min-h-14 sm:min-h-16" aria-label="ARFCNを10増やす" @click="adjust(10)">
      <span class="numeric text-xs sm:text-sm">+10</span>
    </button>
  </div>
</template>

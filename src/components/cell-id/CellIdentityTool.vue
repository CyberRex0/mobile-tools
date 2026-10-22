<script setup lang="ts">
import TechnologyTabs from '@/components/common/TechnologyTabs.vue'
import ResultRow from '@/components/common/ResultRow.vue'
import { useCellIdentity } from '@/composables/useCellIdentity'
import CalculationHistory from '@/components/common/CalculationHistory.vue'
import { useCellIdentityHistory } from '@/composables/useCellIdentityHistory'
import { useCalculationHistory } from '@/history'

const calculator = useCellIdentity()
const { technology, mode, nrNodeBits, form, result, setMode } = calculator
const { entries, restore } = useCellIdentityHistory(calculator, useCalculationHistory())
</script>

<template>
  <section class="mx-auto w-full max-w-5xl">
    <header class="mb-6">
      <h1 class="text-2xl font-bold tracking-tight sm:text-3xl">セルID計算</h1>
    </header>

    <TechnologyTabs v-model="technology" class="mb-5 w-full sm:w-80" />

    <div class="grid gap-5 lg:grid-cols-[1.08fr_0.92fr]">
      <div class="card card-border bg-base-100 shadow-sm">
        <div class="card-body gap-5">
          <div class="join w-full">
            <button class="btn join-item flex-1" :class="{ 'btn-active': mode === 'decompose' }" :aria-pressed="mode === 'decompose'" @click="setMode('decompose')">IDを分解</button>
            <button class="btn join-item flex-1" :class="{ 'btn-active': mode === 'compose' }" :aria-pressed="mode === 'compose'" @click="setMode('compose')">IDを合成</button>
          </div>

          <label v-if="technology === 'nr'" class="form-control">
            <span class="mb-2 text-sm font-medium">gNodeB ID ビット長</span>
            <select v-model.number="nrNodeBits" class="select numeric w-full" aria-label="gNodeB ID ビット長">
              <option v-for="bits in 11" :key="bits + 21" :value="bits + 21">{{ bits + 21 }} bit</option>
            </select>
          </label>

          <template v-if="mode === 'compose'">
            <label class="form-control">
              <span class="mb-2 text-sm font-medium">{{ technology === 'lte' ? 'eNodeB ID' : 'gNodeB ID' }}</span>
              <input v-model="form.nodeId" inputmode="numeric" class="input numeric w-full" :placeholder="technology === 'lte' ? '例: 12345' : '例: 123456'" />
            </label>
            <label class="form-control">
              <span class="mb-2 text-sm font-medium">Cell ID</span>
              <input v-model="form.cellId" inputmode="numeric" class="input numeric w-full" placeholder="例: 10" />
            </label>
          </template>
          <label v-else class="form-control">
            <span class="mb-2 text-sm font-medium">{{ technology === 'lte' ? 'ECI' : 'NCI' }}</span>
            <input v-model="form.identity" inputmode="numeric" class="input numeric w-full" :placeholder="technology === 'lte' ? '例: 3160330' : '例: 505679010'" />
          </label>
        </div>
      </div>

      <div class="card bg-base-200/70">
        <div class="card-body">
          <div class="flex items-center justify-between"><h2 class="card-title">計算結果</h2><span class="badge badge-soft">{{ technology.toUpperCase() }}</span></div>
          <div v-if="result.value" class="mt-2">
            <template v-if="mode === 'compose'">
              <ResultRow :label="technology === 'lte' ? 'ECI' : 'NCI'" :value="result.value.identity.toString()" :hint="result.identityHex" prominent />
              <ResultRow label="ビット構成" :value="`${result.value.nodeBits} + ${result.value.cellBits} bit`" />
            </template>
            <template v-else>
              <ResultRow :label="technology === 'lte' ? 'eNodeB ID' : 'gNodeB ID'" :value="result.value.networkNodeId.toString()" :hint="result.nodeHex" prominent />
              <ResultRow label="Cell ID" :value="result.value.localCellId.toString()" :hint="result.cellHex" />
              <ResultRow label="ビット構成" :value="`${result.value.nodeBits} + ${result.value.cellBits} bit`" />
            </template>
          </div>
          <div v-else role="alert" class="alert alert-soft mt-3">
            <svg class="size-5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="12" cy="12" r="9"/><path d="M12 8v5m0 3h.01"/></svg>
            <span class="text-sm">{{ result.error }}</span>
          </div>
        </div>
      </div>
    </div>
    <CalculationHistory :entries="entries" @restore="restore" />
  </section>
</template>

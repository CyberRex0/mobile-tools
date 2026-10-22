<script setup lang="ts">
import { computed } from 'vue'
import ArfcnInputStepper from '@/components/arfcn/ArfcnInputStepper.vue'
import TechnologyTabs from '@/components/common/TechnologyTabs.vue'
import { useArfcn } from '@/composables/useArfcn'
import { regions } from '@/data/regions'
import CalculationHistory from '@/components/common/CalculationHistory.vue'
import { useArfcnHistory } from '@/composables/useArfcnHistory'
import { useCalculationHistory } from '@/history'

const calculator = useArfcn()
const { technology, mode, direction, region, form, result } = calculator
const { entries, restore } = useArfcnHistory(calculator, useCalculationHistory())
const frequencyLabel = (value: number) => `${value.toFixed(3).replace(/\.?(0+)$/, '')} MHz`
const primaryRow = computed(() => result.value.conversion)
const channelLabel = computed(() => technology.value === 'lte' ? 'EARFCN' : 'NR-ARFCN')
const maxChannel = computed(() => technology.value === 'lte' ? 262143 : 3279165)
</script>

<template>
  <section class="mx-auto w-full max-w-5xl">
    <header class="mb-6">
      <h1 class="text-2xl font-bold tracking-tight sm:text-3xl">ARFCN計算</h1>
    </header>

    <TechnologyTabs v-model="technology" class="mb-5 w-full sm:w-80" />

    <div class="grid grid-cols-1 gap-5 lg:grid-cols-[1.08fr_0.92fr]">
      <div class="card card-border bg-base-100 shadow-sm">
        <div class="card-body gap-5">
          <div class="join w-full">
            <button class="btn join-item min-w-0 flex-1 whitespace-nowrap px-1 text-[0.6875rem] sm:px-3 sm:text-sm" :class="{ 'btn-active': mode === 'channel-to-frequency' }" :aria-pressed="mode === 'channel-to-frequency'" @click="mode = 'channel-to-frequency'">ARFCN → 周波数</button>
            <button class="btn join-item min-w-0 flex-1 whitespace-nowrap px-1 text-[0.6875rem] sm:px-3 sm:text-sm" :class="{ 'btn-active': mode === 'frequency-to-channel' }" :aria-pressed="mode === 'frequency-to-channel'" @click="mode = 'frequency-to-channel'">周波数 → ARFCN</button>
          </div>

          <label class="form-control">
            <span class="mb-2 text-sm font-medium">地域</span>
            <select v-model="region" class="select w-full">
              <option v-for="option in regions" :key="option.id" :value="option.id">{{ option.label }}</option>
            </select>
          </label>

          <label class="form-control">
            <span class="mb-2 text-sm font-medium">方向</span>
            <select v-model="direction" class="select w-full">
              <option value="downlink">Downlink（基地局 → 端末）</option>
              <option value="uplink">Uplink（端末 → 基地局）</option>
            </select>
          </label>

          <div v-if="mode === 'channel-to-frequency'" class="form-control" role="group" aria-labelledby="channel-label">
            <span id="channel-label" class="mb-2 text-sm font-medium">{{ channelLabel }}</span>
            <ArfcnInputStepper v-model="form.channel" :max="maxChannel" />
          </div>
          <label v-else class="form-control">
            <span class="mb-2 text-sm font-medium">中心周波数</span>
            <span class="input numeric flex w-full items-center gap-2">
              <input v-model="form.frequencyMHz" inputmode="decimal" class="numeric min-w-0 grow" placeholder="例: 3600" />
              <span class="text-sm text-base-content/50">MHz</span>
            </span>
          </label>
        </div>
      </div>

      <div class="card bg-base-200/70">
        <div class="card-body">
          <div class="flex items-center justify-between"><h2 class="card-title">計算結果</h2><span class="badge badge-soft">{{ technology.toUpperCase() }}</span></div>
          <div v-if="primaryRow" class="mt-2">
            <div class="rounded-box bg-primary px-5 py-6 text-primary-content shadow-sm sm:px-6 sm:py-7">
              <div class="text-xs font-bold tracking-[0.16em] opacity-70">
                {{ mode === 'channel-to-frequency' ? '中心周波数' : channelLabel }}
              </div>
              <output class="numeric mt-2 block break-all text-3xl font-bold tracking-tight sm:text-4xl">
                {{ mode === 'channel-to-frequency' ? frequencyLabel(primaryRow.frequencyMHz) : primaryRow.channel.toLocaleString('ja-JP') }}
              </output>
              <div class="numeric mt-3 text-sm opacity-75">
                {{ mode === 'channel-to-frequency' ? `${channelLabel} ${primaryRow.channel.toLocaleString('ja-JP')}` : `中心周波数 ${frequencyLabel(primaryRow.frequencyMHz)}` }}
              </div>
            </div>

            <div v-if="result.rows.length" class="mt-5">
              <h3 class="mb-2 text-xs font-bold tracking-wider text-base-content/50">推定バンド</h3>
              <div class="space-y-2">
                <div v-for="(row, index) in result.rows" :key="`${row.band}-${row.channel}-${index}`" class="flex flex-wrap items-center gap-2 rounded-box border border-base-300 bg-base-100 px-4 py-3">
                  <span class="badge badge-soft numeric font-bold">{{ row.band }}</span><span class="text-sm font-semibold">{{ row.bandName }}</span>
                  <span class="ml-auto badge badge-ghost text-xs">{{ row.mode }}</span><span class="badge badge-ghost text-xs">{{ row.direction === 'downlink' ? 'DL' : 'UL' }}</span>
                  <div v-if="mode === 'frequency-to-channel'" class="flex w-full items-center justify-between gap-2 border-t border-base-300 pt-2">
                    <span class="text-xs text-base-content/60">{{ channelLabel }}</span>
                    <output class="numeric text-sm font-bold">{{ row.channel.toLocaleString('ja-JP') }}</output>
                  </div>
                </div>
              </div>
            </div>
            <p v-if="result.notice" role="status" class="mt-4 text-sm text-base-content/70">{{ result.notice }}</p>
          </div>
          <div v-else role="alert" class="alert alert-soft mt-3">
            <svg class="size-5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="12" cy="12" r="9"/><path d="M12 8v5m0 3h.01"/></svg><span class="text-sm">{{ result.error }}</span>
          </div>
        </div>
      </div>
    </div>
    <CalculationHistory :entries="entries" @restore="restore" />
  </section>
</template>

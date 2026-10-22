<script setup lang="ts">
import { computed, provide, shallowRef } from 'vue'
import ArfcnTool from '@/components/arfcn/ArfcnTool.vue'
import CellIdentityTool from '@/components/cell-id/CellIdentityTool.vue'
import SettingsScreen from '@/components/settings/SettingsScreen.vue'
import { calculationHistoryKey, createCalculationHistory } from '@/history'
import type { ToolName } from '@/types'

const activeTool = shallowRef<ToolName>('cell-id')
const drawerOpen = shallowRef(false)
const screens = { 'cell-id': CellIdentityTool, arfcn: ArfcnTool, settings: SettingsScreen }
const activeComponent = computed(() => screens[activeTool.value])
provide(calculationHistoryKey, createCalculationHistory())

function navigate(tool: ToolName) { activeTool.value = tool; drawerOpen.value = false }
</script>

<template>
  <div class="drawer min-h-dvh">
    <input id="main-navigation" v-model="drawerOpen" type="checkbox" class="drawer-toggle" />
    <div class="drawer-content flex min-w-0 flex-col">
      <nav class="navbar sticky top-0 z-20 border-b border-base-300 bg-base-100 px-3 sm:px-6">
        <div class="shrink-0">
          <label for="main-navigation" class="btn btn-ghost btn-circle drawer-button" role="button" tabindex="0" :aria-expanded="drawerOpen" aria-controls="navigation-menu" aria-label="メニューを開く" @keydown.enter.prevent="drawerOpen = !drawerOpen" @keydown.space.prevent="drawerOpen = !drawerOpen">
            <svg class="size-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M4 7h16M4 12h16M4 17h16" stroke-linecap="round"/></svg>
          </label>
        </div>
        <div class="ml-2 min-w-0">
          <button class="flex items-center gap-2" aria-label="セルID計算へ" @click="navigate('cell-id')">
            <span class="grid size-8 place-items-center rounded-xl bg-primary text-primary-content shadow-sm">
              <svg class="size-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="17" r="1.5"/><path d="M8.5 13.5a5 5 0 0 1 7 0M5.5 10.5a9 9 0 0 1 13 0" stroke-linecap="round"/></svg>
            </span>
            <span class="text-sm font-bold tracking-tight sm:text-base">Mobile Network Tools</span>
          </button>
        </div>
      </nav>

      <main class="flex-1 px-4 py-6 sm:px-8 sm:py-10">
        <component :is="activeComponent" />
      </main>

    </div>

    <div class="drawer-side z-30">
      <label for="main-navigation" aria-label="メニューを閉じる" class="drawer-overlay"></label>
      <aside id="navigation-menu" class="flex min-h-full w-72 max-w-[85vw] flex-col bg-base-100 p-4 text-base-content" @keydown.esc="drawerOpen = false">
        <div class="flex items-center gap-3 px-3 py-4">
          <span class="grid size-10 place-items-center rounded-2xl bg-primary text-primary-content">
            <svg class="size-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="17" r="1.5"/><path d="M8.5 13.5a5 5 0 0 1 7 0M5.5 10.5a9 9 0 0 1 13 0" stroke-linecap="round"/></svg>
          </span>
          <div class="font-bold">Mobile Network Tools</div>
        </div>
        <ul class="menu mt-5 w-full gap-2 p-0">
          <li>
            <button :class="{ 'menu-active': activeTool === 'cell-id' }" @click="navigate('cell-id')">
              <svg class="size-5" viewBox="0 0 24 24" fill="none" stroke="currentColor"><rect x="4" y="4" width="16" height="16" rx="4"/><path d="M8 9h8M8 13h3M8 17h5"/></svg>
              <span class="font-bold">セルID計算</span>
            </button>
          </li>
          <li>
            <button :class="{ 'menu-active': activeTool === 'arfcn' }" @click="navigate('arfcn')">
              <svg class="size-5" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M4 16h2l2-8 3 11 3-14 3 11h3" stroke-linejoin="round"/></svg>
              <span class="font-bold">ARFCN計算</span>
            </button>
          </li>
          <li>
            <button :class="{ 'menu-active': activeTool === 'settings' }" @click="navigate('settings')">
              <svg class="size-5" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M4 7h16M4 17h16" stroke-linecap="round"/><circle cx="9" cy="7" r="3" fill="var(--color-base-100)"/><circle cx="15" cy="17" r="3" fill="var(--color-base-100)"/></svg>
              <span class="font-bold">設定</span>
            </button>
          </li>
        </ul>
      </aside>
    </div>
  </div>
</template>

import { computed, reactive, shallowRef } from 'vue'
import type { RadioTechnology } from '@/types'
import { composeCellIdentity, decomposeCellIdentity, toHex } from '@/utils/cellIdentity'

export function useCellIdentity() {
  const technology = shallowRef<RadioTechnology>('lte')
  const mode = shallowRef<'compose' | 'decompose'>('decompose')
  const nrNodeBits = shallowRef(24)
  const form = reactive({ nodeId: '', cellId: '', identity: '' })

  const result = computed(() => {
    try {
      const value = mode.value === 'compose'
        ? composeCellIdentity(form.nodeId, form.cellId, technology.value, nrNodeBits.value)
        : decomposeCellIdentity(form.identity, technology.value, nrNodeBits.value)
      return { value, error: '', identityHex: toHex(value.identity), nodeHex: toHex(value.networkNodeId), cellHex: toHex(value.localCellId) }
    } catch (error) {
      return { value: null, error: error instanceof Error ? error.message : '入力値を確認してください', identityHex: '', nodeHex: '', cellHex: '' }
    }
  })

  function setTechnology(value: RadioTechnology) { technology.value = value }
  function setMode(value: 'compose' | 'decompose') { mode.value = value }

  return { technology, mode, nrNodeBits, form, result, setTechnology, setMode }
}

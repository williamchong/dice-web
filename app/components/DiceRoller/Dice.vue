<template>
  <TresMesh
    v-if="mesh"
    :position="position"
    :rotation="rotation"
    :geometry="mesh.geometry"
    :material="mesh.material"
  />
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { createDiceGeometry } from '~/composables/dice/useDiceGeometry'
import type { DiceType } from '~/types/dice'
import type * as THREE from 'three'

interface Props {
  type: DiceType
  position?: [number, number, number]
  rotation?: [number, number, number]
}

const props = withDefaults(defineProps<Props>(), {
  position: () => [0, 0, 0],
  rotation: () => [0, 0, 0]
})

const mesh = ref<{ geometry: THREE.BufferGeometry; material: THREE.Material } | null>(null)

onMounted(() => {
  // Create dice geometry and material
  mesh.value = createDiceGeometry(props.type)
})
</script>

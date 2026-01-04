<template>
  <TresMesh
    v-if="diceGeometry"
    ref="meshRef"
    :geometry="diceGeometry.geometry"
    :material="diceGeometry.material"
    cast-shadow
    receive-shadow
  />
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'
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

const { diceScale } = useResponsive3D()
const { isInitialized } = useRapierWorld()

const meshRef = ref<THREE.Mesh | null>(null)
const diceGeometry = ref<{ geometry: THREE.BufferGeometry; material: THREE.Material } | null>(null)

// Physics integration
const physics = useDicePhysics(meshRef, props.type)

// Expose physics methods for parent
defineExpose({
  syncFromPhysics: physics.syncMeshFromPhysics,
  applyForce: physics.applyForce,
  applyImpulse: physics.applyImpulse,
  resetPosition: physics.resetPosition,
  setAngularVelocity: physics.setAngularVelocity,
  isMoving: physics.isMoving,
  rigidBody: physics.rigidBody
})

onMounted(async () => {
  // Create dice geometry and material with responsive scale
  diceGeometry.value = createDiceGeometry(props.type, diceScale.value)

  // Wait for physics to initialize, then create physics body
  if (isInitialized.value) {
    await physics.createPhysicsBody(props.position)
  }
})

// Watch for physics initialization
watch(isInitialized, async (ready) => {
  if (ready && !physics.rigidBody.value && meshRef.value) {
    await physics.createPhysicsBody(props.position)
  }
})

onUnmounted(() => {
  physics.cleanup()
})
</script>

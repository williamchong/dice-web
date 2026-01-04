<template>
  <TresCanvas v-bind="state" window-size>
    <!-- Camera: Top-down view looking into the dice cup -->
    <TresPerspectiveCamera
      ref="camera"
      :position="cameraPosition"
      :look-at="[0, 0, 0]"
      :fov="cameraFov"
    />

    <!-- Lights: Overhead lighting for top-down view -->
    <TresAmbientLight :intensity="0.6" />
    <TresDirectionalLight
      :position="[0, 15, 5]"
      :intensity="0.8"
      cast-shadow
    />
    <TresDirectionalLight
      :position="[5, 10, 0]"
      :intensity="0.3"
    />

    <!-- Dice Cup/Tray -->
    <DiceRollerDiceCup />

    <!-- Render dice based on store configuration -->
    <DiceRollerDice
      v-for="(die, index) in diceInstances"
      :key="die.id"
      :ref="(el) => { if (el) diceRefs[index] = el }"
      :type="die.type"
      :position="die.position"
      :rotation="die.rotation"
    />
  </TresCanvas>
</template>

<script setup lang="ts">
import { reactive, computed, watch, ref, onMounted, onUnmounted } from 'vue'
import type { DiceType } from '~/types/dice'

interface DiceInstance {
  id: string
  type: DiceType
  position: [number, number, number]
  rotation: [number, number, number]
}

const diceConfig = useDiceConfigStore()
const camera = ref()

// Responsive 3D viewport calculations
const { cameraPosition, cameraFov, diceSpacing } = useResponsive3D()

// Physics world
const physicsWorld = useRapierWorld()

// TresJS canvas state
const state = reactive({
  clearColor: '#0a0a0a',  // Darker background for casino/table feel
  shadows: true,
  alpha: false,
  windowSize: true
})

// Store references to dice components for physics sync
const diceRefs = ref<any[]>([])

// Physics game loop using requestAnimationFrame
let animationFrameId: number | null = null

function physicsLoop() {
  if (physicsWorld.isInitialized.value) {
    // Step physics simulation (fixed timestep: 60 FPS)
    physicsWorld.step(1 / 60)

    // Sync all dice meshes from physics
    diceRefs.value.forEach((diceRef) => {
      if (diceRef?.syncFromPhysics) {
        diceRef.syncFromPhysics()
      }
    })
  }

  // Continue loop
  animationFrameId = requestAnimationFrame(physicsLoop)
}

// Generate dice instances based on store configuration
const diceInstances = computed(() => {
  const instances: DiceInstance[] = []
  let index = 0

  // Helper to add dice of a specific type
  const addDice = (type: DiceType, count: number) => {
    for (let i = 0; i < count; i++) {
      // Arrange dice in a grid pattern inside the cup
      const row = Math.floor(index / 3)
      const col = index % 3

      const x = (col - 1) * diceSpacing.value
      const z = (row - 1) * diceSpacing.value

      // Add small random offset for natural placement
      const randomX = (Math.random() - 0.5) * 0.3
      const randomZ = (Math.random() - 0.5) * 0.3

      instances.push({
        id: `${type}-${i}`,
        type,
        position: [x + randomX, 0.5, z + randomZ],  // At rest on cup floor
        rotation: [
          0,  // No X rotation (laying flat)
          Math.random() * Math.PI * 2,  // Random Y rotation
          0   // No Z rotation (laying flat)
        ]
      })
      index++
    }
  }

  // Add all dice from configuration
  addDice('d4', diceConfig.d4)
  addDice('d6', diceConfig.d6)
  addDice('d8', diceConfig.d8)
  addDice('d10', diceConfig.d10)
  addDice('d12', diceConfig.d12)
  addDice('d20', diceConfig.d20)
  addDice('d100', diceConfig.d100)

  return instances
})

// Initialize physics on mount
onMounted(async () => {
  console.log('Initializing Rapier physics...')
  await physicsWorld.init()

  // Start physics loop
  animationFrameId = requestAnimationFrame(physicsLoop)
})

// Cleanup physics on unmount
onUnmounted(() => {
  // Stop animation loop
  if (animationFrameId !== null) {
    cancelAnimationFrame(animationFrameId)
  }

  physicsWorld.cleanup()
})

// Watch for dice configuration changes
watch(() => diceConfig.totalDiceCount, (newCount) => {
  console.log(`Dice count changed: ${newCount}`)
  // Reset dice refs array when count changes
  diceRefs.value = []
})

/**
 * Roll all dice - applies random forces and positions
 */
function rollDice() {
  if (!physicsWorld.isInitialized.value) {
    console.warn('Physics not initialized yet')
    return
  }

  diceRefs.value.forEach((diceRef, index) => {
    if (!diceRef) return

    // Reset to random position above cup (let them fall)
    const x = (Math.random() - 0.5) * 3  // Spread within cup
    const y = 3 + Math.random() * 2      // Drop from height 3-5
    const z = (Math.random() - 0.5) * 3

    diceRef.resetPosition([x, y, z])

    // Apply random spin (angular velocity)
    diceRef.setAngularVelocity({
      x: (Math.random() - 0.5) * 10,
      y: (Math.random() - 0.5) * 10,
      z: (Math.random() - 0.5) * 10
    })

    // Apply random horizontal impulse for lateral movement
    diceRef.applyImpulse({
      x: (Math.random() - 0.5) * 2,
      y: 0,  // Don't push up/down, let gravity do the work
      z: (Math.random() - 0.5) * 2
    })
  })

  console.log(`🎲 Rolled ${diceRefs.value.length} dice!`)
}

// Expose roll function to parent
defineExpose({
  rollDice
})
</script>

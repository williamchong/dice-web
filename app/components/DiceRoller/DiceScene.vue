<template>
  <TresCanvas v-bind="state" window-size>
    <!-- Camera: Top-down view looking into the dice cup -->
    <TresPerspectiveCamera :position="[0, 12, 0]" :look-at="[0, 0, 0]" />

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
      :type="die.type"
      :position="die.position"
      :rotation="die.rotation"
    />
  </TresCanvas>
</template>

<script setup lang="ts">
import { reactive, computed, watch } from 'vue'
import type { DiceType } from '~/types/dice'

interface DiceInstance {
  id: string
  type: DiceType
  position: [number, number, number]
  rotation: [number, number, number]
}

const diceConfig = useDiceConfigStore()

// TresJS canvas state
const state = reactive({
  clearColor: '#0a0a0a',  // Darker background for casino/table feel
  shadows: true,
  alpha: false,
  windowSize: true
})

// Generate dice instances based on store configuration
const diceInstances = computed(() => {
  const instances: DiceInstance[] = []
  let index = 0

  // Helper to add dice of a specific type
  const addDice = (type: DiceType, count: number) => {
    for (let i = 0; i < count; i++) {
      // Arrange dice in a grid pattern inside the cup (7x7 unit area)
      const row = Math.floor(index / 3)
      const col = index % 3
      const x = (col - 1) * 2.0    // Spread horizontally within cup
      const z = (row - 1) * 2.0    // Spread depth-wise within cup

      // Add small random offset for natural placement
      const randomX = (Math.random() - 0.5) * 0.3
      const randomZ = (Math.random() - 0.5) * 0.3

      instances.push({
        id: `${type}-${i}`,
        type,
        position: [x + randomX, 0.6, z + randomZ],  // At rest on cup floor (y=0.6)
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

// Watch for dice configuration changes
watch(() => diceConfig.totalDiceCount, (newCount) => {
  console.log(`Dice count changed: ${newCount}`)
})
</script>

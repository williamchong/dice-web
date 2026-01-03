<template>
  <div class="space-y-3">
    <div v-for="type in diceTypes" :key="type" class="flex items-center justify-between bg-gray-700 rounded-lg p-3">
      <div class="flex items-center space-x-3">
        <span class="text-lg font-semibold w-12">{{ type.toUpperCase() }}</span>
        <span class="text-gray-400 text-sm">{{ type === 'd100' ? '(2×d10)' : `${getFaceCount(type)} faces` }}</span>
      </div>

      <div class="flex items-center space-x-2">
        <button
          @click="diceConfig.removeDie(type)"
          :disabled="diceConfig[type] === 0"
          class="w-8 h-8 bg-red-600 hover:bg-red-700 disabled:bg-gray-600 disabled:cursor-not-allowed rounded flex items-center justify-center transition"
        >
          -
        </button>

        <span class="w-8 text-center font-mono">{{ diceConfig[type] }}</span>

        <button
          @click="diceConfig.addDie(type)"
          :disabled="diceConfig.totalDiceCount >= 8"
          class="w-8 h-8 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed rounded flex items-center justify-center transition"
        >
          +
        </button>
      </div>
    </div>

    <div class="text-center text-sm text-gray-400 pt-2 border-t border-gray-600">
      Total: {{ diceConfig.totalDiceCount }} / 8 dice
    </div>
  </div>
</template>

<script setup lang="ts">
import type { DiceType } from '~/types/dice'

const diceConfig = useDiceConfigStore()

const diceTypes: DiceType[] = ['d4', 'd6', 'd8', 'd10', 'd12', 'd20', 'd100']

const getFaceCount = (type: DiceType): number => {
  const faces: Record<DiceType, number> = {
    d4: 4,
    d6: 6,
    d8: 8,
    d10: 10,
    d12: 12,
    d20: 20,
    d100: 100
  }
  return faces[type]
}
</script>

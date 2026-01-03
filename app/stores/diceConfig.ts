import { defineStore } from 'pinia'
import type { DiceConfiguration, DiceType } from '~/types/dice'

export const useDiceConfigStore = defineStore('diceConfig', {
  state: (): DiceConfiguration => ({
    d4: 0,
    d6: 2,  // Start with 2 d6 dice
    d8: 0,
    d10: 0,
    d12: 0,
    d20: 0,
    d100: 0
  }),

  getters: {
    /**
     * Total number of dice in the scene
     */
    totalDiceCount(state): number {
      return state.d4 + state.d6 + state.d8 + state.d10 + state.d12 + state.d20 + state.d100
    },

    /**
     * Array of active dice types with their counts
     */
    activeDiceTypes(state): Array<{ type: DiceType; count: number }> {
      const types: DiceType[] = ['d4', 'd6', 'd8', 'd10', 'd12', 'd20', 'd100']
      return types
        .filter(type => state[type] > 0)
        .map(type => ({ type, count: state[type] }))
    }
  },

  actions: {
    /**
     * Add a die of the specified type
     */
    addDie(type: DiceType) {
      if (this.totalDiceCount < 8) {  // Max 8 dice for performance
        this[type]++
      }
    },

    /**
     * Remove a die of the specified type
     */
    removeDie(type: DiceType) {
      if (this[type] > 0) {
        this[type]--
      }
    },

    /**
     * Set exact count for a dice type
     */
    setDiceCount(type: DiceType, count: number) {
      const maxCount = Math.min(count, 8 - (this.totalDiceCount - this[type]))
      this[type] = Math.max(0, maxCount)
    },

    /**
     * Reset to default configuration
     */
    reset() {
      this.d4 = 0
      this.d6 = 2
      this.d8 = 0
      this.d10 = 0
      this.d12 = 0
      this.d20 = 0
      this.d100 = 0
    }
  }
})

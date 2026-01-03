import { defineStore } from 'pinia'
import type { DieRollResult } from '~/types/dice'

export interface RollResult {
  id: string
  timestamp: number
  rolls: DieRollResult[]
  total: number
}

export const useRollHistoryStore = defineStore('rollHistory', {
  state: () => ({
    history: [] as RollResult[]
  }),

  getters: {
    /**
     * Get the most recent rolls (last 20)
     */
    recentRolls(state): RollResult[] {
      return state.history.slice(-20).reverse()
    },

    /**
     * Get the last roll
     */
    lastRoll(state): RollResult | null {
      return state.history.length > 0 ? state.history[state.history.length - 1] : null
    }
  },

  actions: {
    /**
     * Add a new roll to history
     */
    addRoll(rolls: DieRollResult[]) {
      const total = rolls.reduce((sum, roll) => sum + roll.value, 0)
      const rollResult: RollResult = {
        id: `roll-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        timestamp: Date.now(),
        rolls,
        total
      }
      this.history.push(rollResult)
      this.saveToLocalStorage()
    },

    /**
     * Clear all history
     */
    clearHistory() {
      this.history = []
      this.saveToLocalStorage()
    },

    /**
     * Save history to localStorage
     */
    saveToLocalStorage() {
      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem('diceRollHistory', JSON.stringify(this.history))
        } catch (error) {
          console.error('Failed to save roll history to localStorage:', error)
        }
      }
    },

    /**
     * Load history from localStorage
     */
    loadFromLocalStorage() {
      if (typeof window !== 'undefined') {
        try {
          const saved = localStorage.getItem('diceRollHistory')
          if (saved) {
            this.history = JSON.parse(saved)
          }
        } catch (error) {
          console.error('Failed to load roll history from localStorage:', error)
        }
      }
    }
  }
})

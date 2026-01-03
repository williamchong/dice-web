import { defineStore } from 'pinia'

export interface Settings {
  diceSkin: string
  cupSkin: string
  environmentSkin: string
  soundEnabled: boolean
  hapticsEnabled: boolean
}

export const useSettingsStore = defineStore('settings', {
  state: (): Settings => ({
    diceSkin: 'default',
    cupSkin: 'default',
    environmentSkin: 'default',
    soundEnabled: true,
    hapticsEnabled: true
  }),

  actions: {
    /**
     * Update dice skin
     */
    setDiceSkin(skin: string) {
      this.diceSkin = skin
      this.saveToLocalStorage()
    },

    /**
     * Update cup skin
     */
    setCupSkin(skin: string) {
      this.cupSkin = skin
      this.saveToLocalStorage()
    },

    /**
     * Update environment skin
     */
    setEnvironmentSkin(skin: string) {
      this.environmentSkin = skin
      this.saveToLocalStorage()
    },

    /**
     * Toggle sound
     */
    toggleSound() {
      this.soundEnabled = !this.soundEnabled
      this.saveToLocalStorage()
    },

    /**
     * Toggle haptics
     */
    toggleHaptics() {
      this.hapticsEnabled = !this.hapticsEnabled
      this.saveToLocalStorage()
    },

    /**
     * Save settings to localStorage
     */
    saveToLocalStorage() {
      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem('diceRollerSettings', JSON.stringify(this.$state))
        } catch (error) {
          console.error('Failed to save settings to localStorage:', error)
        }
      }
    },

    /**
     * Load settings from localStorage
     */
    loadFromLocalStorage() {
      if (typeof window !== 'undefined') {
        try {
          const saved = localStorage.getItem('diceRollerSettings')
          if (saved) {
            const settings = JSON.parse(saved)
            this.$patch(settings)
          }
        } catch (error) {
          console.error('Failed to load settings from localStorage:', error)
        }
      }
    }
  }
})

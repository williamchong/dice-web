<template>
  <div class="relative w-screen h-screen overflow-hidden bg-gray-900 text-white">
    <!-- Fullscreen 3D Scene (90% of focus) -->
    <div class="absolute inset-0">
      <ClientOnly>
        <DiceRollerDiceScene ref="diceSceneRef" />
        <template #fallback>
          <div class="w-full h-full flex items-center justify-center bg-gradient-to-b from-gray-800 to-gray-900">
            <div class="text-center">
              <p class="text-gray-400 text-lg mb-4">Loading 3D Scene...</p>
            </div>
          </div>
        </template>
      </ClientOnly>
    </div>

    <!-- Top Bar: Minimal Info -->
    <div class="absolute top-0 left-0 right-0 p-3 md:p-4 pt-safe bg-gradient-to-b from-black/60 to-transparent pointer-events-none">
      <div class="flex items-center justify-between text-xs md:text-sm">
        <div class="text-white/80">
          <span class="font-semibold">{{ diceConfig.totalDiceCount }}</span> dice
        </div>
        <div v-if="lastRoll" class="text-base md:text-lg font-bold text-blue-400">
          Last: {{ lastRoll.total }}
        </div>
      </div>
    </div>

    <!-- Bottom Action Bar: Roll Button (Always Visible) -->
    <div class="absolute bottom-0 left-0 right-0 p-4 md:p-6 pb-safe bg-gradient-to-t from-black/70 to-transparent pointer-events-none">
      <div class="max-w-md mx-auto space-y-2 md:space-y-3 pointer-events-auto">
        <!-- Roll Button -->
        <button
          @click="handleRoll"
          class="w-full bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold py-3 md:py-4 rounded-xl shadow-lg transition transform active:scale-95 touch-manipulation"
        >
          <span class="text-lg md:text-xl">🎲 Roll Dice</span>
        </button>

        <!-- Quick Action Buttons -->
        <div class="flex gap-2 md:gap-3">
          <button
            @click="toggleDiceSelector"
            class="flex-1 bg-gray-800/90 hover:bg-gray-700 text-white py-2.5 md:py-3 rounded-lg transition backdrop-blur-sm touch-manipulation"
          >
            <span class="text-sm md:text-base">⚙️ Dice</span>
          </button>
          <button
            @click="toggleHistory"
            class="flex-1 bg-gray-800/90 hover:bg-gray-700 text-white py-2.5 md:py-3 rounded-lg transition backdrop-blur-sm touch-manipulation"
          >
            <span class="text-sm md:text-base">📜 History</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Floating Panel: Dice Selector (Bottom sheet on mobile, side panel on desktop) -->
    <Transition
      enter-active-class="transition-transform duration-300 ease-out"
      enter-from-class="translate-y-full md:-translate-x-full md:translate-y-0"
      enter-to-class="translate-y-0 md:translate-x-0"
      leave-active-class="transition-transform duration-300 ease-in"
      leave-from-class="translate-y-0 md:translate-x-0"
      leave-to-class="translate-y-full md:-translate-x-full md:translate-y-0"
    >
      <div
        v-if="showDiceSelector"
        class="absolute left-0 right-0 bottom-0 max-h-[70vh] md:top-0 md:right-auto md:bottom-0 md:w-80 md:max-h-none bg-gray-900/98 md:bg-gray-900/95 backdrop-blur-sm md:backdrop-blur-md shadow-2xl border-t md:border-t-0 md:border-r border-gray-700 overflow-y-auto rounded-t-2xl md:rounded-none"
      >
        <div class="p-4 pb-safe">
          <!-- Mobile Handle -->
          <div class="md:hidden w-12 h-1 bg-gray-600 rounded-full mx-auto mb-4" />

          <div class="flex items-center justify-between mb-4">
            <h2 class="text-xl font-semibold">Select Dice</h2>
            <button
              @click="toggleDiceSelector"
              class="w-8 h-8 bg-gray-700 hover:bg-gray-600 rounded-lg transition"
            >
              ✕
            </button>
          </div>
          <DiceSelector />
        </div>
      </div>
    </Transition>

    <!-- Floating Panel: Roll History (Bottom sheet on mobile, side panel on desktop) -->
    <Transition
      enter-active-class="transition-transform duration-300 ease-out"
      enter-from-class="translate-y-full md:translate-x-full md:translate-y-0"
      enter-to-class="translate-y-0 md:translate-x-0"
      leave-active-class="transition-transform duration-300 ease-in"
      leave-from-class="translate-y-0 md:translate-x-0"
      leave-to-class="translate-y-full md:translate-x-full md:translate-y-0"
    >
      <div
        v-if="showHistory"
        class="absolute left-0 right-0 bottom-0 max-h-[70vh] md:left-auto md:right-0 md:top-0 md:bottom-0 md:w-80 md:max-h-none bg-gray-900/98 md:bg-gray-900/95 backdrop-blur-sm md:backdrop-blur-md shadow-2xl border-t md:border-t-0 md:border-l border-gray-700 overflow-y-auto rounded-t-2xl md:rounded-none"
      >
        <div class="p-4 pb-safe">
          <!-- Mobile Handle -->
          <div class="md:hidden w-12 h-1 bg-gray-600 rounded-full mx-auto mb-4" />

          <div class="flex items-center justify-between mb-4">
            <h2 class="text-xl font-semibold">Roll History</h2>
            <button
              @click="toggleHistory"
              class="w-8 h-8 bg-gray-700 hover:bg-gray-600 rounded-lg transition"
            >
              ✕
            </button>
          </div>
          <RollHistory />
        </div>
      </div>
    </Transition>

    <!-- Backdrop Overlay (Close panels on click) -->
    <Transition
      enter-active-class="transition-opacity duration-300"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition-opacity duration-300"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="showDiceSelector || showHistory"
        @click="closePanels"
        class="absolute inset-0 bg-black/50 backdrop-blur-sm"
        style="z-index: -1"
      />
    </Transition>

    <!-- Mobile Warning (Top-right corner, minimal) -->
    <div class="absolute top-4 right-4 max-w-xs">
      <UIMobileWarning />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

// Initialize stores on mount
const rollHistoryStore = useRollHistoryStore()
const settingsStore = useSettingsStore()
const diceConfig = useDiceConfigStore()

// Ref to dice scene component
const diceSceneRef = ref<{ rollDice: () => void } | null>(null)

// UI state
const showDiceSelector = ref(false)
const showHistory = ref(false)

// Computed
const lastRoll = computed(() => rollHistoryStore.lastRoll)

// Methods
const toggleDiceSelector = () => {
  showDiceSelector.value = !showDiceSelector.value
  if (showDiceSelector.value) showHistory.value = false
}

const toggleHistory = () => {
  showHistory.value = !showHistory.value
  if (showHistory.value) showDiceSelector.value = false
}

const closePanels = () => {
  showDiceSelector.value = false
  showHistory.value = false
}

const handleRoll = () => {
  console.log('🎲 Roll button clicked!')

  // Trigger physics roll
  if (diceSceneRef.value?.rollDice) {
    diceSceneRef.value.rollDice()
  } else {
    console.warn('Dice scene not ready yet')
  }

  // Close panels
  closePanels()
}

onMounted(() => {
  rollHistoryStore.loadFromLocalStorage()
  settingsStore.loadFromLocalStorage()
})
</script>

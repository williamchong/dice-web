<template>
  <div class="relative w-screen h-screen overflow-hidden bg-gray-900 text-white">
    <!-- Fullscreen 3D Scene (90% of focus) -->
    <div class="absolute inset-0">
      <ClientOnly>
        <DiceRollerDiceScene />
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
    <div class="absolute top-0 left-0 right-0 p-4 bg-gradient-to-b from-black/60 to-transparent pointer-events-none">
      <div class="flex items-center justify-between">
        <div class="text-sm text-white/80">
          <span class="font-semibold">{{ diceConfig.totalDiceCount }}</span> dice
        </div>
        <div v-if="lastRoll" class="text-lg font-bold text-blue-400">
          Last: {{ lastRoll.total }}
        </div>
      </div>
    </div>

    <!-- Bottom Action Bar: Roll Button (Always Visible) -->
    <div class="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/60 to-transparent">
      <div class="max-w-md mx-auto space-y-3">
        <!-- Roll Button -->
        <button
          @click="handleRoll"
          class="w-full bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold py-4 rounded-xl shadow-lg transition transform active:scale-95"
        >
          <span class="text-xl">🎲 Roll Dice</span>
        </button>

        <!-- Quick Action Buttons -->
        <div class="flex gap-3">
          <button
            @click="toggleDiceSelector"
            class="flex-1 bg-gray-800/90 hover:bg-gray-700 text-white py-3 rounded-lg transition backdrop-blur-sm"
          >
            ⚙️ Dice
          </button>
          <button
            @click="toggleHistory"
            class="flex-1 bg-gray-800/90 hover:bg-gray-700 text-white py-3 rounded-lg transition backdrop-blur-sm"
          >
            📜 History
          </button>
        </div>
      </div>
    </div>

    <!-- Floating Panel: Dice Selector (Slide in from left) -->
    <Transition
      enter-active-class="transition-transform duration-300 ease-out"
      enter-from-class="-translate-x-full"
      enter-to-class="translate-x-0"
      leave-active-class="transition-transform duration-300 ease-in"
      leave-from-class="translate-x-0"
      leave-to-class="-translate-x-full"
    >
      <div
        v-if="showDiceSelector"
        class="absolute left-0 top-0 bottom-0 w-80 bg-gray-900/95 backdrop-blur-md shadow-2xl border-r border-gray-700 overflow-y-auto"
      >
        <div class="p-4">
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

    <!-- Floating Panel: Roll History (Slide in from right) -->
    <Transition
      enter-active-class="transition-transform duration-300 ease-out"
      enter-from-class="translate-x-full"
      enter-to-class="translate-x-0"
      leave-active-class="transition-transform duration-300 ease-in"
      leave-from-class="translate-x-0"
      leave-to-class="translate-x-full"
    >
      <div
        v-if="showHistory"
        class="absolute right-0 top-0 bottom-0 w-80 bg-gray-900/95 backdrop-blur-md shadow-2xl border-l border-gray-700 overflow-y-auto"
      >
        <div class="p-4">
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
  // Placeholder for Phase 4: Actual rolling logic
  console.log('Roll dice!')
  // For now, just close panels
  closePanels()
}

onMounted(() => {
  rollHistoryStore.loadFromLocalStorage()
  settingsStore.loadFromLocalStorage()
})
</script>

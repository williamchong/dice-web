<template>
  <Transition
    enter-active-class="transition-all duration-500"
    enter-from-class="opacity-0 translate-y-[-20px]"
    enter-to-class="opacity-100 translate-y-0"
  >
    <div
      v-if="!isMobile && showWarning"
      class="bg-yellow-900/80 backdrop-blur-sm border border-yellow-600/50 rounded-lg p-3 shadow-lg max-w-[200px]"
    >
      <div class="flex items-start justify-between gap-2">
        <div>
          <div class="flex items-center gap-1 mb-1">
            <span class="text-lg">📱</span>
            <span class="text-xs font-semibold text-yellow-400">Mobile First</span>
          </div>
          <p class="text-xs text-yellow-200/90 leading-tight">
            Best on mobile with shake & tilt
          </p>
        </div>
        <button
          @click="showWarning = false"
          class="text-yellow-400 hover:text-yellow-300 text-xs leading-none"
        >
          ✕
        </button>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

const isMobile = ref(false)
const showWarning = ref(true)

onMounted(() => {
  // Simple mobile detection
  isMobile.value = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)

  // Also check for touch support
  if (!isMobile.value) {
    isMobile.value = 'ontouchstart' in window || navigator.maxTouchPoints > 0
  }

  // Auto-hide warning after 5 seconds
  if (!isMobile.value) {
    setTimeout(() => {
      showWarning.value = false
    }, 5000)
  }
})
</script>

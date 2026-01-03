<template>
  <div class="bg-gray-700 rounded-lg p-3">
    <!-- Timestamp -->
    <div class="text-xs text-gray-400 mb-2">
      {{ formatTime(roll.timestamp) }}
    </div>

    <!-- Individual Dice Results -->
    <div class="flex flex-wrap gap-2 mb-2">
      <span
        v-for="(dieRoll, index) in roll.rolls"
        :key="index"
        class="inline-flex items-center bg-gray-600 rounded px-2 py-1 text-sm"
      >
        <span class="text-gray-400 mr-1">{{ dieRoll.type }}:</span>
        <span class="font-bold">{{ dieRoll.value }}</span>
      </span>
    </div>

    <!-- Total -->
    <div class="text-right">
      <span class="text-gray-400 text-sm mr-2">Total:</span>
      <span class="text-xl font-bold text-blue-400">{{ roll.total }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { RollResult } from '~/stores/rollHistory'

defineProps<{
  roll: RollResult
}>()

const formatTime = (timestamp: number): string => {
  const date = new Date(timestamp)
  const now = new Date()
  const diff = now.getTime() - date.getTime()

  // Less than 1 minute ago
  if (diff < 60000) {
    return 'Just now'
  }

  // Less than 1 hour ago
  if (diff < 3600000) {
    const minutes = Math.floor(diff / 60000)
    return `${minutes} min ago`
  }

  // Today
  if (date.toDateString() === now.toDateString()) {
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
  }

  // Older
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
}
</script>

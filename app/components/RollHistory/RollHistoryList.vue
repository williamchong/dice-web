<template>
  <div>
    <!-- Clear History Button -->
    <button
      v-if="rollHistory.history.length > 0"
      @click="rollHistory.clearHistory"
      class="w-full bg-red-600 hover:bg-red-700 text-white text-sm py-2 rounded-lg mb-3 transition"
    >
      Clear History
    </button>

    <!-- History List -->
    <div v-if="rollHistory.recentRolls.length > 0" class="space-y-2 max-h-[600px] overflow-y-auto">
      <RollHistoryRollHistoryItem
        v-for="roll in rollHistory.recentRolls"
        :key="roll.id"
        :roll="roll"
      />
    </div>

    <!-- Empty State -->
    <div v-else class="text-center py-8 text-gray-400">
      <p>No rolls yet</p>
      <p class="text-sm mt-2">Roll some dice to see your history!</p>
    </div>
  </div>
</template>

<script setup lang="ts">
const rollHistory = useRollHistoryStore()
</script>

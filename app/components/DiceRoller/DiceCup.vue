<template>
  <!-- Dice Cup/Tray - Visible box with walls -->
  <TresGroup>
    <!-- Floor of the cup -->
    <TresMesh :position="[0, 0, 0]" receive-shadow>
      <TresBoxGeometry :args="[cupSize, 0.1, cupSize]" />
      <TresMeshStandardMaterial :color="0x2a1810" :roughness="0.8" />
    </TresMesh>

    <!-- Wall: Front -->
    <TresMesh :position="[0, cupWallHeight / 2, cupSize / 2]" cast-shadow receive-shadow>
      <TresBoxGeometry :args="[cupSize, cupWallHeight, wallThickness]" />
      <TresMeshStandardMaterial :color="0x4a2818" :roughness="0.6" />
    </TresMesh>

    <!-- Wall: Back -->
    <TresMesh :position="[0, cupWallHeight / 2, -cupSize / 2]" cast-shadow receive-shadow>
      <TresBoxGeometry :args="[cupSize, cupWallHeight, wallThickness]" />
      <TresMeshStandardMaterial :color="0x4a2818" :roughness="0.6" />
    </TresMesh>

    <!-- Wall: Left -->
    <TresMesh :position="[-cupSize / 2, cupWallHeight / 2, 0]" cast-shadow receive-shadow>
      <TresBoxGeometry :args="[wallThickness, cupWallHeight, cupSize]" />
      <TresMeshStandardMaterial :color="0x4a2818" :roughness="0.6" />
    </TresMesh>

    <!-- Wall: Right -->
    <TresMesh :position="[cupSize / 2, cupWallHeight / 2, 0]" cast-shadow receive-shadow>
      <TresBoxGeometry :args="[wallThickness, cupWallHeight, cupSize]" />
      <TresMeshStandardMaterial :color="0x4a2818" :roughness="0.6" />
    </TresMesh>

    <!-- Optional: Felt/fabric texture on floor -->
    <TresMesh :position="[0, 0.06, 0]" receive-shadow>
      <TresPlaneGeometry :args="[cupSize - 0.2, cupSize - 0.2]" :rotation-x="-Math.PI / 2" />
      <TresMeshStandardMaterial :color="0x1a4d1a" :roughness="0.9" />
    </TresMesh>
  </TresGroup>
</template>

<script setup lang="ts">
// Dice cup dimensions
const cupSize = 8        // Width/depth of the cup (8x8 units)
const cupWallHeight = 1.5 // Height of the walls
const wallThickness = 0.2 // Thickness of the walls
</script>

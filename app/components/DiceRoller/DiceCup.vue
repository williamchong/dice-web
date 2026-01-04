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
import { onMounted, watch } from 'vue'

const { cupSize } = useResponsive3D()
const { rapier, world, isInitialized } = useRapierWorld()

const cupWallHeight = 1.5
const wallThickness = 0.2

/**
 * Create physics colliders for cup walls
 * These act as invisible boundaries for the dice
 */
async function createWallColliders() {
  if (!isInitialized.value || !rapier.value || !world.value) {
    console.warn('Physics not ready, skipping wall colliders')
    return
  }

  const size = cupSize.value
  const halfWall = wallThickness / 2

  // Floor collider (already exists as ground plane, but add cup-specific one)
  const floorDesc = rapier.value.ColliderDesc.cuboid(size / 2, 0.05, size / 2)
    .setTranslation(0, 0, 0)
    .setRestitution(0.3)
    .setFriction(0.6)
  world.value.createCollider(floorDesc)

  // Front wall
  const frontWallDesc = rapier.value.ColliderDesc.cuboid(size / 2, cupWallHeight / 2, halfWall)
    .setTranslation(0, cupWallHeight / 2, size / 2)
    .setRestitution(0.4)
    .setFriction(0.5)
  world.value.createCollider(frontWallDesc)

  // Back wall
  const backWallDesc = rapier.value.ColliderDesc.cuboid(size / 2, cupWallHeight / 2, halfWall)
    .setTranslation(0, cupWallHeight / 2, -size / 2)
    .setRestitution(0.4)
    .setFriction(0.5)
  world.value.createCollider(backWallDesc)

  // Left wall
  const leftWallDesc = rapier.value.ColliderDesc.cuboid(halfWall, cupWallHeight / 2, size / 2)
    .setTranslation(-size / 2, cupWallHeight / 2, 0)
    .setRestitution(0.4)
    .setFriction(0.5)
  world.value.createCollider(leftWallDesc)

  // Right wall
  const rightWallDesc = rapier.value.ColliderDesc.cuboid(halfWall, cupWallHeight / 2, size / 2)
    .setTranslation(size / 2, cupWallHeight / 2, 0)
    .setRestitution(0.4)
    .setFriction(0.5)
  world.value.createCollider(rightWallDesc)

  console.log('✓ Created cup wall colliders')
}

// Create colliders when physics is ready
watch(isInitialized, (ready) => {
  if (ready) {
    createWallColliders()
  }
})

// Also create on mount if already initialized
onMounted(() => {
  if (isInitialized.value) {
    createWallColliders()
  }
})
</script>

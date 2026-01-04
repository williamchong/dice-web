import { ref, computed, onMounted, onUnmounted } from 'vue'

/**
 * Centralized responsive 3D viewport calculations
 * Manages aspect ratio tracking and provides responsive values for:
 * - Cup size
 * - Camera position and FOV
 * - Dice scale and spacing
 */
export function useResponsive3D() {
  const aspectRatio = ref(1)

  const updateViewport = () => {
    if (typeof window !== 'undefined') {
      aspectRatio.value = window.innerWidth / window.innerHeight
    }
  }

  onMounted(() => {
    updateViewport()
    window.addEventListener('resize', updateViewport)
    window.addEventListener('orientationchange', updateViewport)
  })

  onUnmounted(() => {
    window.removeEventListener('resize', updateViewport)
    window.removeEventListener('orientationchange', updateViewport)
  })

  // Cup size scales with aspect ratio
  const cupSize = computed(() => {
    const ratio = aspectRatio.value
    if (ratio < 0.8) {
      // Portrait phones: 4.5-6.4
      return 4.0 + (ratio * 3.0)
    }
    if (ratio < 1.5) {
      // Landscape/tablet: 7.0-7.5
      return 6.5 + (ratio * 0.5)
    }
    // Desktop: 8.5
    return 8.5
  })

  // Camera position scales with cup size
  const cameraPosition = computed((): [number, number, number] => {
    const ratio = aspectRatio.value
    if (ratio < 0.8) {
      // Portrait: 9.9-11.4
      return [0, 8.5 + (ratio * 3.0), 0]
    }
    if (ratio < 1.5) {
      // Landscape/tablet: 11.0-11.25
      return [0, 10.5 + (ratio * 0.5), 0]
    }
    // Desktop: 13
    return [0, 13, 0]
  })

  // FOV: narrower screens need wider FOV
  const cameraFov = computed(() => {
    const ratio = aspectRatio.value
    if (ratio < 0.8) {
      // Portrait: 68-80° (inverse relationship)
      return 80 - (ratio * 15)
    }
    if (ratio < 1.5) {
      // Landscape/tablet: 52.5-60°
      return 60 - (ratio * 5)
    }
    // Desktop: 50°
    return 50
  })

  // Dice spacing scales with cup size
  const diceSpacing = computed(() => {
    const ratio = aspectRatio.value
    if (ratio < 0.8) {
      // Portrait: 1.56-1.8
      return 1.2 + (ratio * 0.8)
    }
    if (ratio < 1.5) {
      // Landscape/tablet: 1.92-2.2
      return 1.6 + (ratio * 0.4)
    }
    // Desktop: 2.0
    return 2.0
  })

  // Dice scale (for geometry)
  const diceScale = computed(() => {
    const ratio = aspectRatio.value
    if (ratio < 0.8) {
      // Portrait: 0.74-0.84
      return 0.6 + (ratio * 0.3)
    }
    if (ratio < 1.5) {
      // Landscape/tablet: 0.86-0.975
      return 0.75 + (ratio * 0.15)
    }
    // Desktop: 1.0
    return 1.0
  })

  return {
    aspectRatio,
    cupSize,
    cameraPosition,
    cameraFov,
    diceSpacing,
    diceScale
  }
}

import { ref, type Ref } from 'vue'
import type RAPIER from '@dimforge/rapier3d-compat'

// Singleton state - shared across all instances
const world: Ref<RAPIER.World | null> = ref(null)
const rapier: Ref<typeof RAPIER | null> = ref(null)
const isInitialized = ref(false)
const isInitializing = ref(false)

/**
 * Rapier physics world singleton
 * Manages the physics simulation world and provides methods to interact with it
 */
export function useRapierWorld() {

  /**
   * Initialize Rapier physics engine
   * Must be called before using any physics features
   */
  async function init() {
    if (isInitialized.value || isInitializing.value) {
      return { world: world.value, rapier: rapier.value }
    }

    isInitializing.value = true

    try {
      // Import and initialize RAPIER WASM module
      const RAPIER = await import('@dimforge/rapier3d-compat')
      await RAPIER.init()

      rapier.value = RAPIER

      // Create physics world with gravity
      world.value = new RAPIER.World({ x: 0, y: -9.81, z: 0 })

      // Add ground plane (invisible, for dice to rest on)
      const groundColliderDesc = RAPIER.ColliderDesc.cuboid(100, 0.1, 100)
        .setTranslation(0, -0.1, 0)
        .setRestitution(0.3)  // Slight bounciness
        .setFriction(0.5)     // Moderate friction

      world.value.createCollider(groundColliderDesc)

      isInitialized.value = true
      console.log('✓ Rapier physics world initialized')

      return { world: world.value, rapier: rapier.value }
    } catch (error) {
      console.error('Failed to initialize Rapier physics:', error)
      isInitializing.value = false
      throw error
    } finally {
      isInitializing.value = false
    }
  }

  /**
   * Step the physics simulation forward by one timestep
   * @param deltaTime - Time step in seconds (typically 1/60)
   */
  function step(deltaTime = 1 / 60) {
    if (!world.value) {
      console.warn('Physics world not initialized')
      return
    }
    world.value.step()
  }

  /**
   * Add a collider to the world
   * @param desc - Collider description
   * @returns The created collider
   */
  function addCollider(desc: RAPIER.ColliderDesc) {
    if (!world.value) {
      throw new Error('Physics world not initialized')
    }
    return world.value.createCollider(desc)
  }

  /**
   * Add a rigid body to the world
   * @param desc - Rigid body description
   * @returns The created rigid body
   */
  function addRigidBody(desc: RAPIER.RigidBodyDesc) {
    if (!world.value) {
      throw new Error('Physics world not initialized')
    }
    return world.value.createRigidBody(desc)
  }

  /**
   * Clean up physics world
   */
  function cleanup() {
    if (world.value) {
      world.value.free()
      world.value = null
    }
    rapier.value = null
    isInitialized.value = false
  }

  return {
    world,
    rapier,
    isInitialized,
    init,
    step,
    addCollider,
    addRigidBody,
    cleanup
  }
}

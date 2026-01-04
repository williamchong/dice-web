import { ref, type Ref } from 'vue'
import * as THREE from 'three'
import type RAPIER from '@dimforge/rapier3d-compat'
import type { DiceType } from '~/types/dice'

interface DicePhysicsOptions {
  mass?: number
  restitution?: number
  friction?: number
}

/**
 * Create and manage physics for a single die
 * Syncs Three.js mesh with Rapier rigid body
 */
export function useDicePhysics(
  mesh: Ref<THREE.Mesh | null>,
  diceType: DiceType,
  options: DicePhysicsOptions = {}
) {
  const { world, rapier, isInitialized } = useRapierWorld()

  const rigidBody: Ref<RAPIER.RigidBody | null> = ref(null)
  const collider: Ref<RAPIER.Collider | null> = ref(null)

  // Default physics properties
  const mass = options.mass ?? getDiceMass(diceType)
  const restitution = options.restitution ?? 0.3  // Slight bounciness
  const friction = options.friction ?? 0.5         // Moderate friction

  /**
   * Initialize physics body for the die
   */
  async function createPhysicsBody(position: [number, number, number]) {
    if (!isInitialized.value) {
      console.warn('Physics world not initialized, skipping physics body creation')
      return
    }

    if (!rapier.value || !world.value) {
      console.error('Rapier or world not available')
      return
    }

    // Create rigid body (dynamic = affected by forces)
    const rigidBodyDesc = rapier.value.RigidBodyDesc.dynamic()
      .setTranslation(...position)

    rigidBody.value = world.value.createRigidBody(rigidBodyDesc)

    // Create collider matching dice geometry
    const colliderDesc = createColliderForDice(diceType, rapier.value)
      .setMass(mass)
      .setRestitution(restitution)
      .setFriction(friction)

    collider.value = world.value.createCollider(colliderDesc, rigidBody.value)

    console.log(`✓ Created physics body for ${diceType}`)
  }

  /**
   * Sync Three.js mesh position/rotation from Rapier rigid body
   * Call this every frame in the render loop
   */
  function syncMeshFromPhysics() {
    if (!rigidBody.value || !mesh.value) return

    // Get position and rotation from physics
    const position = rigidBody.value.translation()
    const rotation = rigidBody.value.rotation()

    // Update Three.js mesh
    mesh.value.position.set(position.x, position.y, position.z)
    mesh.value.quaternion.set(rotation.x, rotation.y, rotation.z, rotation.w)
  }

  /**
   * Apply force to the rigid body
   * @param force - Force vector in world space
   */
  function applyForce(force: { x: number; y: number; z: number }) {
    if (!rigidBody.value) return
    rigidBody.value.addForce({ x: force.x, y: force.y, z: force.z }, true)
  }

  /**
   * Apply impulse to the rigid body (instant force)
   * @param impulse - Impulse vector in world space
   */
  function applyImpulse(impulse: { x: number; y: number; z: number }) {
    if (!rigidBody.value) return
    rigidBody.value.applyImpulse({ x: impulse.x, y: impulse.y, z: impulse.z }, true)
  }

  /**
   * Reset dice to a new position
   */
  function resetPosition(position: [number, number, number]) {
    if (!rigidBody.value) return
    rigidBody.value.setTranslation({ x: position[0], y: position[1], z: position[2] }, true)
    rigidBody.value.setLinvel({ x: 0, y: 0, z: 0 }, true)
    rigidBody.value.setAngvel({ x: 0, y: 0, z: 0 }, true)
  }

  /**
   * Set angular velocity (for spinning)
   */
  function setAngularVelocity(angvel: { x: number; y: number; z: number }) {
    if (!rigidBody.value) return
    rigidBody.value.setAngvel(angvel, true)
  }

  /**
   * Get current velocity
   */
  function getVelocity() {
    if (!rigidBody.value) return { x: 0, y: 0, z: 0 }
    return rigidBody.value.linvel()
  }

  /**
   * Check if dice is moving (for settling detection)
   */
  function isMoving(threshold = 0.01) {
    const vel = getVelocity()
    const speed = Math.sqrt(vel.x ** 2 + vel.y ** 2 + vel.z ** 2)
    return speed > threshold
  }

  /**
   * Cleanup physics resources
   */
  function cleanup() {
    if (world.value && rigidBody.value) {
      world.value.removeRigidBody(rigidBody.value)
    }
    rigidBody.value = null
    collider.value = null
  }

  return {
    rigidBody,
    collider,
    createPhysicsBody,
    syncMeshFromPhysics,
    applyForce,
    applyImpulse,
    resetPosition,
    setAngularVelocity,
    getVelocity,
    isMoving,
    cleanup
  }
}

/**
 * Create Rapier collider description for dice type
 */
function createColliderForDice(type: DiceType, RAPIER: typeof import('@dimforge/rapier3d-compat')): RAPIER.ColliderDesc {
  switch (type) {
    case 'd4':
      // Tetrahedron approximation (use sphere for simplicity)
      return RAPIER.ColliderDesc.ball(0.8)

    case 'd6':
      // Cube
      return RAPIER.ColliderDesc.cuboid(0.5, 0.5, 0.5)

    case 'd8':
      // Octahedron approximation (use sphere)
      return RAPIER.ColliderDesc.ball(0.9)

    case 'd10':
    case 'd100':
      // Cylinder
      return RAPIER.ColliderDesc.cylinder(0.6, 0.7)

    case 'd12':
      // Dodecahedron approximation (use sphere)
      return RAPIER.ColliderDesc.ball(0.85)

    case 'd20':
      // Icosahedron approximation (use sphere)
      return RAPIER.ColliderDesc.ball(0.95)

    default:
      return RAPIER.ColliderDesc.cuboid(0.5, 0.5, 0.5)
  }
}

/**
 * Get default mass for dice type
 */
function getDiceMass(type: DiceType): number {
  // Mass in arbitrary units (affects how forces move the dice)
  const masses: Record<DiceType, number> = {
    d4: 0.3,
    d6: 0.5,
    d8: 0.4,
    d10: 0.4,
    d12: 0.45,
    d20: 0.5,
    d100: 0.4
  }
  return masses[type] || 0.5
}

import type RAPIER from '@dimforge/rapier3d-compat'

/**
 * Physics world instance and controls
 */
export interface PhysicsWorld {
  world: RAPIER.World
  step: (dt: number) => void
  cleanup: () => void
}

/**
 * 3D force vector
 */
export interface ForceVector {
  x: number
  y: number
  z: number
}

/**
 * Physics material properties
 */
export interface PhysicsMaterial {
  restitution: number  // Bounciness (0-1)
  friction: number     // Surface friction (0-1)
  mass: number         // Mass in kg
}

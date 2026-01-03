import type * as THREE from 'three'
import type RAPIER from '@dimforge/rapier3d-compat'

/**
 * Supported dice types
 */
export type DiceType = 'd4' | 'd6' | 'd8' | 'd10' | 'd12' | 'd20' | 'd100'

/**
 * Instance of a die in the scene
 */
export interface DiceInstance {
  id: string
  type: DiceType
  mesh: THREE.Mesh
  rigidBody: RAPIER.RigidBody
  value?: number
}

/**
 * Configuration for dice geometry
 */
export interface DiceGeometryConfig {
  type: DiceType
  radius: number
  mass: number
  faces: number
  vertices: number
}

/**
 * Result of a single die roll
 */
export interface DieRollResult {
  type: DiceType
  value: number
}

/**
 * Configuration for active dice in the scene
 */
export interface DiceConfiguration {
  d4: number
  d6: number
  d8: number
  d10: number
  d12: number
  d20: number
  d100: number
}

import type * as THREE from 'three'

/**
 * Skin definition for dice
 * Future implementation will allow custom materials and textures
 */
export interface DiceSkin {
  id: string
  name: string
  material: THREE.Material
  textureUrl?: string
}

/**
 * Skin definition for dice cup
 * Future implementation will allow custom materials
 */
export interface CupSkin {
  id: string
  name: string
  material: THREE.Material
  textureUrl?: string
}

/**
 * Skin definition for environment/background
 * Future implementation will allow custom scenes
 */
export interface EnvironmentSkin {
  id: string
  name: string
  backgroundColor: string
  textureUrl?: string
}

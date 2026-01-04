import * as THREE from 'three'
import type { DiceType } from '~/types/dice'

interface DiceGeometry {
  geometry: THREE.BufferGeometry
  material: THREE.Material
}

/**
 * Create geometry and material for a specific dice type
 * @param type - The type of dice to create
 * @param scale - Optional scale multiplier (default 1.0)
 */
export function createDiceGeometry(type: DiceType, scale = 1.0): DiceGeometry {
  let geometry: THREE.BufferGeometry

  switch (type) {
    case 'd4':
      // Tetrahedron (4 faces)
      geometry = new THREE.TetrahedronGeometry(0.8 * scale)
      break

    case 'd6':
      // Cube (6 faces) with slight rounding
      geometry = new THREE.BoxGeometry(1 * scale, 1 * scale, 1 * scale, 2, 2, 2)
      break

    case 'd8':
      // Octahedron (8 faces)
      geometry = new THREE.OctahedronGeometry(0.9 * scale)
      break

    case 'd10':
      // For now, use a 10-sided cylinder approximation
      // TODO: Create proper pentagonal trapezohedron geometry
      geometry = new THREE.CylinderGeometry(0.7 * scale, 0.7 * scale, 1.2 * scale, 10)
      break

    case 'd12':
      // Dodecahedron (12 faces)
      geometry = new THREE.DodecahedronGeometry(0.85 * scale)
      break

    case 'd20':
      // Icosahedron (20 faces)
      geometry = new THREE.IcosahedronGeometry(0.95 * scale)
      break

    case 'd100':
      // d100 is typically 2x d10 (tens place + ones place)
      // Use same geometry as d10 but will be visually distinguished by color
      geometry = new THREE.CylinderGeometry(0.7 * scale, 0.7 * scale, 1.2 * scale, 10)
      break

    default:
      // Fallback to d6
      geometry = new THREE.BoxGeometry(1 * scale, 1 * scale, 1 * scale)
  }

  // Create material with default skin
  // TODO: Replace with skin system in Phase 10
  const material = new THREE.MeshStandardMaterial({
    color: getDiceColor(type),
    roughness: 0.4,
    metalness: 0.1,
    flatShading: false
  })

  return { geometry, material }
}

/**
 * Get default color for dice type
 * Future: This will be replaced by skin system
 */
function getDiceColor(type: DiceType): number {
  const colors: Record<DiceType, number> = {
    d4: 0x4a9eff,   // Blue
    d6: 0xff4a4a,   // Red
    d8: 0x4aff4a,   // Green
    d10: 0xffaa4a,  // Orange
    d12: 0xff4aff,  // Magenta
    d20: 0xffff4a,  // Yellow
    d100: 0x4affff  // Cyan
  }
  return colors[type] || 0xffffff
}

/**
 * Get the number of faces for a dice type
 */
export function getDiceFaceCount(type: DiceType): number {
  const faces: Record<DiceType, number> = {
    d4: 4,
    d6: 6,
    d8: 8,
    d10: 10,
    d12: 12,
    d20: 20,
    d100: 100
  }
  return faces[type]
}

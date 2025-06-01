import type { Asset, AssetType } from '../utils/asset.js'
import type { Vector } from '../utils/vector.js'
import type { Animator } from './animator.js'
import type { Box } from './box.js'
import type { Collider } from './collider.js'
import type { Node } from './node.js'
import type { Sprite } from './sprite.js'

// Options
export interface NodeOptions {
  position?: Vector
  children?: Node[]
}
export interface SpriteOptions extends NodeOptions {
  sprite: Asset<AssetType.Image>
  rows?: number
  columns?: number
  frame?: Vector
}
export interface AnimatorOptions extends NodeOptions {}
export interface BoxOptions extends NodeOptions {
  width: number
  height: number
  color?: string
}
export interface ColliderOptions extends NodeOptions {
  /**
   * The size of the collider.
   * @default Vector.ONE
   */
  size?: Vector
  /**
   * The collision layers.
   * @default []
   */
  layer?: string[]
  /**
   * Check collisions every frame.
   * @default true
   */
  autoCheck?: boolean
}
export interface RayCastOptions extends NodeOptions {
  /**
   * The direction of the ray.
   * 1 = right, -1 = left
   * @default 1
   */
  direction?: 1 | -1
  /**
   * The length of the ray.
   * @default 10
   */
  length?: number
  /**
   * The collision layers.
   * @default []
   */
  layer?: string[]
  /**
   * Check collisions every frame.
   * @default true
   */
  autoCheck?: boolean
}

// Events
export interface NodeEvents {
  update: (dt: number) => void
  draw: (dt: number) => void
  destroy: () => void
}
export interface SpriteEvents extends NodeEvents {}
export interface ColliderEvents extends NodeEvents {
  collision: (collider: Collider) => void
}
export interface RayCastEvents extends NodeEvents {
  collision: (collider: Collider) => void
}

// Nodes
export interface Nodes {
  node: Node
  sprite: Sprite
  animator: Animator
  box: Box
  collider: Collider
}

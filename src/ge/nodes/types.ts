import { Animation } from '../utils/animation.js'
import type { Asset, AssetType } from '../utils/asset.js'
import type { Vector } from '../utils/vector.js'
import type { Animator } from './animator.js'
import type { Box } from './box.js'
import { Clickable } from './clickable.js'
import type { Collider } from './collider.js'
import { MouseChecker } from './mouse-checker.js'
import type { Node } from './node.js'
import { RayCast } from './raycast.js'
import type { Sprite } from './sprite.js'
import { Text } from './text.js'
import { Timer } from './timer.js'

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
  scale?: number
}
export interface AnimatorOptions extends NodeOptions {}
export interface TemporalAnimationOptions extends NodeOptions {
  animation: Animation
}
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
export interface TimerOptions extends NodeOptions {
  /** In seconds */
  duration: number
  /** @default false */
  loop?: boolean
}
export interface MouseCheckerOptions extends NodeOptions {}
export interface ClickableOptions extends NodeOptions {
  disabled?: boolean
  size: Vector
  /** It's the texture of the normal state */
  normalSprite: Sprite
  /** It's the texture of the hover state */
  hoverSprite?: Sprite
  /** It's the texture of the pressed state */
  pressedSprite?: Sprite
  /** It's the texture of the disabled state */
  disabledSprite?: Sprite
}
export interface TextOptions extends NodeOptions {
  text: string
  textAlign?: 'left' | 'center' | 'right'
}

// Events
export interface NodeEvents {
  start: () => void
  update: (dt: number) => void
  draw: (dt: number) => void
  destroy: () => void
  resumeProcessing: () => void
  pauseProcessing: () => void
}
export interface SpriteEvents extends NodeEvents {}
export interface ColliderEvents extends NodeEvents {
  collision: (collider: Collider) => void
  exit: (collider: Collider) => void
}
export interface RayCastEvents extends NodeEvents {
  collision: (collider: Collider) => void
  exit: (collider: Collider) => void
}
export interface TimerEvents extends NodeEvents {
  finished: () => void
}
export interface MouseCheckerEvents extends NodeEvents {
  move: (position: Vector) => void
  press: (position: Vector) => void
  release: (position: Vector) => void
}
export interface ClickableEvents extends MouseCheckerEvents {
  click: () => void
  clickOutside: () => void
}

// Nodes
export interface Nodes {
  node: Node
  sprite: Sprite
  collider: Collider
  rayCast: RayCast
  animator: Animator
  box: Box
  timer: Timer
  mouseChecker: MouseChecker
  clickable: Clickable
  text: Text
}

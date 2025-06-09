import Game from '../game.js'
import { EvListener } from '../utils/event-listener.js'
import { Vector } from '../utils/vector.js'
import { Node } from './node.js'
import { ColliderEvents, ColliderOptions } from './types.js'

export class Collider extends Node {
  size: Vector
  layer: string[]
  autoCheck: boolean

  constructor(options: ColliderOptions) {
    super(options)
    this.size = options.size ?? Vector.ONE
    this.layer = options.layer ?? []
    this.autoCheck = options.autoCheck ?? true
  }

  ev = new EvListener<ColliderEvents>()

  disabled: boolean = false

  checkCollisionTo(collider: Collider): boolean {
    return collisionDetector(
      this.globalPosition,
      this.globalPosition.add(this.size),
      collider.globalPosition,
      collider.globalPosition.add(collider.size)
    )
  }

  lastDetectedColliders: Collider[] = []

  checkCollision(): Collider[] {
    if (this.disabled) return []

    const colliders: Collider[] = []

    const layer = Array.from(Game.game.layers.entries())
      .filter(([key]) => this.layer.includes(key))
      .map(([, nodes]) =>
        nodes.map((node) => [
          ...(node instanceof Collider ? [node] : []),
          ...node.findChildrenByType(Collider),
        ])
      )
      .flat(2)
      .filter((collider) => !collider.disabled)

    for (const collider of layer) {
      if (this.checkCollisionTo(collider)) {
        colliders.push(collider)
      }
    }

    return colliders
  }

  update(dt: number): void {
    if (this.autoCheck) {
      const colliders = this.checkCollision()

      colliders.forEach((collider) => {
        if (!this.lastDetectedColliders.includes(collider)) {
          this.ev._emit_('collision', collider)
        }
      })
      this.lastDetectedColliders.forEach((collider) => {
        if (!colliders.includes(collider)) {
          this.ev._emit_('exit', collider)
        }
      })

      this.lastDetectedColliders = colliders
    }
    super.update(dt)
  }
  draw(dt: number): void {
    if (Game.game.debug) {
      Game.game.ctx.fillStyle = '#456ab588'
      Game.game.ctx.fillRect(
        this.globalPosition.x,
        this.globalPosition.y,
        this.size.x,
        this.size.y
      )
      Game.game.ctx.strokeStyle = '#344f85'
      Game.game.ctx.lineWidth = 0.5
      Game.game.ctx.strokeRect(
        this.globalPosition.x,
        this.globalPosition.y,
        this.size.x,
        this.size.y
      )
    }
    super.draw(dt)
  }
  destroy(): void {
    super.destroy()
  }
}

function collisionDetector(
  from1: Vector,
  to1: Vector,
  from2: Vector,
  to2: Vector
) {
  return (
    from1.x < to2.x &&
    to1.x > from2.x &&
    from1.y < to2.y &&
    to1.y > from2.y /* ||
    (from2.x < to1.x && to2.x > from1.x && from2.y < to1.y && to2.y > from1.y)*/
  )
}

export function checkCollisionInLayer(
  layer: string,
  from: Vector,
  size: Vector
) {
  const colliders: Collider[] = []

  const collidersInLayer = Array.from(Game.game.layers.entries())
    .filter(([key]) => layer.includes(key))
    .map(([, nodes]) =>
      nodes.map((node) => [
        ...(node instanceof Collider ? [node] : []),
        ...node.findChildrenByType(Collider),
      ])
    )
    .flat(2)
    .filter((collider) => !collider.disabled)

  for (const collider of collidersInLayer) {
    if (
      collisionDetector(
        from,
        from.add(size),
        collider.globalPosition,
        collider.globalPosition.add(collider.size)
      )
    ) {
      colliders.push(collider)
    }
  }

  return colliders
}

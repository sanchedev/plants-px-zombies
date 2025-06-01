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

  #detection(from1: Vector, to1: Vector, from2: Vector, to2: Vector) {
    return (
      from1.x < to2.x && to1.x > from2.x && from1.y < to2.y && to1.y > from2.y
    )
  }

  checkCollisionTo(collider: Collider): boolean {
    return this.#detection(
      this.globalPosition,
      this.globalPosition.add(this.size),
      collider.globalPosition,
      collider.globalPosition.add(collider.size)
    )
  }

  checkCollision(): Collider[] {
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

    for (const collider of layer) {
      if (this.checkCollisionTo(collider)) {
        colliders.push(collider)
      }
    }

    return colliders
  }

  update(dt: number): void {
    if (this.autoCheck) {
      this.checkCollision().forEach((collider) => {
        this.ev._emit_('collision', collider)
      })
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

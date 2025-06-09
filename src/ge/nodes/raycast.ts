import Game from '../game.js'
import { EvListener } from '../utils/event-listener.js'
import { Collider } from './collider.js'
import { Node } from './node.js'
import { RayCastEvents, RayCastOptions } from './types.js'

export class RayCast extends Node {
  direction: 1 | -1
  length: number
  layer: string[]
  autoCheck: boolean

  disabled: boolean = false

  constructor(options: RayCastOptions) {
    super(options)
    this.direction = options.direction ?? 1
    this.length = options.length ?? 10
    this.layer = options.layer ?? []
    this.autoCheck = options.autoCheck ?? true
  }

  ev = new EvListener<RayCastEvents>()

  target: Collider | null = null
  checkRay() {
    if (this.disabled) return

    const rayStartX = this.globalPosition.x
    const rayEndX = this.globalPosition.x + this.length * this.direction
    const rayY = this.globalPosition.y

    const layer = Array.from(Game.game.layers.entries())
      .filter(([key]) => this.layer.includes(key))
      .map(([, nodes]) =>
        nodes.map((node) => [
          ...(node instanceof Collider ? [node] : []),
          ...node.findChildrenByType(Collider),
        ])
      )
      .flat(2)

    let nearest: Collider | null = null

    for (const collider of layer) {
      if (collider.disabled) continue

      if (
        collider.globalPosition.y > rayY ||
        collider.globalPosition.y + collider.size.y < rayY
      ) {
        continue
      }

      const intersectsX =
        this.direction === 1
          ? rayStartX < collider.globalPosition.x + collider.size.x &&
            rayEndX >= collider.globalPosition.x
          : rayStartX > collider.globalPosition.x &&
            rayEndX <= collider.globalPosition.x + collider.size.x

      if (intersectsX) {
        if (nearest == null) nearest = collider
        else if (
          collider.globalPosition.x * this.direction <
          nearest.globalPosition.x * this.direction
        ) {
          nearest = collider
        }
      }
    }

    if (this.target !== nearest) {
      if (this.target != null) this.ev._emit_('exit', this.target)
      if (nearest != null) this.ev._emit_('collision', nearest)
    }

    this.target = nearest

    return nearest
  }

  update(dt: number): void {
    if (this.autoCheck) {
      this.checkRay()
    }
    super.update(dt)
  }
  draw(dt: number): void {
    if (Game.game.debug) {
      Game.game.ctx.strokeStyle = '#ed2d2d88'
      Game.game.ctx.lineWidth = 1
      Game.game.ctx.beginPath()
      Game.game.ctx.moveTo(this.globalPosition.x, this.globalPosition.y)
      Game.game.ctx.lineTo(
        this.globalPosition.x + (this.length - 2) * this.direction,
        this.globalPosition.y
      )
      Game.game.ctx.stroke()
      Game.game.ctx.closePath()

      // drawing a triangle to the direction of the ray
      Game.game.ctx.beginPath()
      Game.game.ctx.moveTo(
        this.globalPosition.x + (this.length - 2) * this.direction,
        this.globalPosition.y - 1.5
      )
      Game.game.ctx.lineTo(
        this.globalPosition.x + (this.length - 2) * this.direction,
        this.globalPosition.y + 1.5
      )
      Game.game.ctx.lineTo(
        this.globalPosition.x + this.length * this.direction,
        this.globalPosition.y
      )
      Game.game.ctx.fillStyle = '#ed2d2d88'
      Game.game.ctx.fill()
      Game.game.ctx.closePath()
    }
    super.draw(dt)
  }
}

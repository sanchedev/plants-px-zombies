import Game from './game.js'
import { Vector } from './utils/vector.js'

export class Camera {
  #position: Vector = Vector.ZERO

  get position(): Vector {
    return this.#position
  }
  set position(value: Vector) {
    this.#position = value
    Game.game.ctx.translate(value.x, value.y)
  }
}

import Game from '../game.js'
import { EvListener } from '../utils/event-listener.js'
import { Vector } from '../utils/vector.js'
import { Node } from './node.js'
import { MouseCheckerEvents, MouseCheckerOptions } from './types.js'

export class MouseChecker extends Node {
  constructor(options: MouseCheckerOptions) {
    super(options)
  }

  start(): void {
    Game.game.canvas.addEventListener('mousemove', this.onMouseMove)
    Game.game.canvas.addEventListener('mousedown', this.onMouseDown)
    Game.game.canvas.addEventListener('mouseup', this.onMouseUp)

    super.start()
  }

  ev = new EvListener<MouseCheckerEvents>()

  #calculatePosition(ev: MouseEvent) {
    const rect = Game.game.ctx.canvas.getBoundingClientRect()

    const x = Math.floor(
      (Game.game.ctx.canvas.width * (ev.pageX - rect.x)) /
        (rect.width * Game.game.scale)
    )
    const y = Math.floor(
      (Game.game.ctx.canvas.height * (ev.pageY - rect.y)) /
        (rect.height * Game.game.scale)
    )

    return new Vector(x, y)
  }

  onMouseMove = (ev: MouseEvent) => {
    this.ev._emit_('move', this.#calculatePosition(ev))
  }

  onMouseDown = (ev: MouseEvent) => {
    this.ev._emit_('press', this.#calculatePosition(ev))
  }

  onMouseUp = (ev: MouseEvent) => {
    this.ev._emit_('release', this.#calculatePosition(ev))
  }

  destroy(): void {
    Game.game.canvas.removeEventListener('mousemove', this.onMouseMove)
    Game.game.canvas.removeEventListener('mousedown', this.onMouseDown)
    Game.game.canvas.removeEventListener('mouseup', this.onMouseUp)

    super.destroy()
  }
}

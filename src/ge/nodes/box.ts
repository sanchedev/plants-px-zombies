import Game from '../game.js'
import { Node } from './node.js'
import { BoxOptions } from './types.js'

export class Box extends Node {
  width: number
  height: number
  color: string

  constructor(options: BoxOptions) {
    super(options)
    this.width = options.width
    this.height = options.height
    this.color = options.color ?? '#fff'
  }

  draw(dt: number): void {
    Game.game.ctx.fillStyle = this.color
    Game.game.ctx.fillRect(
      this.globalPosition.x,
      this.globalPosition.y,
      this.width,
      this.height
    )
    super.draw(dt)
  }
}

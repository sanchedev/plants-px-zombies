import { Asset, AssetType } from '../utils/asset.js'
import { SpriteEvents, SpriteOptions } from './types.js'
import { EvListener } from '../utils/event-listener.js'
import { Node } from './node.js'
import Game from '../game.js'
import { Vector } from '../utils/vector.js'

export class Sprite extends Node {
  sprite: Asset<AssetType.Image>
  rows: number
  columns: number
  frame: Vector
  scale: number

  constructor(options: SpriteOptions) {
    super(options)
    this.sprite = options.sprite
    this.rows = options.rows ?? 1
    this.columns = options.columns ?? 1
    this.frame = options.frame ?? Vector.ZERO
    this.scale = options.scale ?? 1
  }

  ev = new EvListener<SpriteEvents>()

  update(dt: number): void {
    super.update(dt)
  }
  draw(dt: number): void {
    // show the sprite
    const frameWidth = this.sprite.element.width / this.columns
    const frameHeight = this.sprite.element.height / this.rows
    Game.game.ctx.drawImage(
      this.sprite.element,
      frameWidth * this.frame.x,
      frameHeight * this.frame.y,
      frameWidth,
      frameHeight,
      this.globalPosition.x,
      this.globalPosition.y,
      frameWidth * this.scale,
      frameHeight * this.scale
    )

    super.draw(dt)
  }
  destroy(): void {
    super.destroy()
  }
}

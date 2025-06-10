import Game from '../../../ge/game.js'
import { Sprite } from '../../../ge/nodes/sprite.js'
import { SpriteOptions } from '../../../ge/nodes/types.js'

interface SeedSpriteOptions extends SpriteOptions {
  getRechargePercentage: () => number
  getCanBuy: () => boolean
}

export class SeedSprite extends Sprite {
  getRechargePercentage: () => number
  getCanBuy: () => boolean

  constructor(options: SeedSpriteOptions) {
    super(options)
    this.getRechargePercentage = options.getRechargePercentage
    this.getCanBuy = options.getCanBuy
  }

  draw(dt: number): void {
    // show the sprite
    const frameWidth = this.sprite.element.width / this.columns
    const frameHeight = this.sprite.element.height / this.rows

    const isNotRecharged = this.getRechargePercentage() < 1
    const cantBuy = !this.getCanBuy()

    const grayscale = (isNotRecharged ? 40 : 0) + (cantBuy ? 40 : 0)

    const notRechargeBrightness = 0.6
    const cantBuyBrightness = 0.4
    const notAnyBrightness = 0.2

    const brightness =
      isNotRecharged && cantBuy
        ? notAnyBrightness
        : isNotRecharged
        ? notRechargeBrightness
        : cantBuy
        ? cantBuyBrightness
        : 1

    Game.game.ctx.filter = `grayscale(${grayscale}%) brightness(${brightness})`

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

    if (isNotRecharged) {
      Game.game.ctx.filter = `grayscale(${grayscale - 40}%)  brightness(${
        cantBuy ? cantBuyBrightness : 0.8
      })`

      const percentage = this.getRechargePercentage()
      const marginY = (1 - percentage) * frameHeight
      const height = percentage * frameHeight

      Game.game.ctx.drawImage(
        this.sprite.element,
        frameWidth * this.frame.x,
        Math.max(0, frameHeight - 1) * this.frame.y + marginY,
        frameWidth,
        height,
        this.globalPosition.x,
        this.globalPosition.y + marginY,
        frameWidth * this.scale,
        height * this.scale
      )
    }

    Game.game.ctx.filter = 'none'

    this.superDraw(dt)
  }
}

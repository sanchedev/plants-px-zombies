import Game from '../game.js'
import { EvListener } from '../utils/event-listener.js'
import { Vector } from '../utils/vector.js'
import { Node } from './node.js'
import { Sprite } from './sprite.js'
import { ClickableEvents, ClickableOptions } from './types.js'

export class Clickable extends Node {
  disabled: boolean
  size: Vector

  normalSprite: Sprite
  hoverSprite?: Sprite
  pressedSprite?: Sprite
  disabledSprite?: Sprite

  constructor(options: ClickableOptions) {
    super(options)

    this.disabled = options.disabled ?? false
    this.size = options.size

    this.normalSprite = options.normalSprite
    this.hoverSprite = options.hoverSprite
    this.pressedSprite = options.pressedSprite
    this.disabledSprite = options.disabledSprite
  }

  ev: EvListener<ClickableEvents> = new EvListener()

  start() {
    this.addChild(this.normalSprite)
    if (this.hoverSprite) this.addChild(this.hoverSprite)
    if (this.pressedSprite) this.addChild(this.pressedSprite)
    if (this.disabledSprite) this.addChild(this.disabledSprite)

    Game.game.canvas.addEventListener('mousemove', this.onMove)
    Game.game.canvas.addEventListener('mousedown', this.onDown)
    Game.game.canvas.addEventListener('mouseup', this.onUp)

    super.start()
  }

  clickableState: 'normal' | 'hover' | 'pressed' | 'disabled' = 'normal'

  isHovering = false
  isPressing = false
  onMove = (ev: MouseEvent) => {
    if (this.disabled) return

    const rect = Game.game.ctx.canvas.getBoundingClientRect()

    const px = Math.floor(
      (Game.game.ctx.canvas.width * (ev.pageX - rect.x)) /
        (rect.width * Game.game.scale)
    )
    const py = Math.floor(
      (Game.game.ctx.canvas.height * (ev.pageY - rect.y)) /
        (rect.height * Game.game.scale)
    )

    const { x, y } = this.globalPosition
    const width = this.size.x
    const height = this.size.y

    const isHover = px >= x && py >= y && px <= x + width && py <= y + height
    this.isHovering = isHover
    if (isHover && this.isPressing) this.clickableState = 'pressed'
    else if (isHover) this.clickableState = 'hover'
    else this.clickableState = 'normal'
  }
  onDown = () => {
    if (this.disabled) return
    if (!this.isHovering) return
    this.isPressing = true
    this.clickableState = 'pressed'
  }
  onUp = () => {
    if (this.disabled) return
    if (!this.isHovering) return
    this.isPressing = false
    this.clickableState = 'hover'
    this.ev._emit_('click')
  }

  draw(dt: number): void {
    super.draw(dt)
    if (Game.game.debug) {
      Game.game.ctx.fillStyle = '#fcba0388'
      Game.game.ctx.fillRect(
        this.globalPosition.x,
        this.globalPosition.y,
        this.size.x,
        this.size.y
      )
      Game.game.ctx.strokeStyle = '#966f02'
      Game.game.ctx.lineWidth = 0.5
      Game.game.ctx.strokeRect(
        this.globalPosition.x,
        this.globalPosition.y,
        this.size.x,
        this.size.y
      )
    }
  }

  update(dt: number): void {
    if (this.disabled && this.clickableState !== 'disabled') {
      this.clickableState = 'disabled'
    }

    this.normalSprite.hidden = true
    if (this.hoverSprite) this.hoverSprite.hidden = true
    if (this.pressedSprite) this.pressedSprite.hidden = true
    if (this.disabledSprite) this.disabledSprite.hidden = true

    if (this.disabledSprite && this.clickableState === 'disabled') {
      this.disabledSprite.hidden = false
    } else if (this.hoverSprite && this.clickableState === 'hover') {
      this.hoverSprite.hidden = false
    } else if (this.pressedSprite && this.clickableState === 'pressed') {
      this.pressedSprite.hidden = false
    } else {
      this.normalSprite.hidden = false
    }

    super.update(dt)
  }

  destroy(): void {
    Game.game.canvas.removeEventListener('mousemove', this.onMove)
    Game.game.canvas.removeEventListener('mousedown', this.onDown)
    Game.game.canvas.removeEventListener('mouseup', this.onUp)

    super.destroy()
  }
}

import Game from '../game.js'
import { EvListener } from '../utils/event-listener.js'
import { Vector } from '../utils/vector.js'
import { MouseChecker } from './mouse-checker.js'
import { Sprite } from './sprite.js'
import { ClickableEvents, ClickableOptions } from './types.js'

export class Clickable extends MouseChecker {
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

    this.ev.on('move', this.onMove)
    this.ev.on('press', this.onDown)
    this.ev.on('release', this.onUp)

    super.start()
  }

  clickableState: 'normal' | 'hover' | 'pressed' | 'disabled' = 'normal'

  isHovering = false
  isPressing = false
  onMove = (position: Vector) => {
    if (this.disabled) return
    const px = position.x
    const py = position.y

    const { x, y } = this.globalPosition
    const width = this.size.x
    const height = this.size.y

    const isHover = px >= x && py >= y && px <= x + width && py <= y + height
    this.isHovering = isHover
    this.refreshTextureStates()
  }
  onDown = () => {
    if (this.disabled) return
    if (!this.isHovering) return
    this.isPressing = true
    this.refreshTextureStates()
  }
  onUp = () => {
    if (this.disabled) return

    this.isPressing = false
    if (!this.isHovering) {
      this.ev._emit_('clickOutside')
      return
    }
    this.refreshTextureStates()
    this.ev._emit_('click')
  }

  refreshTextureStates() {
    if (this.disabled) {
      this.clickableState = 'disabled'
      return
    }
    if (this.isHovering) {
      if (this.isPressing) this.clickableState = 'pressed'
      else this.clickableState = 'hover'
      return
    }
    this.clickableState = 'normal'
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
}

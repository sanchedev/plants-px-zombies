import Game from '../../../ge/game.js'
import { Box } from '../../../ge/nodes/box.js'
import { Clickable } from '../../../ge/nodes/clickable.js'
import { Node, NodeProcess } from '../../../ge/nodes/node.js'
import { Sprite } from '../../../ge/nodes/sprite.js'
import { AssetType, createAsset } from '../../../ge/utils/asset.js'
import { Vector } from '../../../ge/utils/vector.js'

const pauseMenuBg = createAsset(
  'pause-menu-bg',
  '/assets/sprites/ui/views/pause-menu-bg.png',
  AssetType.Image
)

const resumeBtnAsset = createAsset(
  'resume-btn',
  '/assets/sprites/ui/buttons/resume.png',
  AssetType.Image
)

export class PauseMenu extends Node {
  process = NodeProcess.PAUSED

  start() {
    const backdrop = new Box({
      width: Game.game.width,
      height: Game.game.height,
      color: '#0008',
    })

    this.addChild(backdrop)
    this.backdrop = backdrop

    const spriteBg = new Sprite({
      sprite: pauseMenuBg,
      position: new Vector(Game.game.width - 64, 0),
    })

    this.addChild(spriteBg)
    this.spriteBg = spriteBg

    const resumeBtnOptions = { sprite: resumeBtnAsset, columns: 3 }
    const resumeBtn = new Clickable({
      position: new Vector(8, 36),
      size: new Vector(48, 22),
      normalSprite: new Sprite({
        ...resumeBtnOptions,
        frame: new Vector(0, 0),
      }),
      hoverSprite: new Sprite({ ...resumeBtnOptions, frame: new Vector(1, 0) }),
      pressedSprite: new Sprite({
        ...resumeBtnOptions,
        frame: new Vector(2, 0),
      }),
    })
    resumeBtn.ev.on('click', () => {
      this.resume()
    })

    spriteBg.addChild(resumeBtn)

    this.hidden = true

    super.start()
  }

  backdrop!: Box
  spriteBg!: Sprite

  animDuration = 0.2

  async resume() {
    await this.fadeOut()
    Game.game.isPaused = false
  }

  async fadeOut() {
    this.backdrop.color = '#00000088'
    this.spriteBg.position.x = Game.game.width - 64

    const backdrop = new Promise<void>((resolve) => {
      let opacity = 88
      const fn = (dt: number) => {
        opacity -= (dt * 88) / this.animDuration
        if (opacity <= 0) {
          this.backdrop.color = '#00000000'
          this.backdrop.ev.off('update', fn)
          resolve()
        }
        this.backdrop.color = '#000000' + Math.floor(opacity)
      }

      this.backdrop.ev.on('update', fn)
    })

    const bg = new Promise<void>((resolve) => {
      const fn = (dt: number) => {
        this.spriteBg.position.x += (dt * 64) / this.animDuration
        if (this.spriteBg.position.x >= Game.game.width) {
          this.spriteBg.ev.off('update', fn)
          this.spriteBg.position.x = Game.game.width
          resolve()
        }
      }

      this.spriteBg.ev.on('update', fn)
    })

    await Promise.all([backdrop, bg])
  }

  async fadeIn() {
    this.backdrop.color = '#00000000'
    this.spriteBg.position.x = Game.game.width

    const backdrop = new Promise<void>((resolve) => {
      let opacity = 0
      const fn = (dt: number) => {
        opacity += (dt * 88) / this.animDuration
        if (opacity >= 88) {
          this.backdrop.ev.off('update', fn)
          this.backdrop.color = '#00000088'
          resolve()
          return
        }
        this.backdrop.color = '#000000' + Math.floor(opacity)
      }

      this.backdrop.ev.on('update', fn)
    })

    const bg = new Promise<void>((resolve) => {
      const fn = (dt: number) => {
        this.spriteBg.position.x -= (dt * 64) / this.animDuration
        if (this.spriteBg.position.x <= Game.game.width - 64) {
          this.spriteBg.ev.off('update', fn)
          this.spriteBg.position.x = Game.game.width - 64
          resolve()
          return
        }
      }

      this.spriteBg.ev.on('update', fn)
    })

    await Promise.all([backdrop, bg])
  }

  onResumeProcessing(): void {
    this.hidden = false
    this.fadeIn()
  }

  onPauseProcessing(): void {
    this.hidden = true
  }
}

import { TILE_SIZE } from '../../constants.js'
import { Clickable } from '../../ge/nodes/clickable.js'
import { MonoAudio } from '../../ge/nodes/mono-audio.js'
import { Node } from '../../ge/nodes/node.js'
import { Sprite } from '../../ge/nodes/sprite.js'
import { Timer } from '../../ge/nodes/timer.js'
import { NodeOptions } from '../../ge/nodes/types.js'
import { AssetManager, AssetType, createAsset } from '../../ge/utils/asset.js'
import { Vector } from '../../ge/utils/vector.js'
import { SunCounter } from './sun-counter.js'

createAsset('sun', '/assets/sprites/ui/sun.png', AssetType.Image)
createAsset('click-sun', '/assets/audios/points.ogg', AssetType.Audio)

const SUN_SPEED = 0.5

export interface SunOptions extends NodeOptions {
  /** Start in y and falling to */
  fallingHeight: number
}

export class Sun extends Node {
  fallingHeight: number

  constructor(options: SunOptions) {
    super(options)
    this.fallingHeight = options.fallingHeight
    this.finalPosition = this.position.add(new Vector(0, this.fallingHeight))
  }

  finalPosition: Vector

  start(): void {
    const clickable = new Clickable({
      position: new Vector(0, 0),
      normalSprite: new Sprite({
        position: new Vector(-1, -1),
        sprite: AssetManager.get('sun')!,
        columns: 2,
        frame: new Vector(0, 0),
      }),
      hoverSprite: new Sprite({
        position: new Vector(-1, -1),
        sprite: AssetManager.get('sun')!,
        columns: 2,
        frame: new Vector(1, 0),
      }),
      size: new Vector(10, 10),
    })

    this.addChild(clickable)

    const audio = new MonoAudio({
      audio: AssetManager.get('click-sun')!,
    })

    this.addChild(audio)

    clickable.ev.on('click', () => {
      audio.play()
      const x = this.globalPosition.x - SunCounter.instance.globalPosition.x
      const y = this.globalPosition.y - SunCounter.instance.globalPosition.y
      if (y < 0) this.oriY = -1
      else this.oriY = 1
      const h = Math.sqrt(x * x + y * y)
      this.relX = x / h
      this.relY = y / h
      clickable.disabled = true
      this.state = 'picked'
    })

    const deathTimer = new Timer({
      duration: 30,
    })

    this.addChild(deathTimer)
    deathTimer.ev.on('finished', () => {
      this.destroy()
    })
    deathTimer.play()

    super.start()
  }

  state: 'picked' | 'idle' = 'idle'

  relX = 1
  relY = 1

  oriY: number = 0

  update(dt: number): void {
    if (this.state === 'picked') {
      const move = SUN_SPEED * 32 * TILE_SIZE * dt
      this.position.x -= this.relX * move
      this.position.y -= this.relY * move
      if (
        this.globalPosition.y * this.oriY <=
          SunCounter.instance.globalPosition.y * this.oriY &&
        this.globalPosition.x <= SunCounter.instance.globalPosition.x
      ) {
        SunCounter.instance.count += 1
        this.destroy()
      }
    }

    if (this.state === 'idle') {
      if (this.position.y < this.finalPosition.y) {
        this.position.y += SUN_SPEED * TILE_SIZE * dt
      } else if (this.position.y !== this.finalPosition.y) {
        this.position.y = this.finalPosition.y
      }
    }
    super.update(dt)
  }
}

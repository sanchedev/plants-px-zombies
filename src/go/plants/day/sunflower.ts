import { PLANT_DETAILS } from '../../../details/plants.js'
import Game from '../../../ge/game.js'
import { Animator } from '../../../ge/nodes/animator.js'
import { Collider } from '../../../ge/nodes/collider.js'
import { Sprite } from '../../../ge/nodes/sprite.js'
import { Timer } from '../../../ge/nodes/timer.js'
import { NodeOptions } from '../../../ge/nodes/types.js'
import { Animation } from '../../../ge/utils/animation.js'
import { AssetManager } from '../../../ge/utils/asset.js'
import { Vector } from '../../../ge/utils/vector.js'
import { ImageAsset } from '../../../setup/image.js'
import { Sun } from '../../ui/sun.js'
import { Plant } from '../plant.js'

export class Sunflower extends Plant {
  health = PLANT_DETAILS.sunflower.toughness

  constructor(options: NodeOptions) {
    super(options)
  }

  animator!: Animator

  start(): void {
    const sprite = new Sprite({
      sprite: AssetManager.get(ImageAsset.SunflowerBasic)!,
      columns: 4,
      rows: 2,
    })

    const animator = new Animator({})

    const idleFrame = (frame: number) => {
      sprite.frame.x = frame
      sprite.frame.y = 0
    }

    const idleAnimation = new Animation({
      duration: 1000,
      keyframes: [
        { time: 0, action: () => idleFrame(0) },
        { time: 250, action: () => idleFrame(1) },
        { time: 500, action: () => idleFrame(2) },
        { time: 750, action: () => idleFrame(3) },
      ],
      loop: true,
    })

    const spawiningFrame = (frame: number) => {
      sprite.frame.x = frame
      sprite.frame.y = 1

      if (frame === 2) {
        this.spawnSun()
      }
    }

    const spawingAnimation = new Animation({
      duration: 1000,
      keyframes: [
        { time: 0, action: () => spawiningFrame(0) },
        { time: 250, action: () => spawiningFrame(1) },
        { time: 500, action: () => spawiningFrame(2) },
        { time: 750, action: () => spawiningFrame(3) },
      ],
    })

    spawingAnimation.ev.on('finished', () => {
      this.animator.play('idle')
    })

    const sunRate = PLANT_DETAILS.sunflower.sunProduction!.rate / 1000

    const timer = new Timer({
      duration: sunRate / 2,
    })
    timer.ev.on('finished', () => {
      timer.duration = sunRate
      animator.play('spawing')
      timer.play()
    })

    this.addChild(timer)
    this.addChild(animator)
    animator.addChild(sprite)

    animator.add('idle', idleAnimation)
    animator.add('spawing', spawingAnimation)

    animator.play('idle')
    timer.play()

    this.animator = animator

    // Collision
    const collider = new Collider({
      position: new Vector(2, 5),
      size: new Vector(11, 11),
      layer: [],
      autoCheck: false,
    })
    this.addChild(collider)

    super.start()
  }

  spawnSun() {
    const sun = new Sun({
      position: this.globalPosition.add(
        new Vector(Math.floor(Math.random() * 9), 0)
      ),
      fallingHeight: Math.floor(Math.random() * 3) + 3,
    })
    Game.game.addNodeToLayer('playable-ui', sun)
  }
}

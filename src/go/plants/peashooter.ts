import { PLANT_DETAILS } from '../../details/plants.js'
import Game from '../../ge/game.js'
import { Animator } from '../../ge/nodes/animator.js'
import { Collider } from '../../ge/nodes/collider.js'
import { RayCast } from '../../ge/nodes/raycast.js'
import { Sprite } from '../../ge/nodes/sprite.js'
import { NodeOptions } from '../../ge/nodes/types.js'
import { Animation } from '../../ge/utils/animation.js'
import { AssetManager } from '../../ge/utils/asset.js'
import { Vector } from '../../ge/utils/vector.js'
import { ImageAsset } from '../../setupAssets/image.js'
import { Pea } from '../projectiles/pea.js'
import { Plant } from './plant.js'

export class Peashooter extends Plant {
  health = PLANT_DETAILS.peashooter.toughness

  constructor(options: NodeOptions) {
    super(options)

    const sprite = new Sprite({
      sprite: AssetManager.get(ImageAsset.PeashooterBasic)!,
      columns: 4,
      rows: 2,
    })

    const idleFrame = (frame: number) => {
      sprite.frame = new Vector(frame, 0)
    }
    const attackFrame = (frame: number) => {
      sprite.frame = new Vector(frame, 1)
      if (frame === 3) {
        this.shoot()
      }
    }

    const idleDur = 1000
    const idleAnimation = new Animation({
      duration: idleDur,
      keyframes: [
        { time: 0, action: () => idleFrame(0) },
        { time: (1 * idleDur) / 4, action: () => idleFrame(1) },
        { time: (2 * idleDur) / 4, action: () => idleFrame(2) },
        { time: (3 * idleDur) / 4, action: () => idleFrame(3) },
      ],
    })

    const attackAnimation = new Animation({
      duration: 1500,
      keyframes: [
        { time: 0, action: () => attackFrame(0) },
        { time: 375, action: () => attackFrame(1) },
        { time: 750, action: () => attackFrame(2) },
        { time: 1125, action: () => attackFrame(3) },
      ],
    })

    const animator = new Animator({})
    animator.addChild(sprite)
    animator.add('idle', idleAnimation)
    animator.add('attack', attackAnimation)

    const selectAnimation = () => {
      if (this.hasZombie()) {
        animator.play('attack')
      } else {
        animator.play('idle')
      }
    }

    idleAnimation.ev.on('finished', selectAnimation)
    attackAnimation.ev.on('finished', selectAnimation)

    this.addChild(animator)

    const collider = new Collider({
      position: new Vector(5, 5),
      size: new Vector(10, 10),
      layer: [],
      autoCheck: false,
    })
    this.addChild(collider)

    const rayCast = new RayCast({
      position: new Vector(15, 10),
      direction: 1,
      length: Game.game.width - (this.globalPosition.x + 15),
      layer: ['zombies'],
      autoCheck: false,
    })
    console.log(rayCast)
    this.rayCast = rayCast
    this.addChild(rayCast)

    selectAnimation()
  }

  rayCast: RayCast

  hasZombie(): boolean {
    return this.rayCast.checkCollision().length > 0
  }

  shoot(): void {
    this.addChild(new Pea({ position: new Vector(17, 5) }))
  }
}

import { TILE_SIZE } from '../../../constants.js'
import { PLANT_DETAILS } from '../../../details/plants.js'
import Game from '../../../ge/game.js'
import { Animator } from '../../../ge/nodes/animator.js'
import { Collider } from '../../../ge/nodes/collider.js'
import { RayCast } from '../../../ge/nodes/raycast.js'
import { Sprite } from '../../../ge/nodes/sprite.js'
import { NodeOptions } from '../../../ge/nodes/types.js'
import { Animation } from '../../../ge/utils/animation.js'
import { AssetManager } from '../../../ge/utils/asset.js'
import { Vector } from '../../../ge/utils/vector.js'
import { getRow, row } from '../../../lib/row.js'
import { getTilePositionFromPosition } from '../../../lib/tiles.js'
import { ImageAsset } from '../../../setup/image.js'
import { Layers } from '../../../setup/layers.js'
import { Pea } from '../../projectiles/pea.js'
import { Plant } from '../plant.js'

export class Peashooter extends Plant {
  health = PLANT_DETAILS.peashooter.toughness

  start(): void {
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
        { time: 375, action: () => attackFrame(3) },
        { time: 750, action: () => attackFrame(2) },
        { time: 1125, action: () => attackFrame(1) },
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
      position: new Vector(4, 6),
      size: new Vector(8, 10),
      layer: [],
      autoCheck: false,
    })
    this.addChild(collider)

    const zombieLayer = row(getRow(this.getLayer()! as Layers), 'zombie')

    const rayCast = new RayCast({
      position: new Vector(11, 10),
      direction: 1,
      length:
        (PLANT_DETAILS.peashooter.attack.maxRange -
          getTilePositionFromPosition(this.globalPosition).x) *
          TILE_SIZE +
        TILE_SIZE -
        11,
      layer: [zombieLayer],
      autoCheck: false,
    })
    this.rayCast = rayCast
    this.addChild(rayCast)

    selectAnimation()

    super.start()
  }

  rayCast!: RayCast

  hasZombie(): boolean {
    return this.rayCast.checkRay() != null
  }

  shoot(): void {
    Game.game.addNodeToLayer(
      row(getRow(this.getLayer()! as Layers), 'projectile'),
      new Pea({ position: new Vector(11, 8).add(this.globalPosition) })
    )
  }
}

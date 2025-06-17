import { TILE_SIZE } from '../../../constants.js'
import { PLANT_DETAILS } from '../../../details/plants.js'
import Game from '../../../ge/game.js'
import { Animator } from '../../../ge/nodes/animator.js'
import { Collider } from '../../../ge/nodes/collider.js'
import { RayCast } from '../../../ge/nodes/raycast.js'
import { Sprite } from '../../../ge/nodes/sprite.js'
import { animateFunc, Animation } from '../../../ge/utils/animation.js'
import { AssetManager } from '../../../ge/utils/asset.js'
import { Vector } from '../../../ge/utils/vector.js'
import { getRow, row } from '../../../lib/row.js'
import { getTilePositionFromPosition } from '../../../lib/tiles.js'
import { FrozenPea } from '../../projectiles/frozen-pea.js'
import { Plant } from '../plant.js'

export class SnowPea extends Plant {
  health = PLANT_DETAILS.snowpea.toughness

  start(): void {
    const sprite = new Sprite({
      sprite: AssetManager.get('snowpea-basic')!,
      columns: 4,
      rows: 2,
    })

    const idleFrame = (frame: number) => {
      sprite.frame = new Vector(frame, 0)
    }
    const attackFrame = (frame: number) => {
      sprite.frame = new Vector(frame, 1)
      if (frame === 1) {
        this.shoot()
      }
    }

    const idleAnimation = animateFunc(4, idleFrame, 1000)

    const attackAnimation = animateFunc(4, attackFrame, 1500)

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

    const zombieLayer = row(getRow(this.getLayer()!), 'zombie')

    const rayCast = new RayCast({
      position: new Vector(11, 10),
      direction: 1,
      length:
        (PLANT_DETAILS.snowpea.attack.maxRange -
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
      row(getRow(this.getLayer()!), 'projectile'),
      new FrozenPea({ position: new Vector(11, 8).add(this.globalPosition) })
    )
  }
}

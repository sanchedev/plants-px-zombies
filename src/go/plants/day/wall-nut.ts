import { PLANT_DETAILS } from '../../../details/plants.js'
import { Animator } from '../../../ge/nodes/animator.js'
import { Collider } from '../../../ge/nodes/collider.js'
import { Sprite } from '../../../ge/nodes/sprite.js'
import { Animation } from '../../../ge/utils/animation.js'
import { AssetManager } from '../../../ge/utils/asset.js'
import { Vector } from '../../../ge/utils/vector.js'
import { Plant } from '../plant.js'

enum WallNutState {
  Full = 0,
  Half = 1,
  Empty = 2,
}

export class WallNut extends Plant {
  health = PLANT_DETAILS['wall-nut'].toughness

  start(): void {
    const sprite = new Sprite({
      sprite: AssetManager.get('wall-nut-basic')!,
      columns: 4,
      rows: 3,
    })

    const animator = new Animator({})

    const idleAnimation = (frame: number) => {
      sprite.frame.x = frame
      sprite.frame.y = this.healthState
    }

    animator.add(
      'idle',
      new Animation({
        duration: 2000,
        keyframes: [
          { time: 0, action: () => idleAnimation(0) },
          { time: 500, action: () => idleAnimation(1) },
          { time: 1000, action: () => idleAnimation(2) },
          { time: 1500, action: () => idleAnimation(3) },
        ],
        loop: true,
      })
    )

    animator.play('idle')

    animator.addChild(sprite)
    this.addChild(animator)

    const collider = new Collider({
      position: new Vector(4, 8),
      size: new Vector(8, 8),
      layer: [],
      autoCheck: false,
    })
    this.addChild(collider)
  }

  healthState: WallNutState = WallNutState.Full

  update(dt: number): void {
    if (this.health <= PLANT_DETAILS['wall-nut'].toughness / 3) {
      this.healthState = WallNutState.Empty
    } else if (this.health <= (2 * PLANT_DETAILS['wall-nut'].toughness) / 3) {
      this.healthState = WallNutState.Half
    } else {
      this.healthState = WallNutState.Full
    }

    super.update(dt)
  }
}

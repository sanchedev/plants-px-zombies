import { PLANT_DETAILS } from '../../../details/plants.js'
import { Animator } from '../../../ge/nodes/animator.js'
import { Collider } from '../../../ge/nodes/collider.js'
import { RayCast } from '../../../ge/nodes/raycast.js'
import { Sprite } from '../../../ge/nodes/sprite.js'
import { Timer } from '../../../ge/nodes/timer.js'
import { animateFunc } from '../../../ge/utils/animation.js'
import { AssetManager } from '../../../ge/utils/asset.js'
import { Vector } from '../../../ge/utils/vector.js'
import { getRow, row } from '../../../lib/getRow.js'
import { ReasonToDieOfZombie, Zombie } from '../../zombies/zombie.js'
import { Plant } from '../plant.js'

// Damage 40 Only towards Gargantuar, Giga-gargantuar, and Dr. Zomboss, but with other zombies the damage is 1800
// 42secs to swallow a zombie

export class Chomper extends Plant {
  health = PLANT_DETAILS.chomper.toughness
  timeToSwallow = 42

  start(): void {
    const sprite = new Sprite({
      sprite: AssetManager.get('chomper-basic')!,
      columns: 4,
      rows: 2,
    })

    const animator = new Animator({})
    animator.addChild(sprite)

    const idleFrame = (frame: number) => {
      sprite.sprite = AssetManager.get('chomper-basic')!
      sprite.frame.x = frame
      sprite.frame.y = this.isEating ? 1 : 0
      sprite.columns = 4
      sprite.rows = 2
    }
    animator.add('idle', animateFunc(4, idleFrame, 1000, true))
    animator.play('idle')

    this.addChild(animator)

    // Zombie detection
    const rayCast = new RayCast({
      position: new Vector(8, 12),
      direction: 1,
      length: 24,
      layer: [row(getRow(this.getLayer()!), 'zombie')],
      autoCheck: true,
    })
    this.addChild(rayCast)

    const startCatchingFrame = (frame: number) => {
      sprite.sprite = AssetManager.get('chomper-start-catching')!
      sprite.frame.x = frame
      sprite.frame.y = 0
      sprite.columns = 9
      sprite.rows = 1
    }
    const finishCatchingFrame = (frame: number) => {
      sprite.sprite = AssetManager.get('chomper-finish-catching')!
      sprite.frame.x = frame
      sprite.frame.y = 0
      sprite.columns = 9
      sprite.rows = 1
    }

    const startCatching = animateFunc(9, startCatchingFrame, 1000)
    const finishCatching = animateFunc(9, finishCatchingFrame, 1000)

    animator.add('start-catching', startCatching)
    animator.add('finish-catching', finishCatching)

    startCatching.ev.on('finished', () => {
      animator.play('finish-catching')
    })
    finishCatching.ev.on('finished', () => {
      animator.play('idle')
      timer.play()
    })

    rayCast.ev.on('collision', (z) => {
      const zombie = z.parent
      if (!(zombie instanceof Zombie)) return
      if (this.isEating) return
      this.isEating = true
      animator.play('start-catching')
      const onFinishStartingCatching = () => {
        zombie.damage(1800, ReasonToDieOfZombie.Eaten)
        startCatching.ev.off('finished', onFinishStartingCatching)
      }
      startCatching.ev.on('finished', onFinishStartingCatching)
    })

    const timer = new Timer({
      duration: this.timeToSwallow,
    })

    const swallowingFrame = (frame: number) => {
      sprite.sprite = AssetManager.get('chomper-swalowing')!
      sprite.frame.x = frame
      sprite.frame.y = 0
      sprite.columns = 8
      sprite.rows = 1
    }

    const swallowing = animateFunc(8, swallowingFrame, 1000)
    swallowing.ev.on('finished', () => {
      this.isEating = false
      rayCast.disabled = false
      animator.play('idle')
    })

    animator.add('swallowing', swallowing)

    timer.ev.on('finished', () => {
      animator.play('swallowing')
    })

    this.addChild(timer)

    const collider = new Collider({
      position: new Vector(3, 5),
      size: new Vector(5, 11),
      layer: [],
      autoCheck: false,
    })
    this.addChild(collider)

    super.start()
  }

  isEating = false
}

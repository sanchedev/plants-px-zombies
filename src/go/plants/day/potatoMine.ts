import { PLANT_DETAILS } from '../../../details/plants.js'
import Game from '../../../ge/game.js'
import { Animator } from '../../../ge/nodes/animator.js'
import { checkCollisionInLayer, Collider } from '../../../ge/nodes/collider.js'
import { Sprite } from '../../../ge/nodes/sprite.js'
import { TemporalAnimation } from '../../../ge/nodes/temporalAnimation.js'
import { Timer } from '../../../ge/nodes/timer.js'
import { animateSprite, Animation } from '../../../ge/utils/animation.js'
import { AssetManager } from '../../../ge/utils/asset.js'
import { Vector } from '../../../ge/utils/vector.js'
import { getRow, row } from '../../../lib/getRow.js'
import { Zombie } from '../../zombies/zombie.js'
import { Plant } from '../plant.js'

export class PotatoMine extends Plant {
  health = PLANT_DETAILS.potatomine.toughness

  start(): void {
    const sprite = new Sprite({
      sprite: AssetManager.get('potatomine-desactivated')!,
      columns: 2,
      rows: 1,
    })

    const animator = new Animator({})

    const desactivatedFrame = (frame: number) => {
      sprite.sprite = AssetManager.get('potatomine-desactivated')!
      sprite.frame.x = frame
      sprite.frame.y = 0
      sprite.columns = 2
    }
    const activatedFrame = (frame: number) => {
      sprite.sprite = AssetManager.get('potatomine-activated')!
      sprite.frame.x = frame
      sprite.frame.y = 0
      sprite.columns = 2
    }

    animator.add(
      'desactivated',
      new Animation({
        duration: 1000,
        keyframes: [
          { time: 0, action: () => desactivatedFrame(0) },
          { time: 500, action: () => desactivatedFrame(1) },
        ],
        loop: true,
      })
    )
    animator.add(
      'activated',
      new Animation({
        duration: 1000,
        keyframes: [
          { time: 0, action: () => activatedFrame(0) },
          { time: 500, action: () => activatedFrame(1) },
        ],
        loop: true,
      })
    )

    animator.addChild(sprite)
    this.addChild(animator)

    animator.play('desactivated')

    const timer = new Timer({
      duration: 14,
    })
    timer.ev.on('finished', () => {
      sprite.sprite = AssetManager.get('potatomine-activating')!
      sprite.columns = 5
      const activating = animateSprite(sprite, 1000)
      animator.add('activating', activating)
      animator.play('activating')

      activating.ev.on('finished', () => {
        animator.play('activated')
        collider.autoCheck = true
      })
    })
    timer.play()

    this.addChild(timer)

    const layerRow = getRow(this.getLayer()!)

    const collider = new Collider({
      position: new Vector(4, 10),
      size: new Vector(9, 6),
      layer: [row(layerRow, 'zombie')],
      autoCheck: false,
    })
    collider.ev.on('collision', (collider) => {
      if (collider.parent instanceof Zombie) {
        const sprite = new Sprite({
          sprite: AssetManager.get('potatomine-spudow')!,
          columns: 10,
        })
        const position = this.globalPosition.clone()
        const animation = animateSprite(sprite, 1000)
        Game.game.addNodeToLayer(
          row(layerRow, 'projectile'),
          new TemporalAnimation({
            position,
            animation,
            children: [sprite],
          })
        )

        animation.ev.on('frameChanged', (frame) => {
          if (frame !== 8) return
          const colliders = checkCollisionInLayer(
            row(layerRow, 'zombie'),
            position,
            new Vector(16, 16)
          )

          colliders.forEach(
            (collider) =>
              collider.parent instanceof Zombie && collider.parent.damage(1800)
          )
        })

        this.destroy()
      }
    })

    this.addChild(collider)

    super.start()
  }
}

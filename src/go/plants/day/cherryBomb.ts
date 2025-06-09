import { PLANT_DETAILS } from '../../../details/plants.js'
import Game from '../../../ge/game.js'
import { checkCollisionInLayer } from '../../../ge/nodes/collider.js'
import { Sprite } from '../../../ge/nodes/sprite.js'
import { TemporalAnimation } from '../../../ge/nodes/temporalAnimation.js'
import { animateSprite } from '../../../ge/utils/animation.js'
import { AssetManager } from '../../../ge/utils/asset.js'
import { Vector } from '../../../ge/utils/vector.js'
import { getRow, row } from '../../../lib/getRow.js'
import { Layers } from '../../../setup/layers.js'
import { ReasonToDieOfZombie, Zombie } from '../../zombies/zombie.js'
import { Plant } from '../plant.js'

export class CherryBomb extends Plant {
  health = PLANT_DETAILS['cherry-bomb'].toughness

  start(): void {
    const sprite = new Sprite({
      sprite: AssetManager.get('cherry-bomb-explosion')!,
      columns: 6,
    })

    const anim = animateSprite(sprite, 1000)

    const temporalAnim = new TemporalAnimation({
      animation: anim,
      children: [sprite],
    })
    this.addChild(temporalAnim)

    anim.ev.on('frameChanged', (frame) => {
      if (frame !== 5) return
      const layer = this.getLayer()!
      const bomb = new Sprite({
        sprite: AssetManager.get('cherry-bomb-boomb')!,
        columns: 10,
      })

      const animation = animateSprite(bomb, 1000)
      const pos = this.globalPosition.add(new Vector(-16, -16))

      Game.game.addNodeToLayer(
        row(getRow(layer as Layers), 'projectile'),
        new TemporalAnimation({
          position: pos,
          animation,
          children: [bomb],
        })
      )

      animation.ev.on('frameChanged', (frame) => {
        if (frame !== 8) return
        const colliders = checkCollisionInLayer(
          row(getRow(layer as Layers), 'zombie'),
          pos,
          new Vector(48, 48)
        )

        colliders.forEach(
          (collider) =>
            collider.parent instanceof Zombie &&
            collider.parent.damage(1800, ReasonToDieOfZombie.Burned)
        )
      })
    })

    anim.ev.on('finished', () => {
      this.destroy()
    })

    super.start()
  }
}

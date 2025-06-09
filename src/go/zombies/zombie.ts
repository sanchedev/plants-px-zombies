import Game from '../../ge/game.js'
import { Node } from '../../ge/nodes/node.js'
import { Sprite } from '../../ge/nodes/sprite.js'
import { TemporalAnimation } from '../../ge/nodes/temporalAnimation.js'
import { animateSprite } from '../../ge/utils/animation.js'
import { AssetType, createAsset } from '../../ge/utils/asset.js'
import { Vector } from '../../ge/utils/vector.js'

const defaultZombieDeadAnimation = createAsset(
  'default-zombie-dead',
  '/assets/sprites/zombies/dead/normal.png',
  AssetType.Image
)
const defaultZombieDeadBurnedAnimation = createAsset(
  'default-zombie-dead-burned',
  '/assets/sprites/zombies/dead/burned.png',
  AssetType.Image
)

export enum ReasonToDieOfZombie {
  Common = 0,
  Burned = 1,
  Eaten = 2,
}

export enum ZombieEffect {
  None = 0,
  Frozen = 1,
}

export abstract class Zombie extends Node {
  abstract health: number
  abstract speed: number

  effect: ZombieEffect = ZombieEffect.None

  deadCommonAnimationSprite = new Sprite({
    sprite: defaultZombieDeadAnimation,
    columns: 10,
  })
  deadBurnedAnimationSprite = new Sprite({
    sprite: defaultZombieDeadBurnedAnimation,
    columns: 10,
  })

  damage(damage: number, reason = ReasonToDieOfZombie.Common) {
    this.health -= damage
    if (this.health > 0) return

    switch (reason) {
      case ReasonToDieOfZombie.Common:
        zombieDeadAnimation(
          this.getLayer()!,
          this.globalPosition.add(new Vector(0, 0)),
          this.deadCommonAnimationSprite
        )
        break
      case ReasonToDieOfZombie.Burned:
        zombieDeadAnimation(
          this.getLayer()!,
          this.globalPosition.add(new Vector(0, 0)),
          this.deadBurnedAnimationSprite
        )
        break
      case ReasonToDieOfZombie.Eaten:
        break
    }

    this.update(0)
    this.destroy()
  }

  move(distance: number) {
    this.position.x -= distance
  }

  update(dt: number): void {
    if (this.effect === ZombieEffect.Frozen) {
      this.timeRate = 0.5
    } else {
      this.timeRate = 1
    }
    super.update(dt)
  }
}

export function zombieDeadAnimation(
  layer: string,
  position: Vector,
  sprite: Sprite
) {
  Game.game.addNodeToLayer(
    layer,
    new TemporalAnimation({
      position: position.clone(),
      animation: animateSprite(sprite, 1000),
      children: [sprite],
    })
  )
}

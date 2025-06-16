import { TILE_SIZE } from '../../../constants.js'
import { ZOMBIE_DETAILS, ZombieDamages } from '../../../details/zombies.js'
import Game from '../../../ge/game.js'
import { Animator } from '../../../ge/nodes/animator.js'
import { Collider } from '../../../ge/nodes/collider.js'
import { Sprite } from '../../../ge/nodes/sprite.js'
import { TemporalAnimation } from '../../../ge/nodes/temporalAnimation.js'
import { animateSprite, Animation } from '../../../ge/utils/animation.js'
import {
  AssetManager,
  AssetType,
  createAsset,
} from '../../../ge/utils/asset.js'
import { Vector } from '../../../ge/utils/vector.js'
import { row, getRow } from '../../../lib/getRow.js'
import { Layers } from '../../../setup/layers.js'
import { Plant } from '../../plants/plant.js'
import { Zombie } from '../zombie.js'

createAsset(
  'conehead-zombie-walking',
  '/assets/sprites/zombies/day/conehead-zombie/walking.png',
  AssetType.Image
)
createAsset(
  'conehead-zombie-eating',
  '/assets/sprites/zombies/day/conehead-zombie/eating.png',
  AssetType.Image
)
createAsset(
  'conehead-zombie-cone-broken',
  '/assets/sprites/zombies/day/conehead-zombie/cone-broken.png',
  AssetType.Image
)

enum ZombieState {
  Walking = 'walking',
  Eating = 'eating',
}

export class ConeheadZombie extends Zombie {
  health =
    ZOMBIE_DETAILS['conehead-zombie'].health[0] +
    ZOMBIE_DETAILS['conehead-zombie'].health[1]

  speed = ZOMBIE_DETAILS['conehead-zombie'].speed

  start(): void {
    const sprite = new Sprite({
      sprite: AssetManager.get('conehead-zombie-walking')!,
      columns: 4,
      rows: 2,
    })

    const animator = new Animator({})
    animator.addChild(sprite)

    const walkingFrame = (frame: number) => {
      if (this.hasCone) {
        sprite.sprite = AssetManager.get('conehead-zombie-walking')!
        sprite.frame.x = frame
        sprite.frame.y = this.coneHasHalfLife ? 1 : 0
        sprite.columns = 4
      } else {
        sprite.sprite = AssetManager.get('normal-zombie-walking')!
        sprite.frame.x = frame
        sprite.frame.y = this.hasHalfLife ? 1 : 0
        sprite.columns = 4
      }
    }

    animator.add(
      'walking',
      new Animation({
        duration: 1000,
        keyframes: [
          { time: 0, action: () => walkingFrame(0) },
          { time: 250, action: () => walkingFrame(1) },
          { time: 500, action: () => walkingFrame(2) },
          { time: 750, action: () => walkingFrame(3) },
        ],
        loop: true,
      })
    )

    const eatingFrame = (frame: number) => {
      if (this.hasCone) {
        sprite.sprite = AssetManager.get('conehead-zombie-eating')!
        sprite.frame.x = frame
        sprite.frame.y = this.coneHasHalfLife ? 1 : 0
        sprite.columns = 2
      } else {
        sprite.sprite = AssetManager.get('normal-zombie-eating')!
        sprite.frame.x = frame
        sprite.frame.y = this.hasHalfLife ? 1 : 0
        sprite.columns = 2
      }
      if (frame === 1) this.eat()
    }

    animator.add(
      'eating',
      new Animation({
        duration: 1000,
        keyframes: [
          { time: 0, action: () => eatingFrame(0) },
          { time: 500, action: () => eatingFrame(1) },
        ],
        loop: true,
      })
    )

    this.addChild(animator)

    animator.play('walking')

    const collider = new Collider({
      position: new Vector(4, 4),
      size: new Vector(6, 12),
      layer: [row(getRow(this.getLayer()! as Layers), 'plant')],
      autoCheck: true,
    })

    collider.ev.on('collision', (collider) => {
      if (collider.parent instanceof Plant) {
        this.state = ZombieState.Eating
        animator.play('eating')
        this.plant = collider.parent
        this.plantCollider = collider
      }
    })
    collider.ev.on('exit', (collider) => {
      if (collider === this.plantCollider) {
        this.state = ZombieState.Walking
        animator.play('walking')
      }
    })

    this.addChild(collider)

    super.start()
  }

  hasCone = true
  coneHasHalfLife = false
  hasHalfLife = false
  state: ZombieState = ZombieState.Walking
  plant: Plant | null = null
  plantCollider: Collider | null = null

  walk(dt: number) {
    this.move((TILE_SIZE / this.speed) * dt)
  }

  eat() {
    if (this.plant) {
      this.plant.damage(ZombieDamages.Eat)
    }
  }

  update(dt: number): void {
    if (this.state === ZombieState.Walking) {
      this.walk(dt)
    }

    // Health
    if (
      !this.hasHalfLife &&
      this.health <= ZOMBIE_DETAILS['conehead-zombie'].health[1] / 2
    ) {
      this.hasHalfLife = true
      const sprite = new Sprite({
        sprite: AssetManager.get('normal-zombie-arm-falling')!,
        columns: 10,
      })
      Game.game.addNodeToLayer(
        this.getLayer()!,
        new TemporalAnimation({
          position: this.globalPosition.add(new Vector(0, 0)),
          animation: animateSprite(sprite, 1000),
          children: [sprite],
        })
      )
    }
    if (
      this.hasCone &&
      this.health <= ZOMBIE_DETAILS['conehead-zombie'].health[1]
    ) {
      this.hasCone = false
      const sprite = new Sprite({
        sprite: AssetManager.get('conehead-zombie-cone-broken')!,
        columns: 10,
      })
      Game.game.addNodeToLayer(
        this.getLayer()!,
        new TemporalAnimation({
          position: this.globalPosition.add(new Vector(0, 0)),
          animation: animateSprite(sprite, 1000),
          children: [sprite],
        })
      )
    }
    if (
      !this.coneHasHalfLife &&
      this.health <=
        ZOMBIE_DETAILS['conehead-zombie'].health[1] +
          ZOMBIE_DETAILS['conehead-zombie'].health[0] / 2
    ) {
      this.coneHasHalfLife = true
    }

    super.update(dt)
  }
}

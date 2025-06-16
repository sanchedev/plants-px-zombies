import { TILE_SIZE } from '../../../constants.js'
import { ZOMBIE_DETAILS, ZombieDamages } from '../../../details/zombies.js'
import Game from '../../../ge/game.js'
import { Animator } from '../../../ge/nodes/animator.js'
import { Collider } from '../../../ge/nodes/collider.js'
import { RayCast } from '../../../ge/nodes/raycast.js'
import { Sprite } from '../../../ge/nodes/sprite.js'
import { TemporalAnimation } from '../../../ge/nodes/temporalAnimation.js'
import {
  animateFunc,
  animateSprite,
  Animation,
} from '../../../ge/utils/animation.js'
import { AssetManager } from '../../../ge/utils/asset.js'
import { Vector } from '../../../ge/utils/vector.js'
import { getRow, row } from '../../../lib/getRow.js'
import { Plant } from '../../plants/plant.js'
import { Zombie } from '../zombie.js'

enum ZombieHealthState {
  Normal = 0,
  Half = 1,
}

enum PoleVaultingZombieMoveState {
  Running = 0,
  Jumping = 1,
  OnAir = 2,
  Pause = 3,
  Walking = 4,
  Eating = 5,
}

export class PoleVaultingZombie extends Zombie {
  health = ZOMBIE_DETAILS['pole-vaulting-zombie'].health
  speed = ZOMBIE_DETAILS['pole-vaulting-zombie'].speed[0]

  deadCommonAnimationSprite = new Sprite({
    sprite: AssetManager.get('pole-vaulting-zombie-normal-dead')!,
    columns: 10,
  })

  start(): void {
    const sprite = new Sprite({
      sprite: AssetManager.get('pole-vaulting-zombie-running')!,
      columns: 4,
      rows: 2,
    })

    const animator = new Animator({})

    const runningFrame = (frame: number) => {
      sprite.sprite = AssetManager.get('pole-vaulting-zombie-running')!
      sprite.frame.x = frame
      sprite.frame.y = this.healthState
    }
    animator.add('running', animateFunc(4, runningFrame, 1000, true))

    const walkingFrame = (frame: number) => {
      sprite.sprite = AssetManager.get('pole-vaulting-zombie-walking')!
      sprite.frame.x = frame
      sprite.frame.y = this.healthState
      sprite.columns = 4
      sprite.rows = 2
    }
    animator.add('walking', animateFunc(4, walkingFrame, 1000, true))

    const eatingFrame = (frame: number) => {
      sprite.sprite = AssetManager.get('pole-vaulting-zombie-eating')!
      sprite.frame.x = frame
      sprite.frame.y = this.healthState
      sprite.columns = 2
      sprite.rows = 2

      if (frame === 1) this.eat()
    }
    animator.add('eating', animateFunc(2, eatingFrame, 1000, true))

    animator.play('running')

    this.addChild(animator)

    animator.addChild(sprite)

    const collider = new Collider({
      position: new Vector(6, 4),
      size: new Vector(4, 12),
      layer: [row(getRow(this.getLayer()!), 'plant')],
      autoCheck: false, // After to jump, it'll be true
    })

    collider.ev.on('collision', (collider) => {
      if (collider.parent instanceof Plant) {
        this.moveState = PoleVaultingZombieMoveState.Eating
        animator.play('eating')
        this.target = collider
      }
    })
    collider.ev.on('exit', (collider) => {
      if (collider === this.target) {
        this.moveState = PoleVaultingZombieMoveState.Walking
        animator.play('walking')
      }
    })

    this.addChild(collider)

    // Raycast, to check if front of the zombie is a plant
    const raycast = new RayCast({
      position: new Vector(2, 12),
      direction: -1,
      length: 3,
      layer: [row(getRow(this.getLayer()!), 'plant')],
    })
    this.addChild(raycast)

    raycast.ev.on('collision', (plant) => {
      if (!(plant.parent instanceof Plant)) return
      raycast.destroy()

      // TODO: When i implement the big plants, i'll need to check if the plant is big, to know if this zombie can jump or not

      collider.disabled = true

      const jumpingFrame = (frame: number) => {
        sprite.sprite = AssetManager.get('pole-vaulting-zombie-jumping')!
        sprite.frame.x = frame
        sprite.frame.y = 0 // Comming soon... this.healthState
        sprite.columns = 6
        sprite.rows = 1 // Comming soon... 2
      }
      const onAirFrame = (frame: number) => {
        sprite.sprite = AssetManager.get('pole-vaulting-zombie-on-air')!
        sprite.frame.x = frame
        sprite.frame.y = 0 // Comming soon... this.healthState
        sprite.columns = 10
        sprite.rows = 1 // Comming soon... 2
      }

      const jumping = animateFunc(6, jumpingFrame, 400)
      animator.add('jumping', jumping)
      const onAir = animateFunc(10, onAirFrame, 2000)
      animator.add('onAir', onAir)

      animator.play('jumping')
      this.moveState = PoleVaultingZombieMoveState.Jumping
      jumping.ev.on('finished', () => {
        animator.play('onAir')
        onAir.ev.on('frameChanged', (frame) => {
          if (frame === 2) {
            const stickSprite = new Sprite({
              sprite: AssetManager.get('pole-vaulting-zombie-stick')!,
              columns: 10,
            })
            Game.game.addNodeToLayer(
              this.getLayer()!,
              new TemporalAnimation({
                position: this.globalPosition.clone(),
                animation: animateSprite(stickSprite, 1000),
                children: [stickSprite],
              })
            )
            this.moveState = PoleVaultingZombieMoveState.OnAir
          }

          if (frame < 6) return
          this.moveState = PoleVaultingZombieMoveState.Pause
          collider.disabled = false
        })
        onAir.ev.on('finished', () => {
          animator.play('walking')
          this.moveState = PoleVaultingZombieMoveState.Walking
          collider.autoCheck = true
        })
      })
    })

    super.start()
  }

  healthState: ZombieHealthState = ZombieHealthState.Normal
  moveState: PoleVaultingZombieMoveState = PoleVaultingZombieMoveState.Running
  target: Collider | null = null

  eat() {
    if (this.target) {
      ;(this.target.parent as Plant).damage(ZombieDamages.Eat)
    }
  }

  update(dt: number): void {
    if (
      this.healthState !== ZombieHealthState.Half &&
      this.health <= ZOMBIE_DETAILS['pole-vaulting-zombie'].health / 2
    ) {
      this.healthState = ZombieHealthState.Half
      const sprite = new Sprite({
        sprite: AssetManager.get('pole-vaulting-zombie-normal-arm-falling')!,
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

    if (this.moveState === PoleVaultingZombieMoveState.Running) {
      this.move(
        (TILE_SIZE / ZOMBIE_DETAILS['pole-vaulting-zombie'].speed[0]) * dt
      )
    } else if (this.moveState === PoleVaultingZombieMoveState.Jumping) {
      this.move(
        (TILE_SIZE / ZOMBIE_DETAILS['pole-vaulting-zombie'].speed[0]) * dt
      )
    } else if (this.moveState === PoleVaultingZombieMoveState.OnAir) {
      this.position.x -= (TILE_SIZE * dt) / 0.7 // because the zombie is moving in the air and not in the ground
    } else if (this.moveState === PoleVaultingZombieMoveState.Pause) {
      // No movement
    } else if (this.moveState === PoleVaultingZombieMoveState.Walking) {
      this.move(
        (TILE_SIZE / ZOMBIE_DETAILS['pole-vaulting-zombie'].speed[1]) * dt
      )
    } else if (this.moveState === PoleVaultingZombieMoveState.Eating) {
      // No movement
    }

    super.update(dt)
  }
}

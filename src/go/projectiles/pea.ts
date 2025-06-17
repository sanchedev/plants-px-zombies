import { TILE_SIZE } from '../../constants.js'
import Game from '../../ge/game.js'
import { Collider } from '../../ge/nodes/collider.js'
import { Sprite } from '../../ge/nodes/sprite.js'
import { NodeOptions } from '../../ge/nodes/types.js'
import { Asset, AssetManager, AssetType } from '../../ge/utils/asset.js'
import { Vector } from '../../ge/utils/vector.js'
import { getRow, row } from '../../lib/row.js'
import { ImageAsset } from '../../setup/image.js'
import { Layers } from '../../setup/layers.js'
import { Zombie } from '../zombies/zombie.js'
import { Projectil } from './projectil.js'

export enum PeaDirection {
  LEFT = 'left',
  RIGHT = 'right',
}

export interface PeaOptions extends NodeOptions {
  /**
   * The direction of the projectile.
   * @default PeaDirection.RIGHT
   */
  direction?: PeaDirection
  /**
   * The speed (in tiles per second) of the projectile.
   * @default 4
   */
  speed?: number
}

export class Pea extends Projectil {
  direction: PeaDirection
  speed: number

  constructor(options: PeaOptions) {
    super(options)
    this.direction = options.direction ?? PeaDirection.RIGHT
    this.speed = options.speed ?? 4
  }

  peaAsset: Asset<AssetType.Image> = AssetManager.get(ImageAsset.Pea)!

  start(): void {
    const sprite = new Sprite({
      sprite: this.peaAsset,
    })

    this.addChild(sprite)

    const collider = new Collider({
      position: new Vector(0, 0),
      size: new Vector(4, 4),
      layer: [row(getRow(this.getLayer()! as Layers), 'zombie')],
      autoCheck: true,
    })

    this.addChild(collider)

    collider.ev.on('collision', (collider) => {
      if (collider.parent instanceof Zombie) {
        this.onDamage(collider.parent)
      }
    })

    super.start()
  }

  damage: number = 20

  onDamage(zombie: Zombie) {
    zombie.damage(this.damage)
    this.destroy()
  }

  update(dt: number): void {
    this.position.x += this.speed * TILE_SIZE * dt

    if (this.globalPosition.x > Game.game.width) {
      this.destroy()
    }

    super.update(dt)
  }
}

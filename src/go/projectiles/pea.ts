import { TILE_SIZE } from '../../constants.js'
import Game from '../../ge/game.js'
import { Sprite } from '../../ge/nodes/sprite.js'
import { NodeOptions } from '../../ge/nodes/types.js'
import { AssetManager } from '../../ge/utils/asset.js'
import { ImageAsset } from '../../setupAssets/image.js'
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

    const sprite = new Sprite({
      sprite: AssetManager.get(ImageAsset.Pea)!,
    })

    this.addChild(sprite)
  }

  damage: number = 20

  update(dt: number): void {
    this.position.x += this.speed * TILE_SIZE * dt

    if (this.globalPosition.x > Game.game.width) {
      this.destroy()
    }

    super.update(dt)
  }
}

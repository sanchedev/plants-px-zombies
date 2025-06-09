import { Asset, AssetManager, AssetType } from '../../ge/utils/asset.js'
import { Zombie, ZombieEffect } from '../zombies/zombie.js'
import { Pea } from './pea.js'

export class FrozenPea extends Pea {
  peaAsset = AssetManager.get('projectile-frozen-pea') as Asset<AssetType.Image>

  onDamage(zombie: Zombie): void {
    zombie.effect = ZombieEffect.Frozen
    super.onDamage(zombie)
  }
}

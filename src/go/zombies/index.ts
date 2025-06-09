import { ZOMBIE_DETAILS } from '../../details/zombies.js'
import { NodeOptions } from '../../ge/nodes/types.js'
import {
  BucketheadZombie,
  ConeheadZombie,
  NormalZombie,
  PoleVaultingZombie,
} from './day/index.js'
import { Zombie } from './zombie.js'

export const ZOMBIES: Record<
  keyof typeof ZOMBIE_DETAILS,
  new (options: NodeOptions) => Zombie
> = {
  zombie: NormalZombie,
  'flag-zombie': NormalZombie,
  'conehead-zombie': ConeheadZombie,
  'pole-vaulting-zombie': PoleVaultingZombie,
  'buckethead-zombie': BucketheadZombie,
}

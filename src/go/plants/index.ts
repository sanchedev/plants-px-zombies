import { PLANT_DETAILS } from '../../details/plants.js'
import { NodeOptions } from '../../ge/nodes/types.js'
import {
  CherryBomb,
  Chomper,
  Peashooter,
  PotatoMine,
  Repeater,
  SnowPea,
  Sunflower,
  WallNut,
} from './day/index.js'
import { Plant } from './plant.js'

export const PLANTS: Record<
  keyof typeof PLANT_DETAILS,
  new (options: NodeOptions) => Plant
> = {
  peashooter: Peashooter,
  sunflower: Sunflower,
  'cherry-bomb': CherryBomb,
  'wall-nut': WallNut,
  potatomine: PotatoMine,
  snowpea: SnowPea,
  chomper: Chomper,
  repeater: Repeater,
}

import { AssetType, createAsset } from '../ge/utils/asset.js'

export const enum ImageAsset {
  dayBg = 'day-bg',

  PeashooterBasic = 'peashooter-basic',
  SunflowerBasic = 'sunflower-basic',
  WallNutBasic = 'wall-nut-basic',

  // Projectiles
  Pea = 'projectile-pea',
}

createAsset(
  ImageAsset.dayBg,
  '/assets/sprites/ui/maps/day/bg-mini.png',
  AssetType.Image
)

// Plants
createAsset(
  ImageAsset.PeashooterBasic,
  '/assets/sprites/plants/day/peashooter/basic.png',
  AssetType.Image
)
createAsset(
  ImageAsset.SunflowerBasic,
  '/assets/sprites/plants/day/sunflower/basic.png',
  AssetType.Image
)
createAsset(
  'cherry-bomb-boomb',
  '/assets/sprites/plants/day/cherry-bomb/boomb.png',
  AssetType.Image
)
createAsset(
  'cherry-bomb-explosion',
  '/assets/sprites/plants/day/cherry-bomb/explosion.png',
  AssetType.Image
)
createAsset(
  ImageAsset.WallNutBasic,
  '/assets/sprites/plants/day/wall-nut/basic.png',
  AssetType.Image
)
createAsset(
  'potatomine-desactivated',
  '/assets/sprites/plants/day/potato-mine/desactivated.png',
  AssetType.Image
)
createAsset(
  'potatomine-activating',
  '/assets/sprites/plants/day/potato-mine/activating.png',
  AssetType.Image
)
createAsset(
  'potatomine-activated',
  '/assets/sprites/plants/day/potato-mine/activated.png',
  AssetType.Image
)
createAsset(
  'potatomine-spudow',
  '/assets/sprites/plants/day/potato-mine/spudow.png',
  AssetType.Image
)
createAsset(
  'snowpea-basic',
  '/assets/sprites/plants/day/snow-pea/basic.png',
  AssetType.Image
)

createAsset(
  'chomper-basic',
  '/assets/sprites/plants/day/chomper/basic.png',
  AssetType.Image
)
createAsset(
  'chomper-loading-attack',
  '/assets/sprites/plants/day/chomper/loading-attack.png',
  AssetType.Image
)
createAsset(
  'chomper-start-catching',
  '/assets/sprites/plants/day/chomper/start-catching.png',
  AssetType.Image
)
createAsset(
  'chomper-finish-catching',
  '/assets/sprites/plants/day/chomper/finish-catching.png',
  AssetType.Image
)
createAsset(
  'chomper-swalowing',
  '/assets/sprites/plants/day/chomper/swalowing.png',
  AssetType.Image
)

createAsset(
  'repeater-basic',
  '/assets/sprites/plants/day/repeater/basic.png',
  AssetType.Image
)

// Projectiles
createAsset(
  ImageAsset.Pea,
  '/assets/sprites/projectiles/pea.png',
  AssetType.Image
)
createAsset(
  'projectile-frozen-pea',
  '/assets/sprites/projectiles/frozen-pea.png',
  AssetType.Image
)

// Zombies
createAsset(
  'normal-zombie-walking',
  '/assets/sprites/zombies/day/zombie/walking.png',
  AssetType.Image
)
createAsset(
  'normal-zombie-eating',
  '/assets/sprites/zombies/day/zombie/eating.png',
  AssetType.Image
)
createAsset(
  'normal-zombie-arm-falling',
  '/assets/sprites/zombies/arm/normal-arm-falling.png',
  AssetType.Image
)

createAsset(
  'pole-vaulting-zombie-running',
  '/assets/sprites/zombies/day/pole-vaulting-zombie/running.png',
  AssetType.Image
)
createAsset(
  'pole-vaulting-zombie-jumping',
  '/assets/sprites/zombies/day/pole-vaulting-zombie/jumping.png',
  AssetType.Image
)
createAsset(
  'pole-vaulting-zombie-on-air',
  '/assets/sprites/zombies/day/pole-vaulting-zombie/on-air.png',
  AssetType.Image
)
createAsset(
  'pole-vaulting-zombie-walking',
  '/assets/sprites/zombies/day/pole-vaulting-zombie/walking.png',
  AssetType.Image
)
createAsset(
  'pole-vaulting-zombie-eating',
  '/assets/sprites/zombies/day/pole-vaulting-zombie/eating.png',
  AssetType.Image
)
createAsset(
  'pole-vaulting-zombie-stick',
  '/assets/sprites/zombies/day/pole-vaulting-zombie/stick.png',
  AssetType.Image
)

createAsset(
  'pole-vaulting-zombie-normal-dead',
  '/assets/sprites/zombies/day/pole-vaulting-zombie/normal-dead.png',
  AssetType.Image
)
createAsset(
  'pole-vaulting-zombie-normal-arm-falling',
  '/assets/sprites/zombies/arm/pole-vaulting-arm-falling.png',
  AssetType.Image
)

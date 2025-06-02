import { AssetType, createAsset } from '../ge/utils/asset.js'

export const enum ImageAsset {
  PeashooterBasic = 'peashooter-basic',
  Pea = 'pea',
  SunflowerBasic = 'sunflower-basic',
  WallNutBasic = 'wall-nut-basic',
}

// Plants
createAsset(
  ImageAsset.PeashooterBasic,
  '/assets/sprites/plants/peashooter/basic.png',
  AssetType.Image
)
createAsset(
  ImageAsset.SunflowerBasic,
  '/assets/sprites/plants/sunflower/basic.png',
  AssetType.Image
)
createAsset(
  ImageAsset.WallNutBasic,
  '/assets/sprites/plants/wall-nut/basic.png',
  AssetType.Image
)

// Projectiles
createAsset(
  ImageAsset.Pea,
  '/assets/sprites/projectiles/pea.png',
  AssetType.Image
)

// Zombies

import { AssetType, createAsset } from '../ge/utils/asset.js'

export const enum ImageAsset {
  PeashooterBasic = 'peashooter-basic',
  Pea = 'pea',
}

createAsset(
  ImageAsset.PeashooterBasic,
  '/assets/sprites/plants/day/peashooter/basic.png',
  AssetType.Image
)
createAsset(
  ImageAsset.Pea,
  '/assets/sprites/projectiles/pea.png',
  AssetType.Image
)

export interface PlantDetails {
  name: string
  cost: number
  toughness: number
  /** In milliseconds */
  recharge: number
  defaultLoaded: boolean
  attack: Attack | null
  sunProduction: SunProduction | null
}

interface ShootAttack {
  type: 'shoot'
  peaType: PeaType
  /** In milliseconds */
  fireRate: number
  /** In tiles */
  maxRange: number
}
interface ExplodeAttack {
  type: 'explode'
  /** In tiles diameter */
  range: number
}
interface EatAttack {
  type: 'eat'
}
type Attack = ShootAttack | ExplodeAttack | EatAttack

interface SunProduction {
  rate: number
  size: SunSize
}

export enum SunSize {
  Normal = 50,
  Small = 25,
}

export enum PeaType {
  Pea = 'pea',
  Snowpea = 'snowpea',
  Firepea = 'firepea',
}

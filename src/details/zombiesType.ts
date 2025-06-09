export interface ZombieDetails {
  name: string
  cost: number
  /** In milliseconds */
  recharge: number
  defaultLoaded: boolean
  health: number | number[]
  /** Speed seconds per tile */
  speed: number | number[]
}

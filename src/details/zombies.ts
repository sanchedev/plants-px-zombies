export const ZOMBIE_DETAILS = {
  zombie: {
    name: 'Zombie',
    cost: 75,
    recharge: 7500,
    defaultLoaded: false,
    health: 181,
    speed: 4.7,
  },
  'flag-zombie': {
    name: 'Flag Zombie',
    cost: 350,
    recharge: 30000,
    defaultLoaded: false,
    health: 181,
    speed: 3.7,
  },
  'conehead-zombie': {
    name: 'Conehead Zombie',
    cost: 125,
    recharge: 7500,
    defaultLoaded: false,
    health: [370, 181],
    speed: 4.7,
  },
  'pole-vaulting-zombie': {
    name: 'Pole Vaulting Zombie',
    cost: 175,
    recharge: 10000,
    defaultLoaded: false,
    health: 335,
    speed: [2.5, 4.7],
  },
  'buckethead-zombie': {
    name: 'Buckethead Zombie',
    cost: 250,
    recharge: 7500,
    defaultLoaded: false,
    health: [1100, 181],
    speed: 4.7,
  },
} as const

export const enum ZombieDamages {
  Eat = 100,
}

export type ZombieNames = keyof typeof ZOMBIE_DETAILS

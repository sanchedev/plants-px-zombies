import { ZOMBIE_DETAILS, ZombieNames } from '../../details/zombies.js'
import Game from '../../ge/game.js'
import { Node } from '../../ge/nodes/node.js'
import { Timer } from '../../ge/nodes/timer.js'
import { NodeOptions } from '../../ge/nodes/types.js'
import { Vector } from '../../ge/utils/vector.js'
import { row } from '../../lib/row.js'
import { tilePos } from '../../lib/tiles.js'
import { ZOMBIES } from '../zombies/index.js'
import { Zombie } from '../zombies/zombie.js'
import { ZombiesGroup } from './zombies-group.js'

export interface ZombieSpawnerOptions extends NodeOptions {
  waves: GroupPool[][]
  startTime?: number // default: 15s
}

export interface GroupPool {
  zombies: ZombieNames[]
  /**
   * It's the time to wait between zombie spawns.
   * @default 0
   * */
  timeToWaitBetweenSpawns?: number
  /**
   * It's the percentage of total life of the zombies to finish the group and spawn the next one.
   * @default 0.5
   * */
  percentageToFinish?: number
}

export class ZombieSpawner extends Node {
  waves: GroupPool[][]
  startTime: number

  constructor(options: ZombieSpawnerOptions) {
    super(options)
    this.waves = options.waves
    this.startTime = options.startTime ?? 15
  }

  start(): void {
    const startTimer = new Timer({
      duration: this.startTime,
    })
    startTimer.ev.on('finished', () => {
      this.spawnGroup()
    })
    this.addChild(startTimer)
    startTimer.play()

    super.start()
  }

  currentWaveIndex = 0
  currentGroupIndex = 0

  lastGroupIndex = -1

  spawnGroup() {
    const groupPool = this.waves[this.currentWaveIndex][this.currentGroupIndex]
    const isLastGroup =
      this.currentGroupIndex === this.waves[this.currentWaveIndex].length - 1

    const group = new ZombiesGroup({
      zombies: groupPool.zombies,
      timeToWaitBetweenSpawns: groupPool.timeToWaitBetweenSpawns,
      percentageToFinish: groupPool.percentageToFinish,
    })
    this.addChild(group)

    if (isLastGroup) {
      group.ev.on('finished', () => {
        this.nextWave()
      })
    } else {
      group.ev.on('canSpawnNextGroup', () => {
        this.currentGroupIndex++
        this.spawnGroup()
      })
    }
  }

  nextWave() {
    console.log('next wave')
  }
}

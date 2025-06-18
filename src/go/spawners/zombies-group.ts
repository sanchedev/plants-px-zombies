import { ZOMBIE_DETAILS, ZombieNames } from '../../details/zombies.js'
import { Vector } from '../../ge/utils/vector.js'
import { ZOMBIES } from '../zombies/index.js'
import { Zombie } from '../zombies/zombie.js'
import { tilePos } from '../../lib/tiles.js'
import { Node } from '../../ge/nodes/node.js'
import { NodeEvents, NodeOptions } from '../../ge/nodes/types.js'
import { EvListener } from '../../ge/utils/event-listener.js'
import Game from '../../ge/game.js'

interface GroupPool extends NodeOptions {
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

interface ZombiesGroupEvents extends NodeEvents {
  canSpawnNextGroup: () => void
  finished: () => void
}

export class ZombiesGroup extends Node {
  zombies: (ZombieNames | ZombieNames[])[]
  timeToWaitBetweenSpawns: number
  percentageToFinish: number

  constructor({
    zombies,
    timeToWaitBetweenSpawns = 0,
    percentageToFinish = 0.5,
    ...options
  }: GroupPool) {
    super(options)

    this.zombies = zombies
    this.timeToWaitBetweenSpawns = timeToWaitBetweenSpawns
    this.percentageToFinish = percentageToFinish

    this.totalHealth = [this.zombies].flat(2).reduce((acc, zombie) => {
      const z = ZOMBIE_DETAILS[zombie].health
      if (typeof z === 'number') return acc + z
      return z.reduce((acc, z) => acc + z, acc)
    }, 0)
  }

  ev = new EvListener<ZombiesGroupEvents>()

  currentZombieIndex = 0
  totalHealth = 0
  spawnedZombies: Zombie[] = []
  checked = false

  spawnZombies() {
    if (this.currentZombieIndex >= this.zombies.length) return

    const zombies = [this.zombies[this.currentZombieIndex]].flat()

    zombies.forEach((zombieName) => {
      this.spawnZombie(zombieName)
    })

    this.currentZombieIndex++
  }

  spawnZombie(name: ZombieNames) {
    const rowNumber = Math.floor(Math.random() * 5)

    const zombie = new ZOMBIES[name]({
      position: tilePos(9.5, rowNumber).add(new Vector(0, -2)),
    })

    this.spawnedZombies.push(zombie)

    Game.game.addNodeToLayer('row' + (rowNumber + 1) + '-zombies', zombie)
  }

  getZombiesHealth() {
    return this.spawnedZombies.reduce((acc, zombie) => {
      return zombie.health + acc
    }, 0)
  }

  checkIfCanSpawnNextGroup() {
    const zombiesHealth = this.getZombiesHealth()

    return zombiesHealth < this.totalHealth * this.percentageToFinish
  }

  timer = 0
  spawnFinished = false
  update(dt: number) {
    if (this.spawnFinished) {
      if (this.getZombiesHealth() <= 0) {
        this.ev._emit_('finished')
        this.destroy()
      }

      super.update(dt)
      return
    }

    this.timer += dt
    if (this.timer >= this.timeToWaitBetweenSpawns) {
      this.spawnZombies()
      this.timer -= this.timeToWaitBetweenSpawns
    }
    if (!this.checked && this.checkIfCanSpawnNextGroup()) {
      this.ev._emit_('canSpawnNextGroup')
      this.checked = true
    }
    if (this.currentZombieIndex >= this.zombies.length) {
      this.spawnFinished = true
    }

    super.update(dt)
  }
}

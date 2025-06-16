import { TILE_SIZE } from '../../constants.js'
import Game from '../../ge/game.js'
import { Node } from '../../ge/nodes/node.js'
import { Timer } from '../../ge/nodes/timer.js'
import { Vector } from '../../ge/utils/vector.js'
import { Sun } from '../ui/sun.js'

const APROX_SUN_SPAWN_TIME = 6
const VARIANCE_SUN_SPAWN_TIME = 1

export class SunSpawner extends Node {
  start(): void {
    const generateDuration = () => {
      return (
        Math.floor(Math.random() * 2 * VARIANCE_SUN_SPAWN_TIME + 1) -
        VARIANCE_SUN_SPAWN_TIME +
        APROX_SUN_SPAWN_TIME
      )
    }
    const timer = new Timer({
      duration: generateDuration(),
    })
    timer.ev.on('finished', () => {
      timer.duration = generateDuration()
      timer.play()
      this.spawnSun()
    })

    this.addChild(timer)
    timer.play()
    super.start()
  }

  spawnSun(): void {
    const sun = new Sun({
      position: new Vector(
        Math.floor(Math.random() * 4 * TILE_SIZE) + 8 + 3 * TILE_SIZE,
        -16
      ).add(this.globalPosition),
      fallingHeight:
        16 + Math.floor(Math.random() * 3 * TILE_SIZE) + 24 + TILE_SIZE,
    })
    Game.game.addNodeToLayer('playable-ui', sun)
  }
}

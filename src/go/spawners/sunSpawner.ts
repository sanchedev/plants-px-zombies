import { TILE_SIZE } from '../../constants.js'
import Game from '../../ge/game.js'
import { Node } from '../../ge/nodes/node.js'
import { Timer } from '../../ge/nodes/timer.js'
import { Vector } from '../../ge/utils/vector.js'
import { Sun } from '../ui/sun.js'

export class SunSpawner extends Node {
  start(): void {
    const generateDuration = () => {
      return Math.floor(Math.random() * 5) - 2 + 10 // from 8 to 12 seconds
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
        Math.floor(Math.random() * 7 * TILE_SIZE) + 8,
        -16
      ).add(this.globalPosition),
      fallingHeight:
        16 + Math.floor(Math.random() * 3 * TILE_SIZE) + 24 + TILE_SIZE,
    })
    Game.game.addNodeToLayer('ui', sun)
  }
}

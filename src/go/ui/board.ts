import { TILE_SIZE } from '../../constants.js'
import { PLANT_DETAILS } from '../../details/plants.js'
import { ZOMBIE_DETAILS } from '../../details/zombies.js'
import Game from '../../ge/game.js'
import { Box } from '../../ge/nodes/box.js'
import { MouseChecker } from '../../ge/nodes/mouseChecker.js'
import { Node } from '../../ge/nodes/node.js'
import { NodeOptions } from '../../ge/nodes/types.js'
import { Vector } from '../../ge/utils/vector.js'
import { PLANTS } from '../plants/index.js'
import { ZOMBIES } from '../zombies/index.js'
import { SeedContainer } from './seed-container.js'
import { SeedDetails, SeedItem } from './seed-item.js'

interface BoardOptions<T extends 'plants' | 'zombies'> extends NodeOptions {
  seedContainer: SeedContainer<T>
}

export class Board<T extends 'plants' | 'zombies'> extends Node {
  seedContainer: SeedContainer<T>

  constructor(options: BoardOptions<T>) {
    super(options)
    this.seedContainer = options.seedContainer
  }

  start(): void {
    const mouseChecker = new MouseChecker({})
    this.addChild(mouseChecker)

    const boxX = new Box({
      width: 9 * TILE_SIZE,
      height: TILE_SIZE,
      color: '#fff8',
    })

    const boxY = new Box({
      width: TILE_SIZE,
      height: 5 * TILE_SIZE,
      color: '#fff8',
    })

    this.addChild(boxX)
    this.addChild(boxY)

    mouseChecker.ev.on('move', (pos) => {
      const x =
        Math.min(
          8,
          Math.max(0, Math.floor((pos.x - this.position.x) / TILE_SIZE))
        ) * TILE_SIZE
      const y =
        Math.min(
          4,
          Math.max(0, Math.floor((pos.y - this.position.y) / TILE_SIZE))
        ) * TILE_SIZE

      boxX.position.y = y
      boxY.position.x = x
    })
    mouseChecker.ev.on('release', (pos) => {
      if (!this.#currentDetails) return

      const x = Math.floor((pos.x - this.position.x) / TILE_SIZE)
      const y = Math.floor((pos.y - this.position.y) / TILE_SIZE)

      if (x < 0 || x > 8 || y < 0 || y > 4) return

      const seed = this.seedContainer.children.find(
        (seed) => (seed as SeedItem<T>).details === this.#currentDetails
      ) as SeedItem<T>

      if (!seed.canUseSeed()) return

      seed.useSeed()
      const mayorObj = (
        this.seedContainer.type === 'plants' ? PLANTS : ZOMBIES
      ) as Record<string, new (options: NodeOptions) => Node>
      const detailsObj =
        this.seedContainer.type === 'plants' ? PLANT_DETAILS : ZOMBIE_DETAILS

      const key = Object.entries(detailsObj).find(
        ([_, value]) => value === seed.details
      )![0]

      Game.game.addNodeToLayer(
        'row' + (y + 1) + '-plants',
        new mayorObj[key]({
          position: new Vector(40 + x * TILE_SIZE, 24 + y * TILE_SIZE),
        })
      )
    })

    boxX.hidden = true
    boxY.hidden = true

    this.seedContainer.ev.on('changeSeed', (seed) => {
      if (seed != null) {
        boxX.hidden = false
        boxY.hidden = false
        this.#currentDetails = seed
      } else {
        boxX.hidden = true
        boxY.hidden = true
        this.#currentDetails = null
      }
    })

    super.start()
  }

  #currentDetails: SeedDetails<T> | null = null
}

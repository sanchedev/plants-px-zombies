import { BOARD_OFFSET, TILE_SIZE } from '../../constants.js'
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
import { SeedContainer } from './seed/seed-container.js'
import { SeedDetails, SeedItem } from './seed/seed-item.js'
import { Shovel } from './shovel.js'

interface PlantBoardOptions extends NodeOptions {
  seedContainer: SeedContainer<'plants'>
}

const planteds = new Map<`${number}-${number}`, Node>()

const padding = 2

export class PlantBoard extends Node {
  seedContainer: SeedContainer<'plants'>

  constructor(options: PlantBoardOptions) {
    super(options)
    this.seedContainer = options.seedContainer
  }

  start(): void {
    // Creating the pointer
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

    const hide = () => {
      if (!boxX.hidden) boxX.hidden = true
      if (!boxY.hidden) boxY.hidden = true
    }

    const show = () => {
      if (boxX.hidden) boxX.hidden = false
      if (boxY.hidden) boxY.hidden = false
    }

    mouseChecker.ev.on('move', (pos) => {
      if (this.#current == null) {
        hide()
        return
      }

      const x = Math.floor((pos.x - this.position.x) / TILE_SIZE)
      const y = Math.floor((pos.y - this.position.y) / TILE_SIZE)

      if (x < 0 || x > 8 || y < 0 || y > 4) {
        hide()
        return
      }

      if (this.#current === 'shovel' && !planteds.has(`${x}-${y}`)) {
        hide()
        return
      }
      if (this.#current === 'plant' && planteds.has(`${x}-${y}`)) {
        hide()
        return
      }

      show()

      boxX.position.y = y * TILE_SIZE
      boxY.position.x = x * TILE_SIZE
    })
    mouseChecker.ev.on('release', (pos) => {
      const x = Math.floor((pos.x - this.position.x) / TILE_SIZE)
      const y = Math.floor((pos.y - this.position.y) / TILE_SIZE)

      if (x < 0 || x > 8 || y < 0 || y > 4) return

      if (this.#current === 'plant') this.#plant(x, y)
      else if (this.#current === 'shovel') this.#useShovel(x, y)
    })

    boxX.hidden = true
    boxY.hidden = true

    this.seedContainer.ev.on('changeSeed', (seed) => {
      if (seed != null) {
        if (this.#current === 'shovel') Shovel.instance.deselect()
        this.#current = 'plant'
        this.#currentDetails = seed
      } else {
        if (this.#current !== 'shovel') this.#current = null
        this.#currentDetails = null
      }
    })
    Shovel.instance.ev.on('selected', () => {
      if (this.#current === 'plant' && this.#currentDetails != null) {
        this.#getSeed(this.#currentDetails).deselect()
      }

      this.#current = 'shovel'
      this.#currentDetails = null
    })
    Shovel.instance.ev.on('deselected', () => {
      if (this.#current !== 'shovel') return

      this.#current = null
    })

    super.start()
  }

  #currentDetails: SeedDetails<'plants'> | null = null
  #current: 'shovel' | 'plant' | null = null

  #getSeed(details: SeedDetails<'plants'>) {
    return this.seedContainer.children.find(
      (seed) => (seed as SeedItem<'plants'>).details === details
    ) as SeedItem<'plants'>
  }

  #plant(x: number, y: number) {
    if (!this.#currentDetails) return

    const seed = this.#getSeed(this.#currentDetails)

    if (!seed.canUseSeed()) return
    if (this.seedContainer.type === 'plants' && planteds.has(`${x}-${y}`))
      return

    seed.useSeed()
    const mayorObj = (
      this.seedContainer.type === 'plants' ? PLANTS : ZOMBIES
    ) as Record<string, new (options: NodeOptions) => Node>
    const detailsObj =
      this.seedContainer.type === 'plants' ? PLANT_DETAILS : ZOMBIE_DETAILS

    const key = Object.entries(detailsObj).find(
      ([_, value]) => value === seed.details
    )![0]

    const node = new mayorObj[key]({
      position: new Vector(x * TILE_SIZE, y * TILE_SIZE - padding).add(
        BOARD_OFFSET
      ),
    })

    if (this.seedContainer.type === 'plants') {
      planteds.set(`${x}-${y}`, node)
      node.ev.on('destroy', () => {
        planteds.delete(`${x}-${y}`)
      })
    }

    Game.game.addNodeToLayer('row' + (y + 1) + '-plants', node)
  }

  #useShovel(x: number, y: number) {
    const plant = planteds.get(`${x}-${y}`)
    if (!plant) return
    plant.destroy()
    Shovel.instance.deselect()
  }
}

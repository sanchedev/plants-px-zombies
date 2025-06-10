import { Node } from '../../../ge/nodes/node.js'
import { NodeEvents, NodeOptions } from '../../../ge/nodes/types.js'
import { EvListener } from '../../../ge/utils/event-listener.js'
import { SeedDetails, SeedItem } from './seed-item.js'

export interface SeedContainerOptions<T extends 'plants' | 'zombies'>
  extends NodeOptions {
  type: T
  seeds: SeedDetails<T>[]
}

interface SeedContainerEvents<T extends 'plants' | 'zombies'>
  extends NodeEvents {
  changeSeed: (seed: SeedDetails<T> | null) => void
}

export class SeedContainer<T extends 'plants' | 'zombies'> extends Node {
  type: T
  seeds: SeedDetails<T>[]

  static PLANTS: SeedContainer<'plants'> | null = null
  static ZOMBIES: SeedContainer<'zombies'> | null = null

  constructor(options: SeedContainerOptions<T>) {
    super(options)
    this.type = options.type
    this.seeds = options.seeds

    if (this.type === 'plants') {
      SeedContainer.PLANTS = this as SeedContainer<'plants'>
    } else if (this.type === 'zombies') {
      SeedContainer.ZOMBIES = this as SeedContainer<'zombies'>
    }
  }

  ev = new EvListener<SeedContainerEvents<T>>()

  start(): void {
    this.seeds.forEach((details, index) => {
      const seed = new SeedItem({ details })

      seed.position.y = index * 16

      seed.ev.on('selected', (_) => {
        const lastSeed = this.#currentSeed
        this.#currentSeed = seed
        if (lastSeed) lastSeed?.deselect()
        this.ev._emit_('changeSeed', seed.details)
      })
      seed.ev.on('deselected', (_) => {
        if (this.#currentSeed !== seed) return
        this.#currentSeed = null
        this.ev._emit_('changeSeed', null)
      })

      this.addChild(seed)
    })

    super.start()
  }

  #currentSeed: SeedItem<T> | null = null
}

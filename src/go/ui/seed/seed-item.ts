import { Clickable } from '../../../ge/nodes/clickable.js'
import { Node } from '../../../ge/nodes/node.js'
import { Timer } from '../../../ge/nodes/timer.js'
import { NodeEvents, NodeOptions } from '../../../ge/nodes/types.js'
import {
  AssetManager,
  AssetType,
  createAsset,
} from '../../../ge/utils/asset.js'
import { EvListener } from '../../../ge/utils/event-listener.js'
import { Vector } from '../../../ge/utils/vector.js'
import { SunCounter } from '../sun-counter.js'
import { SeedSprite } from './seedSprite.js'

createAsset(
  'plants/day',
  '/assets/sprites/ui/seeds/plants/day.png',
  AssetType.Image
)
createAsset(
  'plants/day-selected',
  '/assets/sprites/ui/seeds/plants/day-selected.png',
  AssetType.Image
)

export interface SeedDetails<T extends 'plants' | 'zombies'> {
  tag: `${T}/${'day' | 'night'}`
  index: number
  countSeeds: number
  cost: number
  recharge: number
  defaultLoaded: boolean
}

export interface SeedItemOptions<T extends 'plants' | 'zombies'>
  extends NodeOptions {
  details: SeedDetails<T>
}

export interface SeedItemEvents<T extends 'plants' | 'zombies'>
  extends NodeEvents {
  selected: (details: SeedDetails<T>) => void
  deselected: (details: SeedDetails<T>) => void
}

export class SeedItem<T extends 'plants' | 'zombies'> extends Node {
  details: SeedDetails<T>

  constructor(options: SeedItemOptions<T>) {
    super(options)
    this.details = options.details
  }

  start(): void {
    const sprite = new SeedSprite({
      sprite: AssetManager.get(this.details.tag)!,
      columns: this.details.countSeeds,
      frame: new Vector(this.details.index, 0),
      getRechargePercentage: () => this.timer / this.duration,
      getCanBuy: () => SunCounter.instance.count >= this.details.cost,
    }) // TODO: mod the sprite to show the recharge, and the cost

    this.sprite = sprite

    const clickable = new Clickable({
      normalSprite: sprite,
      size: new Vector(24, 16),
    })
    this.addChild(clickable)
    clickable.ev.on('click', () => {
      if (this.selected) this.deselect()
      else this.select()
    })

    if (this.details.defaultLoaded) this.timer = this.details.recharge / 1000

    this.duration = this.details.recharge / 1000

    super.start()
  }

  sprite!: SeedSprite
  timer: number = 0
  duration: number = 0

  ev = new EvListener<SeedItemEvents<T>>()

  selected = false

  select() {
    if (!this.canUseSeed()) return
    this.selected = true
    this.ev._emit_('selected', this.details)
    this.sprite.sprite = AssetManager.get(this.details.tag + '-selected')!
  }

  deselect() {
    this.selected = false
    this.ev._emit_('deselected', this.details)
    this.sprite.sprite = AssetManager.get(this.details.tag)!
  }

  canUseSeed() {
    return (
      SunCounter.instance.count >= this.details.cost &&
      this.timer >= this.duration
    )
  }

  useSeed() {
    this.deselect()
    this.timer = 0
    SunCounter.instance.count -= this.details.cost
  }

  update(dt: number): void {
    if (this.timer < this.duration) {
      this.timer += dt
      if (this.timer >= this.duration) {
        this.timer = this.duration
      }
    }

    super.update(dt)
  }
}

import { Clickable } from '../../../ge/nodes/clickable.js'
import { Node } from '../../../ge/nodes/node.js'
import { Sprite } from '../../../ge/nodes/sprite.js'
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
      rows: 4,
      frame: new Vector(this.details.index, 0),
      getRechargePercentage: () => this.timer / this.duration,
      getCanBuy: () => SunCounter.instance.count >= this.details.cost,
    })

    const hoverSprite = new Sprite({
      sprite: AssetManager.get(this.details.tag)!,
      columns: this.details.countSeeds,
      rows: 4,
      frame: new Vector(this.details.index, 1),
    })

    this.sprite = sprite

    const clickable = new Clickable({
      normalSprite: sprite,
      hoverSprite,
      size: new Vector(24, 16),
    })
    this.addChild(clickable)
    clickable.ev.on('click', () => {
      if (this.selected) this.deselect()
      else this.select()
    })

    this.clickable = clickable

    if (this.details.defaultLoaded) this.timer = this.details.recharge / 1000

    this.duration = this.details.recharge / 1000

    super.start()
  }

  clickable!: Clickable
  sprite!: SeedSprite
  timer: number = 0
  duration: number = 0

  ev = new EvListener<SeedItemEvents<T>>()

  selected = false

  select() {
    if (!this.canUseSeed()) return
    this.selected = true
    this.ev._emit_('selected', this.details)
    this.sprite.frame.y = 2
    this.clickable.hoverSprite!.frame.y = 3
  }

  deselect() {
    this.selected = false
    this.ev._emit_('deselected', this.details)
    this.sprite.frame.y = 0
    this.clickable.hoverSprite!.frame.y = 1
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

    if (this.canUseSeed() && this.clickable.disabled) {
      this.clickable.disabled = false
    } else if (!this.canUseSeed() && !this.clickable.disabled) {
      this.clickable.disabled = true
    }

    super.update(dt)
  }
}

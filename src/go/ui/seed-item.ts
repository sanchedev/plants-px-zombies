import { Clickable } from '../../ge/nodes/clickable.js'
import { Node } from '../../ge/nodes/node.js'
import { Sprite } from '../../ge/nodes/sprite.js'
import { Timer } from '../../ge/nodes/timer.js'
import { NodeEvents, NodeOptions } from '../../ge/nodes/types.js'
import { AssetManager, AssetType, createAsset } from '../../ge/utils/asset.js'
import { EvListener } from '../../ge/utils/event-listener.js'
import { Vector } from '../../ge/utils/vector.js'
import { SunCounter } from './sun-counter.js'

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
    const sprite = new Sprite({
      sprite: AssetManager.get(this.details.tag)!,
      columns: this.details.countSeeds,
      frame: new Vector(this.details.index, 0),
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

    const timer = new Timer({
      duration: this.details.recharge / 1000,
    })
    this.addChild(timer)
    timer.ev.on('finished', () => {
      this.readyToUse = true
    })
    this.rechargeTimer = timer
    this.readyToUse = this.details.defaultLoaded

    if (!this.readyToUse) timer.play()

    super.start()
  }

  sprite!: Sprite
  rechargeTimer!: Timer
  readyToUse = false

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
    this.rechargeTimer.play()
    this.sprite.sprite = AssetManager.get(this.details.tag)!
  }

  canUseSeed() {
    return SunCounter.instance.count >= this.details.cost && this.readyToUse
  }

  useSeed() {
    this.deselect()
    SunCounter.instance.count -= this.details.cost
  }
}

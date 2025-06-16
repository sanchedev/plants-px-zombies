import { Clickable } from '../../ge/nodes/clickable.js'
import { Node } from '../../ge/nodes/node.js'
import { Sprite } from '../../ge/nodes/sprite.js'
import { NodeEvents } from '../../ge/nodes/types.js'
import { AssetType, createAsset } from '../../ge/utils/asset.js'
import { EvListener } from '../../ge/utils/event-listener.js'
import { Vector } from '../../ge/utils/vector.js'

const shovelAsset = createAsset(
  'shovel',
  '/assets/sprites/ui/buttons/shovel.png',
  AssetType.Image
)

interface ShovelEvents extends NodeEvents {
  selected(): void
  deselected(): void
}

export class Shovel extends Node {
  static instance: Shovel

  start(): void {
    const spriteOptions = {
      sprite: shovelAsset,
      columns: 4,
    }

    const clickable = new Clickable({
      normalSprite: new Sprite({ ...spriteOptions, frame: new Vector(0, 0) }),
      hoverSprite: new Sprite({ ...spriteOptions, frame: new Vector(1, 0) }),
      size: new Vector(24, 16),
    })

    clickable.ev.on('click', () => {
      if (this.selected) this.deselect()
      else this.select()
    })

    this.addChild(clickable)
    this.clickable = clickable

    Shovel.instance = this

    super.start()
  }

  clickable!: Clickable

  ev = new EvListener<ShovelEvents>()

  selected: boolean = false

  select() {
    this.selected = true
    this.clickable.normalSprite.frame = new Vector(2, 0)
    this.clickable.hoverSprite!.frame = new Vector(3, 0)
    this.ev._emit_('selected')
  }

  deselect() {
    this.selected = false
    this.clickable.normalSprite.frame = new Vector(0, 0)
    this.clickable.hoverSprite!.frame = new Vector(1, 0)
    this.ev._emit_('deselected')
  }
}

import { Node } from '../../ge/nodes/node.js'
import { Sprite } from '../../ge/nodes/sprite.js'
import { Text } from '../../ge/nodes/text.js'
import { NodeOptions } from '../../ge/nodes/types.js'
import { AssetManager, AssetType, createAsset } from '../../ge/utils/asset.js'
import { Vector } from '../../ge/utils/vector.js'

createAsset(
  'sun-counter',
  '/assets/sprites/ui/sun-counter/sun-counter.png',
  AssetType.Image
)
createAsset(
  'sun-counter-bar',
  '/assets/sprites/ui/sun-counter/slider.png',
  AssetType.Image
)

export class SunCounter extends Node {
  static instance: SunCounter

  count: number = 2

  constructor(options: NodeOptions) {
    super(options)

    SunCounter.instance = this
  }

  start() {
    const sprite = new Sprite({
      sprite: AssetManager.get('sun-counter')!,
    })
    this.addChild(sprite)

    const text = new Text({
      text: '',
      textAlign: 'right',
      position: new Vector(26, 11),
    })

    sprite.addChild(text)
    this.text = text

    const bar = new Sprite({
      sprite: AssetManager.get('sun-counter-bar')!,
      position: new Vector(28, 3),
    })
    bar.hidden = true

    sprite.addChild(bar)
    this.bar = bar
  }

  text!: Text
  bar!: Sprite

  draw(dt: number): void {
    const txt = this.count.toString()

    if (txt.endsWith('.5')) {
      this.text.text = txt.slice(0, -2)
      this.bar.hidden = false
    } else {
      this.text.text = txt
      this.bar.hidden = true
    }

    super.draw(dt)
  }
}

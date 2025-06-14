import Game from '../../../ge/game.js'
import { Clickable } from '../../../ge/nodes/clickable.js'
import { Node, NodeProcess } from '../../../ge/nodes/node.js'
import { Sprite } from '../../../ge/nodes/sprite.js'
import { AssetType, createAsset } from '../../../ge/utils/asset.js'
import { Vector } from '../../../ge/utils/vector.js'

const pauseButtonAsset = createAsset(
  'pause-button',
  '/assets/sprites/ui/buttons/pause.png',
  AssetType.Image
)

export class PauseButton extends Node {
  process: NodeProcess = NodeProcess.NORMAL

  start(): void {
    const spriteOptions = {
      sprite: pauseButtonAsset,
      columns: 3,
    }

    const clickable = new Clickable({
      position: new Vector(0, 0),
      size: new Vector(14, 12),
      normalSprite: new Sprite({ ...spriteOptions, frame: new Vector(0, 0) }),
      hoverSprite: new Sprite({ ...spriteOptions, frame: new Vector(1, 0) }),
      pressedSprite: new Sprite({ ...spriteOptions, frame: new Vector(2, 0) }),
    })

    this.addChild(clickable)

    clickable.ev.on('click', () => {
      Game.game.isPaused = true
    })

    super.start()
  }
}

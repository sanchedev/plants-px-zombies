import Game from './ge/game.js'
import { Box } from './ge/nodes/box.js'
import { AssetManager } from './ge/utils/asset.js'
import { Vector } from './ge/utils/vector.js'
import { Peashooter } from './go/plants/peashooter.js'
import './setupAssets/image.js'

export async function setup() {
  await AssetManager.load(console.log)

  new Game({
    width: 192,
    height: 112,
    scale: 5,
    canvasId: 'game',
    debug: false,
  })

  Game.game.addLayer('example')

  Game.game.addNodeToLayer('example', new Box({ width: 10, height: 10 }))
  Game.game.addNodeToLayer(
    'example',
    new Box({ width: 24, height: 24, position: new Vector(10, 10) })
  )

  Game.game.addNodeToLayer(
    'example',
    new Peashooter({ position: new Vector(10, 10) })
  )

  Game.game.start()
}

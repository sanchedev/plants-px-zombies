import Game from './ge/game.js'
import { Sprite } from './ge/nodes/sprite.js'
import { AssetManager } from './ge/utils/asset.js'
import { Vector } from './ge/utils/vector.js'
import { setupLayers } from './setup/layers.js'
import './setup/image.js'
import { SunCounter } from './go/ui/sun-counter.js'
import { SeedContainer } from './go/ui/seed/seed-container.js'
import { PLANT_DETAILS } from './details/plants.js'
import { PlantBoard } from './go/ui/plant-board.js'
import { SunSpawner } from './go/spawners/sun-spawner.js'
import { tilePos } from './lib/tiles.js'
import { BOARD_OFFSET } from './constants.js'
import { PauseButton } from './go/ui/pause/pause-button.js'
import { PauseMenu } from './go/ui/pause/pause-menu.js'
import { Shovel } from './go/ui/shovel.js'
import { ZombieSpawner } from './go/spawners/zombie-spawner.js'

export async function setup() {
  await AssetManager.load(console.log)

  new Game({
    width: 192,
    height: 128,
    scale: 4,
    canvasId: 'game',
    debug: false,
    font: 'pxplant',
    fontSize: 8,
  })

  setupLayers()

  Game.game.addNodeToLayer(
    'ui',
    new SunCounter({
      position: new Vector(24, 0),
    })
  )

  Game.game.addNodeToLayer(
    'ui',
    new SeedContainer({
      type: 'plants',
      seeds: [
        PLANT_DETAILS.peashooter,
        PLANT_DETAILS.sunflower,
        PLANT_DETAILS['cherry-bomb'],
        PLANT_DETAILS['wall-nut'],
        PLANT_DETAILS.potatomine,
        PLANT_DETAILS.snowpea,
        PLANT_DETAILS.chomper,
        PLANT_DETAILS.repeater,
      ],
      position: new Vector(0, 0),
    })
  )

  Game.game.addNodeToLayer(
    'ui',
    new Shovel({
      position: new Vector(56, 0),
    })
  )

  Game.game.addNodeToLayer(
    'ui',
    new PlantBoard({
      seedContainer: SeedContainer.PLANTS!,
      position: tilePos(0, 0),
    })
  )

  Game.game.addNodeToLayer(
    'ui',
    new SunSpawner({
      position: new Vector(BOARD_OFFSET.x, 0),
    })
  )

  Game.game.addNodeToLayer(
    'ui',
    new PauseButton({ position: new Vector(176, 2) })
  )

  Game.game.addNodeToLayer(
    'background',
    new Sprite({ sprite: AssetManager.get('day-bg')!, scale: 2 })
  )

  Game.game.addNodeToLayer('ui', new PauseMenu({}))

  Game.game.addNodeToLayer(
    'ui',
    new ZombieSpawner({
      waves: [
        [
          {
            zombies: ['zombie'],
            timeToWaitBetweenSpawns: 1,
          },
        ],
      ],
    })
  )

  Game.game.start()
}

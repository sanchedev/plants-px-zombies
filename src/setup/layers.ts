import Game from '../ge/game.js'

export const enum Layers {
  Background = 'background',
  Row1Plants = 'row1-plants',
  Row1Zombies = 'row1-zombies',
  Row1Projectiles = 'row1-projectiles',
  Row2Plants = 'row2-plants',
  Row2Zombies = 'row2-zombies',
  Row2Projectiles = 'row2-projectiles',
  Row3Plants = 'row3-plants',
  Row3Zombies = 'row3-zombies',
  Row3Projectiles = 'row3-projectiles',
  Row4Plants = 'row4-plants',
  Row4Zombies = 'row4-zombies',
  Row4Projectiles = 'row4-projectiles',
  Row5Plants = 'row5-plants',
  Row5Zombies = 'row5-zombies',
  Row5Projectiles = 'row5-projectiles',

  PlayableUI = 'playable-ui',
  UI = 'ui',
}

export function setupLayers() {
  Game.game.addLayer(Layers.Background)
  Game.game.addLayer(Layers.Row1Plants)
  Game.game.addLayer(Layers.Row1Zombies)
  Game.game.addLayer(Layers.Row1Projectiles)
  Game.game.addLayer(Layers.Row2Plants)
  Game.game.addLayer(Layers.Row2Zombies)
  Game.game.addLayer(Layers.Row2Projectiles)
  Game.game.addLayer(Layers.Row3Plants)
  Game.game.addLayer(Layers.Row3Zombies)
  Game.game.addLayer(Layers.Row3Projectiles)
  Game.game.addLayer(Layers.Row4Plants)
  Game.game.addLayer(Layers.Row4Zombies)
  Game.game.addLayer(Layers.Row4Projectiles)
  Game.game.addLayer(Layers.Row5Plants)
  Game.game.addLayer(Layers.Row5Zombies)
  Game.game.addLayer(Layers.Row5Projectiles)

  Game.game.addLayer(Layers.PlayableUI)
  Game.game.addLayer(Layers.UI)
}

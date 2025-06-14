import { BOARD_OFFSET, TILE_SIZE } from '../constants.js'
import { Vector } from '../ge/utils/vector.js'

export function getTilePositionFromPosition(globalPosition: Vector) {
  const x = globalPosition.x - 40
  const y = globalPosition.y - 24
  return new Vector(x / TILE_SIZE + 1, y / TILE_SIZE + 1)
}

export function getPositionFromTilePosition(tilePosition: Vector) {
  const x = (tilePosition.x - 1) * TILE_SIZE
  const y = (tilePosition.y - 1) * TILE_SIZE
  return new Vector(x, y).add(BOARD_OFFSET)
}

export function tilePos(x: number, y: number) {
  return getPositionFromTilePosition(new Vector(x + 1, y + 1))
}

import Game from '../game.js'
import { AssetType, createAsset } from '../utils/asset.js'
import { Vector } from '../utils/vector.js'
import { Node } from './node.js'
import { TextOptions } from './types.js'

const charactersTexture = createAsset(
  'characters',
  '/assets/sprites/ui/characters.png',
  AssetType.Image
)
const charactersWidth = 3
const charactersHeight = 5
const spaceBetweenCharacters = 1
const characterSpaceWidth = 2

export class Text extends Node {
  text: string
  textAlign: 'left' | 'center' | 'right'

  constructor(options: TextOptions) {
    super(options)

    this.text = options.text
    this.textAlign = options.textAlign ?? 'left'
  }

  draw(dt: number): void {
    const { x, y } = this.globalPosition
    const { text, textAlign } = this
    const width = calculateTextWidth(text)
    let xPos = x
    if (textAlign === 'center') {
      xPos = x - width / 2
    } else if (textAlign === 'right') {
      xPos = x - width
    }

    for (const character of text) {
      const charWidth = getCharacterWidth(character)
      const charPos = getCharPos(character)

      const charIndex = text.indexOf(character)
      if (charIndex !== 0) xPos += spaceBetweenCharacters

      if (character === ' ') {
        xPos += characterSpaceWidth
        continue
      }

      Game.game.ctx.drawImage(
        charactersTexture.element,
        charPos.x,
        charPos.y,
        charWidth,
        charactersHeight,
        xPos,
        y,
        charWidth,
        charactersHeight
      )

      xPos += charWidth
    }
  }
}

function calculateTextWidth(text: string) {
  const characters = text.split('')
  let width = 0
  for (const character of characters) {
    const characterIndex = characters.indexOf(character)
    if (characterIndex !== 0) width += spaceBetweenCharacters
    width += getCharacterWidth(character)
  }
  return width
}

function getCharacterWidth(character: string) {
  if (character === ' ') return characterSpaceWidth
  if (character === 'm') return 5
  if (character === 'w') return 5
  if (character === 'n') return 5
  return charactersWidth
}

const characters = ['0123456789', 'abcdefghijklmnopqrstuvwxyz']
export function getCharPos(character: string) {
  const charIndex = characters[0].indexOf(character)
  if (charIndex !== -1) return new Vector(charIndex * 3, 0)

  const charIndex2 = characters[1].indexOf(character)
  if (charIndex2 === -1) return new Vector(0, 0)

  let x = 0
  for (let i = 0; i < charIndex2; i++) {
    x += getCharacterWidth(characters[1][i])
  }
  return new Vector(x, 5)
}

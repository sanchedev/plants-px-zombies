import { Camera } from './camera.js'
import { Node } from './nodes/node.js'

export interface GameOptions {
  width: number
  height: number
  canvasId: string
  scale?: number
  debug?: boolean
}

export default class Game {
  width: number
  height: number
  scale: number
  debug: boolean

  constructor({ width, height, scale, canvasId, debug }: GameOptions) {
    this.debug = debug ?? false

    this.width = width
    this.height = height
    this.scale = scale ?? 1
    this.canvas = document.getElementById(canvasId) as HTMLCanvasElement
    if (!this.canvas) {
      throw new Error('Canvas not found')
    }
    this.canvas.width = width * (scale ?? 1)
    this.canvas.height = height * (scale ?? 1)
    this.ctx = this.canvas.getContext('2d')!

    Game.game = this
  }

  canvas: HTMLCanvasElement
  ctx: CanvasRenderingContext2D

  static game: Game
  camera: Camera = new Camera()

  start(): void {
    this.ctx.scale(this.scale, this.scale)
    this.ctx.imageSmoothingEnabled = false
    this.ctx.imageSmoothingQuality = 'high'

    window.requestAnimationFrame(this.update.bind(this))
  }

  lastTimestamp: number = 0
  currentAnimationFrame: number | null = null
  update(timestamp: number): void {
    if (this.isPaused) return

    this.ctx.clearRect(0, 0, this.width, this.height)

    const dt = (timestamp - this.lastTimestamp) / 1000
    this.lastTimestamp = timestamp

    for (const layer of this.layerOrder) {
      for (const node of this.layers.get(layer)!) {
        const delta = node.timeRate * dt
        if (!node.hidden) node.draw(delta)
        node.update(delta)
      }
    }

    window.requestAnimationFrame(this.update.bind(this))
  }

  isPaused: boolean = false
  pause(): void {
    this.isPaused = true
  }
  resume(): void {
    this.isPaused = false
    window.requestAnimationFrame((timestamp) => {
      this.lastTimestamp = timestamp
      window.requestAnimationFrame(this.update.bind(this))
    })
  }

  layers = new Map<string, Node[]>()
  layerOrder: string[] = []

  addLayer(name: string): void {
    if (this.layers.has(name)) {
      throw new Error(`Layer ${name} already exists`)
    }
    this.layers.set(name, [])
    this.layerOrder.push(name)
  }
  removeLayer(name: string): void {
    if (!this.layers.has(name)) {
      throw new Error(`Layer ${name} does not exists`)
    }
    this.layers.get(name)!.forEach((node) => node.destroy())
    this.layers.delete(name)
    const index = this.layerOrder.indexOf(name)
    if (index !== -1) {
      this.layerOrder.splice(index, 1)
    }
  }
  getLayer(name: string): Node[] {
    if (!this.layers.has(name)) {
      throw new Error(`Layer ${name} does not exists`)
    }
    return this.layers.get(name)!
  }

  setLayerOrder(order: string[]): void {
    this.layerOrder = [
      ...order,
      ...this.layerOrder.filter((name) => !order.includes(name)),
    ]
  }

  getLayerOrder(): string[] {
    return [...this.layerOrder]
  }

  addNodeToLayer(name: string, node: Node): void {
    if (!this.layers.has(name)) {
      throw new Error(`Layer ${name} does not exists`)
    }
    this.layers.get(name)!.push(node)
    if (!node.started) node.start()
  }
  removeNodeFromLayer(name: string, node: Node): void {
    if (!this.layers.has(name)) {
      throw new Error(`Layer ${name} does not exists`)
    }
    const index = this.layers.get(name)!.indexOf(node)
    if (index !== -1) {
      this.layers.get(name)![index].destroy()
    }
  }
  findNodeLayer(node: Node): string | null {
    for (const [name, nodes] of this.layers) {
      if (nodes.includes(node)) {
        return name
      }
    }
    return null
  }
}

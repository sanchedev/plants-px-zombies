import Game from '../game.js'
import { EvListener } from '../utils/event-listener.js'
import { Vector } from '../utils/vector.js'
import { NodeEvents, NodeOptions, Nodes } from './types.js'

export class Node {
  position: Vector

  parent?: Node
  children: Node[]

  #destroyed: boolean = false
  get destroyed(): boolean {
    return this.#destroyed
  }

  constructor(options: NodeOptions) {
    this.position = options.position ?? Vector.ZERO
    this.children = options.children ?? []
  }

  /**
   * Event listener.
   *
   * @example
   * How to use:
   * ```ts
   * ev = new EvListener<MyNewNodeEvents>()
   * ```
   *
   * Your `MyNewNodeEvents` should be extending `NodeEvents`.
   */
  ev = new EvListener<NodeEvents>()

  get globalPosition(): Vector {
    return this.parent?.globalPosition?.add(this.position) ?? this.position
  }

  addChild(node: Node) {
    node.parent = this
    this.children.push(node)
  }

  removeChild(node: Node) {
    const index = this.children.indexOf(node)
    if (index !== -1) {
      this.children.splice(index, 1)
    }
    node.parent = undefined
  }

  findChildrenByType<T extends Node>(
    type: new (options: NodeOptions) => T
  ): T[] {
    return this.children
      .map((child) => {
        return [
          ...(child instanceof type ? [child] : []),
          ...child.findChildrenByType(type),
        ]
      })
      .flat()
  }

  getLayer(): string | null {
    if (this.parent != null) {
      return this.parent.getLayer()
    }
    return Game.game.findNodeLayer(this)
  }

  /**
   * Update logic.
   *
   * @example
   * How to use:
   * ```ts
   * update(dt: number) {
   *   // Here you can update the node
   *   super.update(dt)
   * }
   * ```
   *
   * Remember to call `super.update(dt)` to update the children and your node needs to be instance of `Node`.
   * */
  update(dt: number): void {
    this.ev._emit_('update', dt)
    this.children.forEach((child) => child.update(dt))
  }
  /**
   * Draw the node.
   *
   * @example
   * How to use:
   * ```ts
   * draw(dt: number) {
   *   // Here you can draw the node
   *   super.draw(dt)
   * }
   * ```
   *
   * Remember to call `super.draw(dt)` to draw the children and your node needs to be instance of `Node`.
   * */
  draw(dt: number): void {
    this.ev._emit_('draw', dt)
    this.children.forEach((child) => child.draw(dt))
  }
  /**
   * Destroy the node.
   *
   * @example
   * How to use:
   * ```ts
   * destroy() {
   *   // Here you can destroy the node
   *   super.destroy()
   * }
   * ```
   *
   * Remember to call `super.destroy()` to destroy the children and your node needs to be instance of `Node`.
   * */
  destroy(): void {
    this.#destroyed = true
    this.children.forEach((child) => child.destroy())
    const layer = Game.game.findNodeLayer(this)
    if (layer) {
      Game.game.layers
        .get(layer)!
        .splice(Game.game.layers.get(layer)!.indexOf(this), 1)
    }
    this.ev._emit_('destroy')
  }
}

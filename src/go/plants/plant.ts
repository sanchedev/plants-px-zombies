import { Node } from '../../ge/nodes/node.js'

export abstract class Plant extends Node {
  abstract health: number

  damage(damage: number) {
    this.health -= damage
    if (this.health <= 0) {
      this.destroy()
    }
  }
}

import { Node } from '../../ge/nodes/node.js'
import { NodeOptions } from '../../ge/nodes/types.js'

export abstract class Plant extends Node {
  abstract health: number

  constructor(options: NodeOptions) {
    super(options)
  }
}

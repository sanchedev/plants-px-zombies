import { Animation } from '../utils/animation.js'
import { Node } from './node.js'
import { TemporalAnimationOptions } from './types.js'

export class TemporalAnimation extends Node {
  animation: Animation

  constructor(options: TemporalAnimationOptions) {
    super(options)

    this.animation = options.animation
  }

  start(): void {
    this.animation.play()
    this.animation.ev.on('finished', () => {
      this.destroy()
    })
    super.start()
  }

  update(dt: number): void {
    this.animation.update(dt)
    super.update(dt)
  }

  destroy(): void {
    this.animation.stop()
    super.destroy()
  }
}

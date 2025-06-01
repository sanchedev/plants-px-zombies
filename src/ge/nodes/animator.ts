import { Animation } from '../utils/animation.js'
import { Node } from './node.js'
import { AnimatorOptions } from './types.js'

export class Animator extends Node {
  constructor(options: AnimatorOptions) {
    super(options)
  }

  animations = new Map<string, Animation>()
  current: Animation | null = null

  add(name: string, animation: Animation) {
    this.animations.set(name, animation)
  }

  play(name: string) {
    const anim = this.animations.get(name)
    if (!anim) return

    if (this.current && this.current !== anim) {
      this.current.stop()
    }

    this.current = anim
    this.current.play()
  }

  pause() {
    this.current?.pause()
  }

  stop() {
    this.current?.stop()
  }

  update(dt: number): void {
    this.current?.update(dt)
    super.update(dt)
  }

  draw(dt: number): void {
    super.draw(dt)
  }

  destroy(): void {
    this.stop()
    super.destroy()
  }
}

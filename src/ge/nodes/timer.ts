import { EvListener } from '../utils/event-listener.js'
import { Node } from './node.js'
import { TimerEvents, TimerOptions } from './types.js'

export class Timer extends Node {
  duration: number
  loop: boolean

  constructor(options: TimerOptions) {
    super(options)
    this.duration = options.duration
    this.loop = options.loop ?? false
  }

  ev = new EvListener<TimerEvents>()

  timer = 0
  #isRunning = false

  start(): void {
    this.timer = 0
    this.#isRunning = true
  }
  pause(): void {
    this.#isRunning = false
  }
  stop(): void {
    this.timer = 0
    this.#isRunning = false
  }

  update(dt: number): void {
    if (this.#isRunning) {
      this.timer += dt
      if (this.timer >= this.duration) {
        this.stop()
        this.ev._emit_('finished')
        if (this.loop) {
          this.start()
        }
      }
    }
    super.update(dt)
  }
}

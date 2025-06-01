import { EvListener } from './event-listener.js'

interface AnimationEvents {
  finished: () => void
}

type AnimationKeyframe = {
  time: number // ms
  action: () => void
}

export interface AnimationOptions {
  duration: number // ms
  keyframes: AnimationKeyframe[]
  loop?: boolean
}

export class Animation {
  private duration: number
  private keyframes: AnimationKeyframe[]
  private loop: boolean
  private playing = false
  private currentTime = 0
  private lastFrameIndex = -1

  constructor(options: AnimationOptions) {
    this.duration = options.duration
    this.keyframes = options.keyframes.sort((a, b) => a.time - b.time)
    this.loop = options.loop ?? false
  }

  play() {
    this.playing = true
  }

  pause() {
    this.playing = false
  }

  stop() {
    this.playing = false
    this.currentTime = 0
    this.lastFrameIndex = -1
  }

  update(dt: number) {
    if (!this.playing) return

    this.currentTime += dt * 1000 // convertir a ms

    // ejecutar keyframes que aún no se dispararon
    for (let i = this.lastFrameIndex + 1; i < this.keyframes.length; i++) {
      const kf = this.keyframes[i]
      if (this.currentTime >= kf.time) {
        kf.action()
        this.lastFrameIndex = i
      }
    }

    if (this.currentTime >= this.duration) {
      if (this.loop) {
        this.currentTime = 0
        this.lastFrameIndex = -1
      } else {
        this.stop()
        this.ev._emit_('finished')
      }
    }
  }

  ev = new EvListener<AnimationEvents>()
}

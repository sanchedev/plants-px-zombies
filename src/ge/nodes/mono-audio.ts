import { Asset, AssetType } from '../utils/asset.js'
import { EvListener } from '../utils/event-listener.js'
import { Node } from './node.js'
import { MonoAudioEvents, MonoAudioOptions } from './types.js'

export class MonoAudio extends Node {
  audio: Asset<AssetType.Audio>
  autoplay: boolean
  loop: boolean

  constructor(options: MonoAudioOptions) {
    super(options)
    this.audio = options.audio
    this.autoplay = options.autoplay ?? false
    this.loop = options.loop ?? false

    this.audioElement = new window.Audio(this.audio.path)

    this.audioElement.autoplay = this.autoplay
    this.audioElement.loop = this.loop

    this.audioElement.addEventListener('ended', () => {
      this.ev._emit_('ended')
    })
    this.audioElement.addEventListener('play', () => {
      this.ev._emit_('played')
      this.played = true
    })
  }

  audioElement: HTMLAudioElement

  ev = new EvListener<MonoAudioEvents>()

  played: boolean = false

  play() {
    this.audioElement.play()
  }
  pause() {
    this.audioElement.pause()
    this.ev._emit_('paused')
    this.played = false
  }
  stop() {
    this.audioElement.pause()
    this.audioElement.currentTime = 0
    this.ev._emit_('stopped')
    this.played = false
  }

  onPauseProcessing(): void {
    if (this.played) {
      this.audioElement.pause()
    }

    super.onPauseProcessing()
  }

  onResumeProcessing(): void {
    if (this.played) {
      this.audioElement.play()
    }

    super.onResumeProcessing()
  }
}

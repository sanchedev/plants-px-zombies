import { Asset, AssetType } from '../utils/asset.js'
import { randomInt } from '../utils/random.js'
import { Node } from './node.js'
import { MultiAudioOptions } from './types.js'

export class MultiAudio extends Node {
  audioVariants: Asset<AssetType.Audio>[]
  constructor(options: MultiAudioOptions) {
    super(options)
    this.audioVariants = [options.audio].flat()
  }

  audioList: HTMLAudioElement[] = []

  play() {
    const audio = new window.Audio(
      this.audioVariants[randomInt(0, this.audioVariants.length)].path
    )
    this.audioList.push(audio)
    audio.play()
    audio.addEventListener('ended', () => {
      this.audioList.splice(this.audioList.indexOf(audio), 1)
      audio.remove()
    })
  }

  onPauseProcessing(): void {
    this.audioList.forEach((audio) => audio.pause())

    super.onPauseProcessing()
  }

  onResumeProcessing(): void {
    this.audioList.forEach((audio) => audio.play())

    super.onResumeProcessing()
  }
}

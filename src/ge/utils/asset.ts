export enum AssetType {
  Image = 'image',
  Audio = 'audio',
}

type AssetElement<T extends AssetType> = T extends AssetType.Image
  ? HTMLImageElement
  : HTMLAudioElement

export class Asset<T extends AssetType> {
  path: string
  type: T
  element: AssetElement<T>

  constructor(path: string, type: T) {
    this.path = path
    this.type = type

    if (type === AssetType.Image) {
      this.element = new Image() as AssetElement<T>
    } else {
      this.element = new Audio() as AssetElement<T>
    }
  }

  loaded: boolean = false

  async load(): Promise<void> {
    await new Promise<void>((resolve, reject) => {
      this.element.onload = () => resolve()
      this.element.onloadeddata = () => resolve()
      this.element.onerror = () => reject()
      this.element.src = this.path
    })
    this.loaded = true
  }
}

export function createAsset<T extends AssetType>(
  id: string,
  path: string,
  type: T
) {
  const asset = new Asset(path, type)
  AssetManager.add(id, asset)
  return asset
}

export class AssetManager {
  static assets: Map<string, Asset<AssetType>> = new Map()

  static add(id: string, asset: Asset<AssetType>): void {
    if (this.assets.has(id)) {
      throw new Error(`Asset with id ${id} already exists`)
    }
    this.assets.set(id, asset)
  }

  static get<T extends AssetType>(id: string): Asset<T> | undefined {
    return this.assets.get(id) as Asset<T> | undefined
  }

  static async load(
    cb?: (loaded: number, total: number) => void
  ): Promise<void> {
    const assets = Array.from(this.assets.values())

    let loaded = 0
    const total = assets.length

    const loader = async (asset: Asset<AssetType>) => {
      await asset.load()
      loaded++
      if (cb) cb(loaded, total)
    }

    await Promise.all(assets.map(loader))
  }
}

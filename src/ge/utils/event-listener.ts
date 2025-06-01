export class EvListener<
  T extends { [K in keyof T]: (...args: any[]) => void }
> {
  #listeners: { [P in keyof T]?: T[P][] } = {}

  on<K extends keyof T>(event: K, callback: T[K]): void {
    if (!this.#listeners[event]) {
      this.#listeners[event] = []
    }
    this.#listeners[event].push(callback)
  }

  off<K extends keyof T>(event: K, callback: T[K]): void {
    if (!this.#listeners[event]) return
    const index = this.#listeners[event].indexOf(callback)
    if (index !== -1) {
      this.#listeners[event].splice(index, 1)
    }
  }

  _emit_<K extends keyof T>(event: K, ...args: Parameters<T[K]>): void {
    if (!this.#listeners[event]) return
    this.#listeners[event].forEach((callback) => callback(...args))
  }
}

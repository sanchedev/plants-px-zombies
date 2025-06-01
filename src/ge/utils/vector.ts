export class Vector {
  static get ZERO() {
    return new Vector(0, 0)
  }
  static get ONE() {
    return new Vector(1, 1)
  }
  static get UP() {
    return new Vector(0, -1)
  }
  static get DOWN() {
    return new Vector(0, 1)
  }
  static get LEFT() {
    return new Vector(-1, 0)
  }
  static get RIGHT() {
    return new Vector(1, 0)
  }

  x: number
  y: number

  constructor(x: number, y: number) {
    this.x = x
    this.y = y
  }

  add(vector: Vector) {
    return new Vector(this.x + vector.x, this.y + vector.y)
  }

  sub(vector: Vector) {
    return new Vector(this.x - vector.x, this.y - vector.y)
  }

  mult(vector: Vector) {
    return new Vector(this.x * vector.x, this.y * vector.y)
  }

  div(vector: Vector) {
    return new Vector(this.x / vector.x, this.y / vector.y)
  }
}

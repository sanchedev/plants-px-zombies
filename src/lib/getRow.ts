export function getRow(layer: string) {
  const row = Number(layer.split('-')[0].slice(-1))
  return row
}

export function row(number: number, type: 'plant' | 'zombie' | 'projectile') {
  return `row${number}-${type}s`
}

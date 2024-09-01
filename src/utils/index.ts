export const randomPick = <T>(items: T[]): T => {
  const randomIndex = Math.floor(Math.random() * items.length)
  return items[randomIndex]
}

export const hasItems = <T>(items: T[]): Boolean => {
  return items.length > 0
}

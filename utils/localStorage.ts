export function setItem<T = any>(key: string, value: T) {
  localStorage.setItem(key, JSON.stringify(value))
}
export function getItem<T = any>(key: string): T {
  return JSON.parse(localStorage.getItem(key) || 'null')
}
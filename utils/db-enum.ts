import { Category, CommandStatus } from '../types/db'

export const categories: Category[] = [
  Category.HOT_DRINKS,
  Category.COLD_DRINKS,
  Category.SWEET,
  Category.SALTY,
]

export const categoryNames: { [key: string]: string } = {
  HOT_DRINKS: 'Boissons chaudes',
  COLD_DRINKS: 'Boissons froides',
  SWEET: 'Sucré',
  SALTY: 'Salé',
}


export const commandStatus: CommandStatus[] = [
  CommandStatus.PENDING,
  CommandStatus.IN_PROGRESS,
  CommandStatus.DONE,
]

export const commandStatusNames: { [key: string]: string } = {
  PENDING: 'En attente',
  IN_PROGRESS: 'En cours',
  DONE: 'Terminée',
}

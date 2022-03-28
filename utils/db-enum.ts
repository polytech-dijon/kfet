import { Category, PaiementMethod } from '../types/db'

export const categories: Category[] = [
  Category.HOT_DRINKS,
  Category.COLD_DRINKS,
  Category.SWEET,
  Category.SALTY,
]

export const categoryNames: { [key: string]: string } = {
  HOT_DRINKS: 'Boissons chaude',
  COLD_DRINKS: 'Boissons froides',
  SWEET: 'Sucré',
  SALTY: 'Salé',
}

export const paiementMethods: PaiementMethod[] = [
  PaiementMethod.CASH,
  PaiementMethod.CARD,
  PaiementMethod.LYDIA,
]

export const paiementMethodsNames: { [key: string]: string } = {
  CARD: 'Carte bleue',
  CASH: 'Espèce',
  LYDIA: 'Lydia',
}


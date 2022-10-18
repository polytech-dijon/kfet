import { Prisma } from '@prisma/client'

export enum PaiementMethod {
  CASH = 'CASH',
  CARD = 'CARD',
  LYDIA = 'LYDIA',
}

export enum Category {
  HOT_DRINKS = 'HOT_DRINKS',
  COLD_DRINKS = 'COLD_DRINKS',
  SWEET = 'SWEET',
  SALTY = 'SALTY',
}

export enum CommandStatus {
  PENDING = 'PENDING',
  IN_PROGRESS = 'IN_PROGRESS',
  DONE = 'DONE',
}

export type Article = Prisma.ArticleGetPayload<{}>
export type Product = Prisma.ProductGetPayload<{}>
export type Sale = Prisma.SaleGetPayload<{}>
export type Command = Prisma.CommandGetPayload<{}>

type Identity<T> = { [P in keyof T]: T[P] }
type Replace<T, K extends keyof T, TReplace> = Identity<Pick<T, Exclude<keyof T, K>> & {
  [P in K]: TReplace
}>

export type IArticle = Replace<Article, 'sell_price', number>
export type IProduct = Replace<Product, 'buying_price', number>
export type ISale = Replace<Replace<Sale, 'sell_price', number>, 'buying_price', number>
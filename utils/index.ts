import { Prisma } from "@prisma/client";
import type { IArticle } from "../types/db";

export function Round(value: number, decimals: number = 2) {
  return Math.round((value + Number.EPSILON) * Math.pow(10, decimals)) / Math.pow(10, decimals)
}

export function mapPrismaItems(items: any[]) {
  return items.map((item) => {
    const result: any = { ...item }
    for (let key in item) {
      if (item[key] instanceof Prisma.Decimal)
        result[key] = item[key].toNumber()
      else if (item[key] instanceof Date)
        result[key] = item[key].getTime()
    }
    return result
  })
}

export function articlesById(articles: IArticle[]) {
  const cardById: { quantity: number, article: IArticle }[] = []
  for (let article of articles) {
    const found = cardById.find((a) => a.article.id === article.id)
    if (found)
      found.quantity++
    else {
      cardById.push({
        quantity: 1,
        article
      })
    }
  }
  return cardById
}
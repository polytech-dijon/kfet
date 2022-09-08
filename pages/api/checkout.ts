import { Prisma } from '@prisma/client'
import verifyJwt from '../../utils/verifyJwt'
import prisma from '../../prisma'
import type { NextApiRequest, NextApiResponse } from 'next'
import type { ApiResponse } from '../../types/api'
import type { IArticle, PaiementMethod } from '../../types/db'

export type PostCheckoutBody = {
  card: IArticle[];
  paiementMethod: PaiementMethod;
  priceAdjustment: number | null;
}
export type PostCheckoutResult = {}

export default async function handler(req: NextApiRequest, res: NextApiResponse<ApiResponse<PostCheckoutResult>>) {
  if (!verifyJwt({ req, res, verifyBodyData: true }))
    return

  const { card, paiementMethod, priceAdjustment }: PostCheckoutBody = req.body.data
  if (!card || !paiementMethod || (typeof priceAdjustment !== 'number' && priceAdjustment !== null))
    return res.status(400).json({ ok: false, error: 'Invalid data' })

  const originalProducts = await prisma.product.findMany({})

  const sellPrice = priceAdjustment !== null ? new Prisma.Decimal(priceAdjustment) : new Prisma.Decimal(card.map((item: IArticle) => item.sell_price).reduce((a, b) => a + b))
  const buyingPrice = new Prisma.Decimal(
    card.map((item: IArticle) => {
      return item.products.map((productId) => {
        const product = originalProducts.find((item) => item.id === productId)
        return product ? product.buying_price.toNumber() : 0
      }).reduce((a, b) => a + b, 0)
    }).reduce((a, b) => a + b, 0)
  )

  await prisma.sale.create({
    data: {
      paiement_method: paiementMethod,
      articles: card.map((item: IArticle) => item.id),
      sell_price: sellPrice,
      buying_price: buyingPrice,
    }
  })
  prisma.$disconnect()

  const products = card.map((item: IArticle) => item.products).flat()
  const differentProducts = [...new Set(products)]
  for (let productId of differentProducts) {
    await prisma.product.update({
      where: { id: productId },
      data: {
        quantity: {
          decrement: products.filter((item: number) => item === productId).length
        }
      }
    })
  }

  res.status(200).json({ ok: true, data: {} })
}
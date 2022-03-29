import { PrismaClient, Prisma } from '@prisma/client'
import verifyJwt from '../../utils/verifyJwt'
import type { NextApiRequest, NextApiResponse } from 'next'
import type { ApiResponse } from '../../types/api'
import type { IArticle, PaiementMethod } from '../../types/db'

export default async function handler(req: NextApiRequest, res: NextApiResponse<ApiResponse>) {
  if (!verifyJwt({ req, res, verifyBodyData: true }))
    return

  const { card, paiementMethod }: { card: IArticle[], paiementMethod: PaiementMethod } = req.body.data
  if (!card || !paiementMethod)
    return res.status(400).json({ ok: false, error: 'Invalid data' })

  const prisma = new PrismaClient()
  await prisma.sale.create({
    data: {
      paiement_method: paiementMethod,
      articles: card.map((item: IArticle) => item.id),
      sell_price: new Prisma.Decimal(card.map((item: IArticle) => item.sell_price).reduce((a: number, b: number) => a + b)),
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
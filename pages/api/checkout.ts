import jwt from 'jsonwebtoken'
import { PrismaClient, Prisma } from '@prisma/client'
import type { NextApiRequest, NextApiResponse } from 'next'
import type { ApiResponse } from '../../types/api'
import type { IArticle, PaiementMethod } from '../../types/db'

export default async function handler(req: NextApiRequest, res: NextApiResponse<ApiResponse>) {
  const { authorization } = req.headers
  if (!authorization)
    return res.status(400).json({ ok: false, error: 'No token provided' })

  const token = (authorization.match('JWT (.*)') || '')[1].trim()
  try {
    jwt.verify(token, process.env.JWT_SECRET || '')
  }
  catch {
    return res.status(400).json({ ok: false, error: 'Invalid token' })
  }

  const { card, paiementMethod }: { card: IArticle[], paiementMethod: PaiementMethod } = req.body
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
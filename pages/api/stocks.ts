import { Prisma } from '@prisma/client';
import prisma from '../../prisma'
import { mapPrismaItems } from '../../utils'
import verifyJwt from '../../utils/verifyJwt'
import type { NextApiRequest, NextApiResponse } from 'next'
import type { ApiResponse } from '../../types/api'
import type { IArticle, IProduct } from '../../types/db'

export type StocksData = {
  articles: IArticle[];
  products: IProduct[];
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<ApiResponse<StocksData | {}>>) {
  if (req.method === 'GET') {
    if (!verifyJwt({ req, res }))
      return

    const [articles, products] = await Promise.all([
      await prisma.article.findMany(),
      await prisma.product.findMany({
        orderBy: [
          {
            quantity: 'asc'
          },
        ],
      }),
    ])
    prisma.$disconnect()

    const data: StocksData = {
      articles: mapPrismaItems(articles),
      products: mapPrismaItems(products),
    }
    res.status(200).json({
      ok: true,
      data,
    })
  }
  else if (req.method === 'POST') {
    if (!verifyJwt({ req, res, verifyBodyData: true }))
      return

    const { product }: { product: IProduct } = req.body.data
    if (!product)
      return res.status(400).json({ ok: false, error: 'Invalid data' })

    await prisma.product.update({
      where: {
        id: product.id,
      },
      data: {
        name: product.name,
        quantity: product.quantity,
        buying_price: new Prisma.Decimal(product.buying_price),
      },
    })
    prisma.$disconnect()

    res.status(200).json({
      ok: true,
      data: {},
    })
  }
}
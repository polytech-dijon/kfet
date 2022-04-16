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

    res.status(200).json({
      ok: true,
      data: {
        articles: mapPrismaItems(articles),
        products: mapPrismaItems(products),
      },
    })
  }
  else if (req.method === 'POST') {
    if (!verifyJwt({ req, res, verifyBodyData: true }))
      return

    const { product } = req.body.data
    if (!product)
      return res.status(400).json({ ok: false, error: 'Invalid data' })

    console.log("update product", product)

    res.status(200).json({
      ok: true,
      data: {},
    })
  }
}
import prisma from '../../prisma'
import { mapPrismaItems } from '../../utils'
import verifyJwt from '../../utils/verifyJwt'
import type { NextApiRequest, NextApiResponse } from 'next'
import type { ApiResponse } from '../../types/api'
import type { IArticle, ISale, PaiementMethod } from '../../types/db'

export type GetSalesBody = {
  page: number;
  startDate: string | null;
  endDate: string | null;
  paiementMethod: PaiementMethod | null;
}
export type GetSalesResult = {
  articles: IArticle[];
  sales: ISale[];
  pageCount: number;
}
export type DeleteSalesBody = {
  id: number;
  updateStocks: boolean;
}
export type DeleteSalesResult = {}

export default async function handler(req: NextApiRequest, res: NextApiResponse<ApiResponse<GetSalesResult | DeleteSalesResult>>) {
  if (!verifyJwt({ req, res, verifyBodyData: true }))
    return

  if (req.method === 'POST') {

    const { page, startDate, endDate, paiementMethod }: GetSalesBody = req.body.data
    if (!Number.isInteger(page) || (typeof startDate !== 'string' && startDate !== null) || (typeof endDate !== 'string' && endDate !== null))
      return res.status(400).json({ ok: false, error: 'Invalid data' })

    const limit = 15
    let where: any = {}
    if (startDate) {
      const created_at = new Date(startDate)
      where.created_at = {
        gte: created_at,
      }
    }
    if (endDate) {
      const created_at = new Date(endDate)
      where.created_at = {
        ...(where.created_at || {}),
        lte: created_at,
      }
    }
    if (paiementMethod)
      where.paiement_method = paiementMethod

    const [articles, sales, saleCount] = await Promise.all([
      await prisma.article.findMany(),
      await prisma.sale.findMany({
        take: limit,
        skip: page * limit,
        orderBy: [
          {
            created_at: 'desc'
          },
        ],
        where,
      }),
      await prisma.sale.count({
        where,
      }),
    ])

    prisma.$disconnect()

    res.status(200).json({
      ok: true,
      data: {
        articles: mapPrismaItems(articles),
        sales: mapPrismaItems(sales),
        pageCount: Math.ceil(saleCount / limit),
      },
    })

  }
  else if (req.method === 'DELETE') {

    const { id, updateStocks }: DeleteSalesBody = req.body.data
    if (typeof id !== 'number' || typeof updateStocks !== 'boolean')
      return res.status(400).json({ ok: false, error: 'Invalid data' })

    const sale = await prisma.sale.findUnique({
      where: {
        id,
      },
    })
    if (!sale)
      return res.status(400).json({ ok: false, error: 'Invalid data' })

    if (updateStocks) {
      const articles = sale.articles
      const differentProducts = new Map<number, number>()
      for (let articleId of articles) {
        const article = await prisma.article.findUnique({
          where: { id: articleId },
        })
        if (article) {
          for (let productId of article.products)
            differentProducts.set(productId, (differentProducts.get(productId) ?? 0) + 1)
        }
      }
      for (let productId of differentProducts.keys()) {
        await prisma.product.update({
          where: { id: productId },
          data: {
            quantity: {
              increment: differentProducts.get(productId) ?? 0,
            },
          },
        })
      }
    }
    await prisma.sale.delete({
      where: {
        id,
      },
    })
    prisma.$disconnect()

    res.status(200).json({
      ok: true,
      data: {},
    })

  }
}
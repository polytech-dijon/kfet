import { PrismaClient } from '@prisma/client'
import { mapPrismaItems } from '../../utils'
import verifyJwt from '../../utils/verifyJwt'
import type { NextApiRequest, NextApiResponse } from 'next'
import type { ApiResponse } from '../../types/api'
import type { IArticle, ISale } from '../../types/db'

export type SalesData = {
  articles: IArticle[];
  sales: ISale[];
  pageCount: number;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<ApiResponse<SalesData>>) {
  if (!verifyJwt({ req, res, verifyBodyData: true }))
    return

  const { page, date }: { page: number, date: number | null } = req.body.data
  if (!Number.isInteger(page) || (typeof date !== 'string' && date !== null))
    return res.status(400).json({ ok: false, error: 'Invalid data' })

  const limit = 8
  let where = {}
  if (date) {
    const created_at = new Date(date);
    where = {
      created_at: {
        gte: created_at,
        lt: new Date(created_at.getTime() + 86400000)
      }
    }
  }

  const prisma = new PrismaClient()
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
    }
  })
}
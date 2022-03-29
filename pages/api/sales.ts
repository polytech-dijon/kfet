import jwt from 'jsonwebtoken'
import { PrismaClient } from '@prisma/client'
import { mapPrismaItems } from '../../utils'
import type { NextApiRequest, NextApiResponse } from 'next'
import type { ApiResponse } from '../../types/api'
import type { IArticle, ISale } from '../../types/db'

export type SalesData = {
  articles: IArticle[];
  sales: ISale[];
  pageCount: number;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<ApiResponse<SalesData>>) {
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

  const { data } = req.body
  if (!data)
    return res.status(400).json({ ok: false, error: 'Invalid data' })
  const { page, date }: { page: number, date: number | null } = data
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

  res.status(200).json({ ok: true, data: {
    articles: mapPrismaItems(articles),
    sales: mapPrismaItems(sales),
    pageCount: Math.ceil(saleCount / limit),
  } })
}
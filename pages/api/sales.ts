import prisma from '../../prisma'
import { mapPrismaItems } from '../../utils'
import verifyJwt from '../../utils/verifyJwt'
import type { NextApiRequest, NextApiResponse } from 'next'
import type { ApiResponse } from '../../types/api'
import type { IArticle, ISale, PaiementMethod } from '../../types/db'

export type SalesData = {
  articles: IArticle[];
  sales: ISale[];
  pageCount: number;
  resume: {
    priceResumeByPaiementMethod: { paiementMethod: PaiementMethod, price: number }[];
    resumeArticles: number[];
  };
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<ApiResponse<SalesData>>) {
  if (!verifyJwt({ req, res, verifyBodyData: true }))
    return

  const { page, date }: { page: number, date: number | null } = req.body.data
  if (!Number.isInteger(page) || (typeof date !== 'string' && date !== null))
    return res.status(400).json({ ok: false, error: 'Invalid data' })

  const limit = 15
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

  const priceResume = await prisma.sale.groupBy({
    by: ['paiement_method'],
    where,
    _sum: {
      sell_price: true,
    },
  })
  const priceResumeByPaiementMethod = priceResume.map((item) => ({
    paiementMethod: item.paiement_method as PaiementMethod,
    price: item._sum.sell_price?.toNumber() ?? 0,
  }))
  let resumeArticles: number[] = []
  if (date) {
    const articlesResume = await prisma.sale.findMany({
      where,
      select: {
        articles: true,
      }
    })
    resumeArticles = articlesResume.map((item) => item.articles).flat()
  }

  res.status(200).json({
    ok: true,
    data: {
      articles: mapPrismaItems(articles),
      sales: mapPrismaItems(sales),
      pageCount: Math.ceil(saleCount / limit),
      resume: {
        priceResumeByPaiementMethod,
        resumeArticles,
      },
    }
  })
}
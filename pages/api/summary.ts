import prisma from '../../prisma'
import { mapPrismaItems } from '../../utils'
import verifyJwt from '../../utils/verifyJwt'
import type { NextApiRequest, NextApiResponse } from 'next'
import type { ApiResponse } from '../../types/api'
import type { IArticle, PaiementMethod } from '../../types/db'

export type GetSummaryBody = {
  date: string | null;
}
export type GetSummaryResult = {
  articles: IArticle[];
  priceSummaryByPaiementMethod: { paiementMethod: PaiementMethod, price: number }[];
  summaryArticles: number[];
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<ApiResponse<GetSummaryResult>>) {
  if (!verifyJwt({ req, res, verifyBodyData: true }))
    return

  if (req.method === 'POST') {

    const { date }: GetSummaryBody = req.body.data
    if (typeof date !== 'string' && date !== null)
      return res.status(400).json({ ok: false, error: 'Invalid data' })

    let where = {}
    if (date) {
      const created_at = new Date(date)
      where = {
        created_at: {
          gte: created_at,
          lt: new Date(created_at.getTime() + 86400000),
        },
      }
    }

    const [articles, priceResume] = await Promise.all([
      prisma.article.findMany(),
      prisma.sale.groupBy({
        by: ['paiement_method'],
        where,
        _sum: {
          sell_price: true,
        },
      })
    ])

    const priceResumeByPaiementMethod = priceResume.map((item) => ({
      paiementMethod: item.paiement_method as PaiementMethod,
      price: item._sum.sell_price?.toNumber() ?? 0,
    }))
    let summaryArticles: number[] = []
    if (date) {
      const articlesResume = await prisma.sale.findMany({
        where,
        select: {
          articles: true,
        },
      })
      summaryArticles = articlesResume.map((item) => item.articles).flat()
    }

    prisma.$disconnect()

    res.status(200).json({
      ok: true,
      data: {
        articles: mapPrismaItems(articles),
        priceSummaryByPaiementMethod: priceResumeByPaiementMethod,
        summaryArticles,
      },
    })

  }
}
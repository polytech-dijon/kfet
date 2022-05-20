import prisma from '../../prisma'
import { mapPrismaItems } from '../../utils'
import verifyJwt from '../../utils/verifyJwt'
import type { NextApiRequest, NextApiResponse } from 'next'
import type { ApiResponse } from '../../types/api'
import type { IArticle, PaiementMethod } from '../../types/db'

export type GetSummaryBody = {
  startDate: string | null;
  endDate: string | null;
}
export type GetSummaryResult = {
  articles: IArticle[];
  sellPriceSummaryByPaiementMethod: { paiementMethod: PaiementMethod, price: number }[];
  buyingPriceSummaryByPaiementMethod: { paiementMethod: PaiementMethod, price: number }[];
  summaryArticles: number[];
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<ApiResponse<GetSummaryResult>>) {
  if (!verifyJwt({ req, res, verifyBodyData: true }))
    return

  if (req.method === 'POST') {

    const { startDate, endDate }: GetSummaryBody = req.body.data
    if ((typeof startDate !== 'string' && startDate !== null) && (typeof endDate !== 'string' && endDate !== null))
      return res.status(400).json({ ok: false, error: 'Invalid data' })

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

    const [articles, sellPriceSummary, buyingPriceSummary] = await Promise.all([
      prisma.article.findMany(),
      prisma.sale.groupBy({
        by: ['paiement_method'],
        where,
        _sum: {
          sell_price: true,
        },
      }),
      prisma.sale.groupBy({
        by: ['paiement_method'],
        where,
        _sum: {
          buying_price: true,
        },
      })
    ])

    const sellPriceSummaryByPaiementMethod = sellPriceSummary.map((item) => ({
      paiementMethod: item.paiement_method as PaiementMethod,
      price: item._sum.sell_price?.toNumber() ?? 0,
    }))

    const salesCount = sellPriceSummaryByPaiementMethod.reduce((acc, sale) => acc + 1, 0)
    let summaryArticles: number[] = []
    if (salesCount > 0 && salesCount < 25) {
      const articlesResume = await prisma.sale.findMany({
        where,
        select: {
          articles: true,
        },
      })
      summaryArticles = articlesResume.map((item) => item.articles).flat()
    }

    const buyingPriceSummaryByPaiementMethod = buyingPriceSummary.map((item) => ({
      paiementMethod: item.paiement_method as PaiementMethod,
      price: item._sum.buying_price?.toNumber() ?? 0,
    }))

    prisma.$disconnect()

    res.status(200).json({
      ok: true,
      data: {
        articles: mapPrismaItems(articles),
        sellPriceSummaryByPaiementMethod,
        buyingPriceSummaryByPaiementMethod,
        summaryArticles,
      },
    })

  }
}
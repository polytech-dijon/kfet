import prisma from '../../../prisma'
import { Round, mapPrismaItems, articlesById } from '../../../utils'
import verifyJwt from '../../../utils/verifyJwt'
import { paiementMethodsNames } from '../../../utils/db-enum'
import type { NextApiRequest, NextApiResponse } from 'next'
import type { ApiResponse } from '../../../types/api'
import type { Sale, ISale, PaiementMethod, IArticle } from '../../../types/db'

export type GetSalesExportBody = {
  startDate: string | null;
  endDate: string | null;
  paiementMethod: PaiementMethod | null;
}
export type GetSalesExportResult = string

export default async function handler(req: NextApiRequest, res: NextApiResponse<ApiResponse<GetSalesExportResult>>) {
  if (!verifyJwt({ req, res, verifyBodyData: true }))
    return

  if (req.method === 'POST') {

    const { startDate, endDate, paiementMethod }: GetSalesExportBody = req.body.data
    if ((typeof startDate !== 'string' && startDate !== null) || (typeof endDate !== 'string' && endDate !== null))
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
    if (paiementMethod)
      where.paiement_method = paiementMethod

    const [sales, articles] = await Promise.all([
      await prisma.sale.findMany({
        orderBy: [
          {
            created_at: 'asc'
          },
        ],
        where,
      }),
      await prisma.article.findMany(),
    ])

    prisma.$disconnect()

    const columns = ['ID de la vente', 'Articles', 'Moyen de paiement', 'Prix de vente', 'Prix d\'achat', 'Date de vente']
    const items = mapPrismaItems<Sale, ISale>(sales).map((sale) => {
      const items = [
        sale.id,
        `"${formatSaleArticles(sale.articles, mapPrismaItems(articles)).join(', ')}"`,
        paiementMethodsNames[sale.paiement_method],
        Round(sale.buying_price),
        Round(sale.sell_price),
        new Date(sale.created_at).toLocaleString("fr-FR").replaceAll(',', ''),
      ]
      return items.join(',')
    }).join('\n')
    const result = `${columns.join(',')}\n${items}`

    res.status(200).json({
      ok: true,
      data: result,
    })

  }
}

function formatSaleArticles(saleArticlesId: number[], articles: IArticle[]): string[] {
  const saleArticlesMapped: IArticle[] = saleArticlesId.map((articleId) => articles.find((a) => a.id === articleId) as IArticle)
  const cardById = articlesById(saleArticlesMapped)
  return cardById.sort((a, b) => b.quantity - a.quantity).map(({ quantity, article }) => `${quantity} ${article.name}`)
}
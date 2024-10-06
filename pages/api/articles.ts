import { Prisma } from '@prisma/client';
import prisma from '../../prisma'
import { mapPrismaItems } from '../../utils'
import verifyJwt from '../../utils/verifyJwt'
import type { NextApiRequest, NextApiResponse } from 'next'
import type { ApiResponse } from '../../types/api'
import type { IArticle } from '../../types/db'

export type GetArticlesResult = {
  articles: IArticle[];
}
export type PutArticlesBody = {
  article: IArticle;
}
export type PutArticlesResult = {}
export type DeleteArticlesBody = {
  id: number;
}
export type DeleteArticlesResult = {}
export type PostArticlesBody = {
  article: Partial<IArticle>;
}
export type PostArticlesResult = {}

export default async function handler(req: NextApiRequest, res: NextApiResponse<ApiResponse<GetArticlesResult | PutArticlesResult>>) {
  if (req.method === 'GET') {

    if (!verifyJwt({ req, res }))
      return

    const [articles] = await Promise.all([
      prisma.article.findMany({
        where: {
          deleted: false
        },
        orderBy: [
          {
            category: 'asc',
          },
          {
            name: 'asc',
          },
        ],
      }),
    ])
    prisma.$disconnect()

    const data: GetArticlesResult = {
      articles: mapPrismaItems(articles),
    }
    res.status(200).json({
      ok: true,
      data,
    })

  }
  else if (req.method === 'PUT') {

    if (!verifyJwt({ req, res, verifyBodyData: true }))
      return

    const { article }: PutArticlesBody = req.body.data
    if (!article)
      return res.status(400).json({ ok: false, error: 'Invalid data' })

    await prisma.article.update({
      where: {
        id: article.id,
      },
      data: {
        name: article.name,
        category: article.category,
        sell_price: new Prisma.Decimal(article.sell_price)
      },
    })
    prisma.$disconnect()

    res.status(200).json({
      ok: true,
      data: {},
    })

  }
  else if (req.method === 'DELETE') {

    if (!verifyJwt({ req, res, verifyBodyData: true }))
      return

    const { id }: DeleteArticlesBody = req.body.data
    if (typeof id !== 'number')
      return res.status(400).json({ ok: false, error: 'Invalid data' })

    await prisma.article.update({
      where: {
        id,
      },
      data: {
        deleted: true,
      },
    })
    prisma.$disconnect()

    res.status(200).json({
      ok: true,
      data: {},
    })

  }
  else if (req.method === 'POST') {

    if (!verifyJwt({ req, res, verifyBodyData: true }))
      return

    const { article }: PostArticlesBody = req.body.data
    if (!article)
      return res.status(400).json({ ok: false, error: 'Invalid data' })

    await prisma.article.create({
      data: {
        ...(article as IArticle),
      },
    })
    prisma.$disconnect()

    res.status(200).json({
      ok: true,
      data: {},
    })

  }
}
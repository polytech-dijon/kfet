import { Prisma } from '@prisma/client';
import prisma from '../../prisma'
import { mapPrismaItems } from '../../utils'
import verifyJwt from '../../utils/verifyJwt'
import type { NextApiRequest, NextApiResponse } from 'next'
import type { ApiResponse } from '../../types/api'
import type { IArticle, IProduct } from '../../types/db'

export type GetStocksResult = {
  products: IProduct[];
}
export type PutStocksBody = {
  product: IProduct;
}
export type PutStocksResult = {}
export type DeleteStocksBody = {
  id: number;
}
export type DeleteStocksResult = {}
export type PostStocksBody = {
  product: Partial<IProduct>;
}
export type PostStocksResult = {}

export default async function handler(req: NextApiRequest, res: NextApiResponse<ApiResponse<GetStocksResult | PutStocksResult>>) {
  if (req.method === 'GET') {

    if (!verifyJwt({ req, res }))
      return

    const products = await prisma.product.findMany({
      where: {
        deleted: false
      },
      orderBy: [
        {
          quantity: 'asc'
        },
      ],
    })
    prisma.$disconnect()

    const data: GetStocksResult = {
      products: mapPrismaItems(products),
    }
    res.status(200).json({
      ok: true,
      data,
    })

  }
  else if (req.method === 'PUT') {

    if (!verifyJwt({ req, res, verifyBodyData: true }))
      return

    const { product }: PutStocksBody = req.body.data
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
  else if (req.method === 'DELETE') {

    if (!verifyJwt({ req, res, verifyBodyData: true }))
      return

    const { id }: DeleteStocksBody = req.body.data
    if (typeof id !== 'number')
      return res.status(400).json({ ok: false, error: 'Invalid data' })

    const articles = await prisma.article.findMany({})

    for (let article of articles) {
      if (article.products.includes(id)) {
        await prisma.article.update({
          where: {
            id: article.id,
          },
          data: {
            products: article.products.filter((product) => product !== id),
          },
        })
      }
    }

    await prisma.product.update({
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

    const { product }: PostStocksBody = req.body.data
    if (!product)
      return res.status(400).json({ ok: false, error: 'Invalid data' })

    await prisma.product.create({
      data: {
        ...(product as IProduct),
      },
    })
    prisma.$disconnect()

    res.status(200).json({
      ok: true,
      data: {},
    })

  }
}
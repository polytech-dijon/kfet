import fetch from 'isomorphic-unfetch'
import { Prisma } from '@prisma/client'
import verifyJwt from '../../utils/verifyJwt'
import prisma from '../../prisma'
import { EsipayPaiementResponseStatus } from '../../services/esipay'
import type { NextApiRequest, NextApiResponse } from 'next'
import type { ApiResponse } from '../../types/api'
import { IArticle, PaiementMethod } from '../../types/db'

export type PostCheckoutBody = {
  card: IArticle[];
  paiementMethod: PaiementMethod;
  priceAdjustment: number | null;
  idEsipay: string | null;
}
export type PostCheckoutResult = {
  paiementResponseStatus?: EsipayPaiementResponseStatus;
  newBalance?: number;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<ApiResponse<PostCheckoutResult>>) {
  if (!verifyJwt({ req, res, verifyBodyData: true }))
    return

  const { card, paiementMethod, priceAdjustment, idEsipay }: PostCheckoutBody = req.body.data
  if (!card || !paiementMethod || (typeof priceAdjustment !== 'number' && priceAdjustment !== null))
    return res.status(400).json({ ok: false, error: 'Invalid data' })
  if (paiementMethod === PaiementMethod.ESIPAY && !idEsipay)
    return res.status(400).json({ ok: false, error: 'Invalid data' })

  const originalProducts = await prisma.product.findMany({})

  const sellPrice = priceAdjustment !== null ? new Prisma.Decimal(priceAdjustment) : new Prisma.Decimal(card.map((item: IArticle) => item.sell_price).reduce((a, b) => a + b))
  const buyingPrice = new Prisma.Decimal(
    card.map((item: IArticle) => {
      return item.products.map((productId) => {
        const product = originalProducts.find((item) => item.id === productId)
        return product ? product.buying_price.toNumber() : 0
      }).reduce((a, b) => a + b, 0)
    }).reduce((a, b) => a + b, 0)
  )

  const data: PostCheckoutResult = paiementMethod === PaiementMethod.ESIPAY ? await makeEsipayPaiement(idEsipay!, sellPrice.toNumber()) : {}

  await prisma.sale.create({
    data: {
      paiement_method: paiementMethod,
      articles: card.map((item: IArticle) => item.id),
      sell_price: sellPrice,
      buying_price: buyingPrice,
    }
  })
  prisma.$disconnect()

  const products = card.map((item: IArticle) => item.products).flat()
  const differentProducts = [...new Set(products)]
  for (let productId of differentProducts) {
    await prisma.product.update({
      where: { id: productId },
      data: {
        quantity: {
          decrement: products.filter((item: number) => item === productId).length
        }
      }
    })
  }

  res.status(200).json({ ok: true, data })
}

async function makeEsipayPaiement(idEsipay: string, amount: number): Promise<PostCheckoutResult> {
  try {
    const entity = await fetch(`${process.env.ESIPAY_API_URL}/api/entity/from-esipay-id/${encodeURIComponent(idEsipay)}`, {
      headers: {
        'Authorization': `Bearer ${process.env.ESIPAY_API_KEY}`,
      },
    }).then((res: any) => res.json())
    if (!entity || entity.code === "NOT_FOUND") return { paiementResponseStatus: EsipayPaiementResponseStatus.UNKNOWN_CARD }
    else if (entity.code) return { paiementResponseStatus: EsipayPaiementResponseStatus.UNKNOWN_ERROR }

    const payment = await fetch(`${process.env.ESIPAY_API_URL}/api/entity/${entity.data.id}/payments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.ESIPAY_API_KEY}`,
      },
      body: JSON.stringify({
        data: {
          amount,
          toId: process.env.ESIPAY_PAYMENT_RECEIVER_ID,
          description: "Paiement à la KFET",
        },
      }),
    }).then((res: any) => res.json())

    if (payment.code === "NOT_FOUND") return { paiementResponseStatus: EsipayPaiementResponseStatus.UNKNOWN_CARD }
    else if (payment.code === "NOT_ALLOWED") return { paiementResponseStatus: EsipayPaiementResponseStatus.NOT_ENOUGH_MONEY, newBalance: entity.data.balance }
    else if (payment.code) return { paiementResponseStatus: EsipayPaiementResponseStatus.UNKNOWN_ERROR }

    return {
      paiementResponseStatus: EsipayPaiementResponseStatus.OK,
      newBalance: entity.data.balance - amount,
    }
  }
  catch (e) {
    return { paiementResponseStatus: EsipayPaiementResponseStatus.UNKNOWN_ERROR }
  }
}
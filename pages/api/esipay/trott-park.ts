import fetch from 'isomorphic-unfetch'
import type { NextApiRequest, NextApiResponse } from 'next'
import type { ApiResponse } from '../../../types/api'

export default async function handler(req: NextApiRequest, res: NextApiResponse<ApiResponse>) {
  if (req.method !== 'POST')
    return res.status(400).json({ ok: false, error: 'Invalid method' })

  const { idEsipay } = req.body
  if (!idEsipay)
    return res.status(400).json({ ok: false, error: 'No id provided' })

  const entity = await fetch(`${process.env.ESIPAY_API_URL}/api/entity/from-esipay-id/${idEsipay}`, {
    headers: {
      'Authorization': `Bearer ${process.env.ESIPAY_API_KEY}`,
    },
  }).then((res) => res.json())

  if (!entity || !entity.ok)
    return res.status(400).json({ ok: false, error: 'Invalid id' })

  console.log(entity.data)

  if (entity.data.trottParkPayed)
    return res.status(400).json({ ok: false, error: 'Already registered' })

  const reqResponse = await fetch(`${process.env.ESIPAY_API_URL}/api/entity/${entity.data.id}`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${process.env.ESIPAY_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      data: {
        trottParkPayed: true,
      },
    })
  }).then((res) => res.json())

  console.log(`${process.env.ESIPAY_API_URL}/api/entity/${entity.data.id}`, reqResponse)
  if (!reqResponse || !reqResponse.ok)
    return res.status(400).json({ ok: false, error: 'Error while updating' })

  res.status(200).json({ ok: true, data: {} })
}

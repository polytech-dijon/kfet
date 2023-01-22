import fetch from 'isomorphic-unfetch'
import type { NextApiRequest, NextApiResponse } from 'next'
import type { ApiResponse } from '../../../types/api'
import findUBName from '../../../utils/findUBName'

export type EsipayCardData = {
  idEsipay: string,
  firstname: string,
  lastname: string,
  timestamp: number,
  idUb: string
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<ApiResponse<EsipayCardData>>) {
  if (req.method !== 'POST')
    return res.status(400).json({ ok: false, error: 'Invalid method' })

  const { password } = req.body
  if (password !== process.env.ESIPAY_PASSWORD)
    return res.status(400).json({ ok: false, error: 'Invalid password' })

  const { idUb } = req.body
  if (!idUb)
    return res.status(400).json({ ok: false, error: 'No id provided' })

  const userData = await findUBName(idUb)
  if (!userData || userData.id !== idUb)
    return res.status(400).json({ ok: false, error: 'Invalid id' })

  const entity = await fetch(`${process.env.ESIPAY_API_URL}/api/entity/${idUb}/register`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.ESIPAY_API_KEY}`,
    },
  }).then((res) => res.json())

  if (!entity || !entity.ok || !entity.data?.idEsipay)
    return res.status(400).json({ ok: false, error: 'Invalid id' })

  const data: EsipayCardData = {
    idEsipay: entity.data.idEsipay,
    firstname: entity.data.name.split(' ')[0],
    lastname: entity.data.name.split(' ').slice(1).join(' '),
    timestamp: Date.now(),
    idUb: entity.data.id
  }

  res.status(200).json({ ok: true, data })
}

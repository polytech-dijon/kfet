import type { NextApiRequest, NextApiResponse } from 'next'
import type { ApiResponse } from '../../../types/api'

export default async function handler(req: NextApiRequest, res: NextApiResponse<ApiResponse>) {
  const { password } = req.body
  if (!password)
    return res.status(400).json({ ok: false, error: 'No password provided' })

  if (password !== process.env.ESIPAY_PASSWORD)
    return res.status(400).json({ ok: false, error: 'Invalid password' })

  res.status(200).json({ ok: true, data: {} })
}

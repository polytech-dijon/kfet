import verifyJwt from '../../utils/verifyJwt'
import type { NextApiRequest, NextApiResponse } from 'next'
import type { ApiResponse } from '../../types/api'

export default async function handler(req: NextApiRequest, res: NextApiResponse<ApiResponse>) {
  if (!verifyJwt({ req, res }))
    return

  res.status(200).json({ ok: true, data: {} })
}
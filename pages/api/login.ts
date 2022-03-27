import jwt from 'jsonwebtoken'
import type { NextApiRequest, NextApiResponse } from 'next'
import type { ApiResponse } from '../../types/api'
import type { JwtData, SigninData } from '../../types/authentication'

export default async function handler(req: NextApiRequest, res: NextApiResponse<ApiResponse<SigninData>>) {
  const { password } = req.body
  if (!password)
    return res.status(400).json({ ok: false, error: 'No password provided' })

  if (password !== process.env.LOGIN_PASSWORD)
    return res.status(400).json({ ok: false, error: 'Invalid password' })

  const jwtData: JwtData = {
    id: 'todo',
  }
  const access_token = jwt.sign(jwtData, process.env.JWT_SECRET || '', { expiresIn: '1d' })

  const data = { access_token }
  res.status(200).json({ ok: true, data })
}

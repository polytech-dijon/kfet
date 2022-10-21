import { Prisma } from '@prisma/client';
import prisma from '../../prisma'
import { mapPrismaItems } from '../../utils'
import verifyJwt from '../../utils/verifyJwt'
import type { NextApiRequest, NextApiResponse } from 'next'
import type { ApiResponse } from '../../types/api'
import type { Command } from '../../types/db'

export type GetCommandResult = {
  commands: Command[];
}
export type PutCommandBody = {
  command: Command;
}
export type PutCommandResult = {}
export type DeleteCommandBody = {
  id: number;
}
export type DeleteCommandResult = {}
export type PostCommandBody = {
  command: Partial<Command>;
}
export type PostCommandResult = {}

export default async function handler(req: NextApiRequest, res: NextApiResponse<ApiResponse<GetCommandResult | PutCommandResult>>) {
  if (req.method === 'GET') {

    const commands = await prisma.command.findMany({
      orderBy: [
        {
          status: 'asc',
        },
        {
          created_at: 'desc',
        },
      ],
    })
    prisma.$disconnect()

    const data: GetCommandResult = {
      commands: mapPrismaItems(commands),
    }
    res.status(200).json({
      ok: true,
      data,
    })

  }
  else if (req.method === 'PUT') {

    if (!verifyJwt({ req, res, verifyBodyData: true }))
      return

    const { command }: PutCommandBody = req.body.data
    if (!command)
      return res.status(400).json({ ok: false, error: 'Invalid data' })

    await prisma.command.update({
      where: {
        id: command.id,
      },
      data: {
        title: command.title,
        description: command.description,
        status: command.status,
        estimated_end: command.estimated_end ? new Date(command.estimated_end) : null,
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

    const { id }: DeleteCommandBody = req.body.data
    if (typeof id !== 'number')
      return res.status(400).json({ ok: false, error: 'Invalid data' })

    await prisma.command.delete({
      where: {
        id,
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

    const { command }: PostCommandBody = req.body.data
    if (!command)
      return res.status(400).json({ ok: false, error: 'Invalid data' })

    await prisma.command.create({
      data: {
        ...(command as Command),
      },
    })
    prisma.$disconnect()

    res.status(200).json({
      ok: true,
      data: {},
    })

  }
}
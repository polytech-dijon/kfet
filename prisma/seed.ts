import { PrismaClient } from '@prisma/client'
import { articles } from './data'
const prisma = new PrismaClient()

const load = async () => {
  try {
    await prisma.article.deleteMany()
    console.log('Deleted records in article table')

    await prisma.$queryRaw`ALTER SEQUENCE "Article_id_seq" RESTART WITH 1`
    console.log('reset article auto increment to 1')

    await prisma.article.createMany({
      data: articles,
    })
    console.log('Added category data')
  } catch (e) {
    console.error(e)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

load()
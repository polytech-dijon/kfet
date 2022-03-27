import { PrismaClient } from '@prisma/client'
import { articles, products } from './data'
const prisma = new PrismaClient()

const load = async () => {
  try {
    await prisma.article.deleteMany()
    console.log('Deleted records in article table')

    await prisma.product.deleteMany()
    console.log('Deleted records in product table')

    // await prisma.sale.deleteMany()
    // console.log('Deleted records in sale table')

    await prisma.$queryRaw`ALTER SEQUENCE "Article_id_seq" RESTART WITH 1`
    console.log('reset article auto increment to 1')

    await prisma.$queryRaw`ALTER SEQUENCE "Product_id_seq" RESTART WITH 1`
    console.log('reset product auto increment to 1')
  
    // await prisma.$queryRaw`ALTER SEQUENCE "Sale_id_seq" RESTART WITH 1`
    // console.log('reset sale auto increment to 1')

    await prisma.article.createMany({
      data: articles,
    })
    console.log('Added category data')

    await prisma.product.createMany({
      data: products,
    })
    console.log('Added product data')
  } catch (e) {
    console.error(e)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

load()
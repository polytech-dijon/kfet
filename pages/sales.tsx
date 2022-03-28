import { useState } from 'react'
import Head from 'next/head'
import toast from 'react-hot-toast'
import { PrismaClient } from '@prisma/client'
import { RiAddLine, RiSubtractLine } from 'react-icons/ri'
import { withAuthentication } from '../components/withAuthentication'
import api from '../services/api'
import { mapPrismaItems, Round } from '../utils'
import { categories, categoryNames } from '../utils/categories'
import { PaiementMethod } from '../types/db'
import type { GetServerSideProps, NextPage } from 'next'
import type { IArticle, ISale } from '../types/db'

interface CheckoutProps {
  articles: IArticle[];
  sales: ISale[];
}
const Sales: NextPage<CheckoutProps> = ({ sales }) => {
  console.log(sales[0])

  return (
    <>
      <Head>
        <title>MEGA KFET</title>
        <meta name="description" content="Ventes de la MEGA KFET" />
      </Head>
      <div className="grow container flex items-stretch justify-center">
        <h1 className="text-4xl text-center">Ventes :</h1>
        <div className="">
          {sales.map((sale, key) => (
            <div key={key}>
              
            </div>
          ))}
        </div>
      </div>
    </>
  )
}

export const getServerSideProps: GetServerSideProps<CheckoutProps> = async () => {
  const prisma = new PrismaClient()
  const [articles, sales] = await Promise.all([
    await prisma.article.findMany(),
    await prisma.sale.findMany(),
  ])
  prisma.$disconnect()
  return {
    props: {
      articles: mapPrismaItems(articles),
      sales: mapPrismaItems(sales),
    },
  }
}

export default withAuthentication(Sales)

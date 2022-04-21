import { useEffect, useState, Fragment } from 'react'
import Head from 'next/head'
import toast from 'react-hot-toast'
import { withAuthentication } from '../components/withAuthentication'
import api from '../services/api'
import { articlesById, Round } from '../utils'
import { paiementMethodsNames } from '../utils/db-enum'
import type { NextPage } from 'next'
import type { IArticle } from '../types/db'
import type { ApiRequest } from '../types/api'
import type { GetSummaryBody, GetSummaryResult } from './api/summary'

const Sales: NextPage = () => {
  const [priceSummaryByPaiementMethod, setPriceSummaryByPaiementMethod] = useState<GetSummaryResult['priceSummaryByPaiementMethod']>([])
  const [summaryArticles, setSummaryArticles] = useState<number[]>([])
  const [articles, setArticles] = useState<IArticle[]>([])
  const [summaryDate, setSummaryDate] = useState('')

  async function getSummary() {
    try {
      const { data } = await api.post<GetSummaryResult, ApiRequest<GetSummaryBody>>('/api/summary', {
        data: {
          date: summaryDate || null,
        }
      })
      setPriceSummaryByPaiementMethod(data.priceSummaryByPaiementMethod)
      setSummaryArticles(data.summaryArticles)
      setArticles(data.articles)
    }
    catch {
      toast.error('Une erreur est survenue')
    }
  }

  useEffect(() => {
    getSummary()
  }, [summaryDate])

  const totalSale = priceSummaryByPaiementMethod.reduce((acc, sale) => acc + sale.price, 0)

  return (
    <>
      <Head>
        <title>MEGA KFET</title>
        <meta name="description" content="Ventes de la MEGA KFET" />
      </Head>
      <div className="grow container flex flex-col py-4">
        <div className="flex flex-col justify-between items-start mt-8">
          <h1 className="text-4xl text-center">Résumé des ventes :</h1>
          <div className="text-lg mt-2">
            <span className="mr-2">Date :</span>
            <input
              type="date"
              id="start"
              name="trip-start"
              value={summaryDate}
              onChange={(e) => setSummaryDate(e.target.value)}
              className="text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2"
            />
          </div>
        </div>
        {totalSale === 0 && (
          <div className="flex justify-center">
            Aucune vente effectuée le {new Date(summaryDate).toLocaleDateString()}.
          </div>
        )}
        {totalSale > 0 && (
          <SalesSummary priceSummaryByPaiementMethod={priceSummaryByPaiementMethod} summaryArticles={summaryArticles} articles={articles} summaryDate={summaryDate} />
        )}
      </div>
    </>
  )
}

type SalesSummaryProps = {
  priceSummaryByPaiementMethod: GetSummaryResult['priceSummaryByPaiementMethod'];
  summaryArticles: number[];
  articles: IArticle[];
  summaryDate: string;
}
const SalesSummary = ({ priceSummaryByPaiementMethod, summaryArticles, articles, summaryDate }: SalesSummaryProps) => {
  const totalSale = priceSummaryByPaiementMethod.reduce((acc, sale) => acc + sale.price, 0)

  return <div className="my-4">
    <h2 className="text-3xl">{summaryArticles.length > 0 ? `Ventes du ${new Date(summaryDate).toLocaleDateString()}` : "Total des ventes"}</h2>
    <div className="flex flex-col">
      <h3 className="my-2 text-2xl">Chiffre d&apos;affaire :</h3>
      <div className="flex justify-start">
        <div className="grid grid-cols-2">
          {priceSummaryByPaiementMethod.map((sale, key) => <Fragment key={key}>
            <span>{paiementMethodsNames[sale.paiementMethod]} :</span>
            <span className="ml-2">{Round(sale.price)}€</span>
          </Fragment>)}
          <span className="text-xl">Total :</span>
          <span className="text-xl ml-2">{Round(totalSale)}€</span>
        </div>
      </div>
      {summaryArticles.length > 0 && <>
        <h3 className="my-2 text-2xl">Liste des ventes :</h3>
        <div className="flex flex-col">
          {formatSaleArticles(summaryArticles, articles).map((desc, key) => (
            <span key={key}>{desc}</span>
          ))}
        </div>
      </>}
    </div>
  </div>
}

function formatSaleArticles(saleArticlesId: number[], articles: IArticle[]): string[] {
  const saleArticlesMapped: IArticle[] = saleArticlesId.map((articleId) => articles.find((a) => a.id === articleId) as IArticle)
  const cardById = articlesById(saleArticlesMapped)
  return cardById.sort((a, b) => b.quantity - a.quantity).map(({ quantity, article }) => `${quantity} ${article.name}`)
}

export default withAuthentication(Sales)

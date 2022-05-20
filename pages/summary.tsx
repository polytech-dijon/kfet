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
  const [summaryStartDate, setSummaryStartDate] = useState('')
  const [summaryEndDate, setSummaryndDate] = useState('')
  const [articles, setArticles] = useState<IArticle[]>([])

  async function getSummary() {
    try {
      const { data } = await api.post<GetSummaryResult, ApiRequest<GetSummaryBody>>('/api/summary', {
        data: {
          startDate: summaryStartDate || null,
          endDate: summaryEndDate || null,
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
  }, [summaryStartDate, summaryEndDate])

  const totalSale = priceSummaryByPaiementMethod.reduce((acc, sale) => acc + sale.price, 0)

  return (
    <>
      <Head>
        <title>MEGA KFET</title>
        <meta name="description" content="Ventes de la MEGA KFET" />
      </Head>
      <div className="grow container flex flex-col py-4">
        <div className="flex flex-col justify-between items-start mt-8">
          <div className="flex justify-between items-center">
            <h1 className="text-4xl text-center mt-8">Résumé des ventes</h1>
          </div>
          <div className="shadow-md sm:rounded-lg w-full mt-6 mb-8 p-4 bg-white">
            <h3 className="text-xl">Filtres :</h3>
            <div className="mt-2">
              <span className="mr-1">Entre le </span>
              <input
                type="date"
                value={summaryStartDate}
                onChange={(e) => setSummaryStartDate(e.target.value)}
                className="text-gray-900 bg-gray-50 border border-gray-300 focus:outline-none focus:border-blue-500 font-medium rounded-lg text-sm px-2.5 py-2"
              />
              <span className="mx-1"> et le </span>
              <input
                type="date"
                value={summaryEndDate}
                onChange={(e) => setSummaryndDate(e.target.value)}
                className="text-gray-900 bg-gray-50 border border-gray-300 focus:outline-none focus:border-blue-500 font-medium rounded-lg text-sm px-2.5 py-2"
              />
            </div>
          </div>
        </div>
        {totalSale === 0 && (
          <div className="flex justify-center">
            {summaryStartDate && summaryEndDate && <>
             Aucune vente effectuée entre le {new Date(summaryStartDate).toLocaleDateString()} et le {new Date(summaryEndDate).toLocaleDateString()}.
            </>}
            {summaryStartDate && !summaryEndDate && <>
             Aucune vente effectuée depuis le {new Date(summaryStartDate).toLocaleDateString()}.
            </>}
            {!summaryStartDate && summaryEndDate && <>
             Aucune vente effectuée avant le {new Date(summaryEndDate).toLocaleDateString()}.
            </>}
          </div>
        )}
        {articles.length > 0 && summaryArticles.length > 0 && (
          <SalesSummary priceSummaryByPaiementMethod={priceSummaryByPaiementMethod} summaryArticles={summaryArticles} articles={articles} summaryStartDate={summaryStartDate} summaryEndDate={summaryEndDate} />
        )}
      </div>
    </>
  )
}

type SalesSummaryProps = {
  priceSummaryByPaiementMethod: GetSummaryResult['priceSummaryByPaiementMethod'];
  summaryArticles: number[];
  articles: IArticle[];
  summaryStartDate: string;
  summaryEndDate: string;
}
const SalesSummary = ({ priceSummaryByPaiementMethod, summaryArticles, articles, summaryStartDate, summaryEndDate }: SalesSummaryProps) => {
  const totalSale = priceSummaryByPaiementMethod.reduce((acc, sale) => acc + sale.price, 0)

  return <div className="my-4">
    {summaryStartDate && summaryEndDate && <>
      {summaryStartDate === summaryEndDate && <>
        <h2 className="text-3xl">Ventes du {new Date(summaryStartDate).toLocaleDateString()}</h2>
      </>}
      {summaryStartDate !== summaryEndDate && <>
        <h2 className="text-3xl">Ventes entre le {new Date(summaryStartDate).toLocaleDateString()} et le {new Date(summaryEndDate).toLocaleDateString()}</h2>
      </>}
    </>}
    {summaryStartDate && !summaryEndDate && <>
      <h2 className="text-3xl">Ventes depuis le {new Date(summaryStartDate).toLocaleDateString()} et le {new Date(summaryEndDate).toLocaleDateString()}</h2>
    </>}
    {!summaryStartDate && summaryEndDate && <>
      <h2 className="text-3xl">Ventes après le {new Date(summaryStartDate).toLocaleDateString()} et le {new Date(summaryEndDate).toLocaleDateString()}</h2>
    </>}
    {!summaryStartDate && !summaryEndDate && <>
      <h2 className="text-3xl">Total des ventes</h2>
    </>}
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
  console.log(saleArticlesId, articles)
  const saleArticlesMapped: IArticle[] = saleArticlesId.map((articleId) => articles.find((a) => a.id === articleId) as IArticle)
  console.log(saleArticlesMapped)
  const cardById = articlesById(saleArticlesMapped)
  return cardById.sort((a, b) => b.quantity - a.quantity).map(({ quantity, article }) => `${quantity} ${article.name}`)
}

export default withAuthentication(Sales)

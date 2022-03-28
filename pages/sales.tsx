import { useEffect, useState } from 'react'
import Head from 'next/head'
import toast from 'react-hot-toast'
import { withAuthentication } from '../components/withAuthentication'
import api from '../services/api'
import { articlesById } from '../utils'
import { paiementMethodsNames } from '../utils/db-enum'
import type { NextPage } from 'next'
import type { IArticle, ISale } from '../types/db'
import type { SalesData } from './api/sales'

const Sales: NextPage = () => {
  const [sales, setSales] = useState<ISale[]>([])
  const [articles, setArticles] = useState<IArticle[]>([])
  const [pageCount, setPageCount] = useState<number>(0)
  const [salesPage, setSalesPage] = useState(0)

  async function getSales() {
    try {
      const { data } = await api.post<SalesData>('/api/sales', {
        data: {
          page: salesPage
        }
      })
      setSales(data.sales)
      setArticles(data.articles)
      setPageCount(data.pageCount)
    }
    catch {
      toast.error('Une erreur est survenue')
    }
  }

  useEffect(() => {
    getSales()
  }, [salesPage])

  return (
    <>
      <Head>
        <title>MEGA KFET</title>
        <meta name="description" content="Ventes de la MEGA KFET" />
      </Head>
      <div className="grow container flex flex-col">
        <h1 className="text-4xl text-center my-8">Ventes :</h1>
        {(articles.length > 0 && articles.length > 0 && pageCount) && <div className="flex flex-col items-center">
          <div className="relative overflow-x-auto shadow-md sm:rounded-lg w-full">
            <table className="w-full text-sm text-left text-gray-500">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 w-2/5">
                    Articles
                  </th>
                  <th scope="col" className="px-6 py-3 w-1/5">
                    Moyen de paiement
                  </th>
                  <th scope="col" className="px-6 py-3 w-1/5">
                    Prix de vente
                  </th>
                  <th scope="col" className="px-6 py-3 w-1/5">
                    Date de vente
                  </th>
                  {/* <th scope="col" className="px-6 py-3">
                    <span className="sr-only">Actions</span>
                  </th> */}
                </tr>
              </thead>
              <tbody>
                {sales.map((sale, key) => (
                  <tr key={key} className="bg-white">
                    <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                      {formatSaleArticles(sale, articles)}
                    </th>
                    <td className="px-6 py-4">
                      {paiementMethodsNames[sale.paiement_method]}
                    </td>
                    <td className="px-6 py-4">
                      {sale.sell_price}€
                    </td>
                    <td className="px-6 py-4">
                      {new Date(sale.created_at).toLocaleString()}
                    </td>
                    {/* <td className="px-6 py-4 text-right">
                      <a href="#" className="font-medium text-red-600 hover:underline">Supprimer</a>
                    </td> */}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="m-4">
            <ul className="inline-flex">
              <li>
                <button
                  className="py-2 px-3 ml-0 leading-tight text-gray-500 bg-white rounded-l-lg border border-gray-300 hover:bg-gray-100 hover:text-gray-700"
                  onClick={() => {
                    if (salesPage > 0)
                      setSalesPage(salesPage - 1)
                  }}
                >
                  Précédant
                </button>
              </li>
              {new Array(pageCount).fill(0).map((_, page) => {
                if (page === salesPage) {
                  return <li key={page}>
                    <button aria-current="page" className="py-2 px-3 leading-tight text-blue-600 bg-blue-50 border border-gray-300 hover:bg-blue-100 hover:text-blue-700">{page + 1}</button>
                  </li>
                }
                else {
                  return <li key={page}>
                    <button onClick={() => setSalesPage(page)} className="py-2 px-3 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700">{page + 1}</button>
                  </li>
                }
              })}
              <li>
                <button
                  className="py-2 px-3 leading-tight text-gray-500 bg-white rounded-r-lg border border-gray-300 hover:bg-gray-100 hover:text-gray-700"
                  onClick={() => {
                    if (salesPage < pageCount - 1)
                      setSalesPage(salesPage + 1)
                  }}
                >
                  Suivant
                </button>
              </li>
            </ul>
          </div>
        </div>}
      </div>
    </>
  )
}

function formatSaleArticles(sale: ISale, articles: IArticle[]) {
  const saleArticles: IArticle[] = sale.articles.map((articleId) => articles.find((a) => a.id === articleId) as IArticle)
  const cardById = articlesById(saleArticles)
  return cardById.map(({ quantity, article }) => `${quantity} ${article.name}`).join(', ')
}

export default withAuthentication(Sales)

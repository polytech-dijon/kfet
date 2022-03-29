import { useEffect, useState, Fragment } from 'react'
import Head from 'next/head'
import toast from 'react-hot-toast'
import { withAuthentication } from '../components/withAuthentication'
import api from '../services/api'
import { articlesById, Round } from '../utils'
import { paiementMethodsNames } from '../utils/db-enum'
import type { NextPage } from 'next'
import type { IArticle, ISale } from '../types/db'
import type { SalesData } from './api/sales'

const Sales: NextPage = () => {
  const [sales, setSales] = useState<ISale[]>([])
  const [articles, setArticles] = useState<IArticle[]>([])
  const [pageCount, setPageCount] = useState<number>(0)
  const [salesPage, setSalesPage] = useState(0)
  const [salesDate, setSalesDate] = useState('')

  async function getSales() {
    try {
      const { data } = await api.post<SalesData>('/api/sales', {
        data: {
          page: salesPage,
          date: salesDate || null,
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
  }, [salesPage, salesDate])
  useEffect(() => {
    setSalesPage(0)
  }, [salesDate])

  return (
    <>
      <Head>
        <title>MEGA KFET</title>
        <meta name="description" content="Ventes de la MEGA KFET" />
      </Head>
      <div className="grow container flex flex-col py-4">
        <div className="flex justify-between items-center">
          <h1 className="text-4xl text-center my-8">Ventes :</h1>
          <div>
            <span className="mr-2">Date des ventes :</span>
            <input
              type="date"
              id="start"
              name="trip-start"
              value={salesDate}
              onChange={(e) => setSalesDate(e.target.value)}
              className="text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700"
            />
          </div>
        </div>
        {(articles.length > 0 && pageCount === 0) && (
          <div className="flex justify-center">
            Aucune vente trouvée.
          </div>
        )}
        {(articles.length > 0 && articles.length > 0 && pageCount > 0) && <div className="flex flex-col items-center">
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
                      {formatSaleArticles(sale.articles, articles).join(', ')}
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
            <SalesTablePagination salesPage={salesPage} setSalesPage={setSalesPage} pageCount={pageCount} />
          </div>
        </div>}
        {salesDate && sales.length > 0 && <SalesResume articles={articles} sales={sales} salesDate={salesDate} />}
      </div>
    </>
  )
}

type SalesTablePaginationProps = {
  salesPage: number;
  setSalesPage: (page: number) => void;
  pageCount: number;
}
const SalesTablePagination = ({ salesPage, setSalesPage, pageCount }: SalesTablePaginationProps) => {
  let pageArray: number[] = [];
  if (pageCount > 10) {
    if (salesPage < 5) {
      pageArray = [0, 1, 2, 3, 4, 5, 6, -1, pageCount - 2, pageCount - 1]
    } else if (salesPage > pageCount - 5) {
      pageArray = [0, 1, -1, pageCount - 7, pageCount - 6, pageCount - 5, pageCount - 4, pageCount - 3, pageCount - 2, pageCount - 1]
    } else {
      pageArray = [0, 1, -1,  salesPage - 2, salesPage - 1, salesPage, salesPage + 1, salesPage + 2, -1, pageCount - 1]
    }
  }
  else
    pageArray = new Array(pageCount).fill(0).map((_, i) => i)

  return (
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
      {pageArray.map((page, key) => {
        if (page === salesPage) {
          return <li key={key}>
            <button aria-current="page" className="py-2 px-3 leading-tight text-blue-600 bg-blue-50 border border-gray-300 hover:bg-blue-100 hover:text-blue-700">{page + 1}</button>
          </li>
        }
        else if (page === -1) {
          return <li key={key}>
            <button onClick={() => setSalesPage(page)} className="py-2 px-3 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700">...</button>
          </li>
        }
        else {
          return <li key={key}>
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
  )
}

type SalesResumeProps = {
  sales: ISale[];
  articles: IArticle[];
  salesDate: string;
}
const SalesResume = ({ sales, articles, salesDate }: SalesResumeProps) => {
  const totalSale = sales.reduce((acc, sale) => acc + sale.sell_price, 0)
  const totalSaleByPaiementType = sales.reduce((acc: any, sale) => {
    acc[sale.paiement_method] = (acc[sale.paiement_method] || 0) + sale.sell_price
    return acc
  }, {})
  const saleArticlesId = sales.map((sale) => sale.articles).flat()

  return <div className="my-4">
    <h2 className="text-3xl">Résumé de la journée :</h2>
    <div className="flex flex-col">
      <h3 className="my-2 text-2xl">Chiffre d&apos;affaire :</h3>
      <div className="flex justify-start">
        <div className="grid grid-cols-2">
          {Object.keys(totalSaleByPaiementType).map((paiementMethod, key) => <Fragment key={key}>
            <span>{paiementMethodsNames[paiementMethod]} :</span>
            <span className="ml-2">{Round(totalSaleByPaiementType[paiementMethod])}€</span>
          </Fragment>)}
          <span className="text-xl">Total :</span>
          <span className="text-xl ml-2">{Round(totalSale)}€</span>
        </div>
      </div>
      <h3 className="my-2 text-2xl">Liste des ventes :</h3>
      <div className="flex flex-col">
        {formatSaleArticles(saleArticlesId, articles).map((desc, key) => (
          <span key={key}>{desc}</span>
        ))}
      </div>
    </div>
  </div>
}

function formatSaleArticles(saleArticlesId: number[], articles: IArticle[]): string[] {
  const saleArticlesMapped: IArticle[] = saleArticlesId.map((articleId) => articles.find((a) => a.id === articleId) as IArticle)
  const cardById = articlesById(saleArticlesMapped)
  return cardById.sort((a, b) => b.quantity - a.quantity).map(({ quantity, article }) => `${quantity} ${article.name}`)
}

export default withAuthentication(Sales)

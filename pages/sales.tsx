import { useEffect, useState, Fragment } from 'react'
import Head from 'next/head'
import toast from 'react-hot-toast'
import { RiDeleteBinFill } from 'react-icons/ri'
import { withAuthentication } from '../components/withAuthentication'
import Select from '../components/Select'
import api from '../services/api'
import Modal from '../components/Modal'
import { articlesById, Round } from '../utils'
import { paiementMethods, paiementMethodsNames } from '../utils/db-enum'
import type { NextPage } from 'next'
import type { IArticle, ISale, PaiementMethod } from '../types/db'
import type { ApiRequest } from '../types/api'
import type { GetSalesBody, GetSalesResult, DeleteSalesResult, DeleteSalesBody } from './api/sales'

const Sales: NextPage = () => {
  const [sales, setSales] = useState<ISale[]>([])
  const [articles, setArticles] = useState<IArticle[]>([])
  const [pageCount, setPageCount] = useState<number>(0)
  const [salesPage, setSalesPage] = useState(0)
  const [salesStartDate, setSalesStartDate] = useState('')
  const [salesEndDate, setSalesEndDate] = useState('')
  const [salesPaiementMethod, setSalesPaiementMethod] = useState<PaiementMethod | null>(null)
  const [deletingSale, setDeletingSale] = useState<ISale | null>(null)

  async function getSales() {
    try {
      const { data } = await api.post<GetSalesResult, ApiRequest<GetSalesBody>>('/api/sales', {
        data: {
          page: salesPage,
          startDate: salesStartDate || null,
          endDate: salesEndDate || null,
          paiementMethod: salesPaiementMethod,
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

  async function deleteSale(sale: ISale, updateStocks: boolean) {
    try {
      await api.remove<DeleteSalesResult, ApiRequest<DeleteSalesBody>>(`/api/sales`, {
        data: {
          id: sale.id,
          updateStocks,
        },
      })
      await getSales()
      toast.success('La vente a été supprimée')
    }
    catch {
      toast.error('Une erreur est survenue')
    }
  }

  useEffect(() => {
    getSales()
  }, [salesPage, salesStartDate, salesEndDate, salesPaiementMethod])
  useEffect(() => {
    setSalesPage(0)
  }, [salesStartDate, salesEndDate, salesPaiementMethod])

  return (
    <>
      <Head>
        <title>MEGA KFET</title>
        <meta name="description" content="Ventes de la MEGA KFET" />
      </Head>
      <div className="grow container flex flex-col py-4">
        <div className="flex justify-between items-center">
          <h1 className="text-4xl text-center mt-8">Détails des ventes</h1>
        </div>
        <div className="shadow-md sm:rounded-lg w-full mt-6 mb-8 p-4 bg-white">
          <h3 className="text-xl">Filtres :</h3>
          <div className="mt-2">
            <span className="mr-1">Entre le </span>
            <input
              type="date"
              value={salesStartDate}
              onChange={(e) => setSalesStartDate(e.target.value)}
              className="text-gray-900 bg-gray-50 border border-gray-300 focus:outline-none focus:border-blue-500 font-medium rounded-lg text-sm px-2.5 py-2"
            />
            <span className="mx-1"> et le </span>
            <input
              type="date"
              value={salesEndDate}
              onChange={(e) => setSalesEndDate(e.target.value)}
              className="text-gray-900 bg-gray-50 border border-gray-300 focus:outline-none focus:border-blue-500 font-medium rounded-lg text-sm px-2.5 py-2"
            />
          </div>
          <div className="mt-2 flex items-center">
            <span className="mr-1.5">Moyen de paiement :</span>
            <Select
              value={salesPaiementMethod}
              setValue={setSalesPaiementMethod}
              values={[null, ...paiementMethods]}
              accessor={(method) => method ? paiementMethodsNames[method] : 'Tous'}
              className="w-40"
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
              <thead className="text-sm text-gray-700 uppercase bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 w-1/3">
                    Articles
                  </th>
                  <th scope="col" className="px-6 py-3 w-1/6">
                    Moyen de paiement
                  </th>
                  <th scope="col" className="px-6 py-3 w-1/6">
                    Prix de vente
                  </th>
                  <th scope="col" className="px-6 py-3 w-1/6">
                    Date de vente
                  </th>
                  <th scope="col" className="px-6 py-3 w-1/6">
                    Actions
                  </th>
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
                      {Round(sale.sell_price)}€
                    </td>
                    <td className="px-6 py-4">
                      {new Date(sale.created_at).toLocaleString()}
                    </td>
                    <td className="px-6 py-1">
                      <button className="button red" onClick={() => setDeletingSale(sale)}>
                        <RiDeleteBinFill size={20} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="m-4">
            <SalesTablePagination salesPage={salesPage} setSalesPage={setSalesPage} pageCount={pageCount} />
          </div>
        </div>}
      </div>
      <DeleteSaleModal deletingSale={deletingSale} setDeletingSale={setDeletingSale} deleteSale={deleteSale} />
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
            <button className="py-2 px-3 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700">...</button>
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

type DeleteSaleModalProps = {
  deletingSale: ISale | null;
  setDeletingSale: (sale: ISale | null) => void;
  deleteSale: (sale: ISale, updateStocks: boolean) => Promise<void>;
}
function DeleteSaleModal({ deletingSale, setDeletingSale, deleteSale }: DeleteSaleModalProps) {
  const [updateStocks, setUpdateStocks] = useState<boolean>(true)

  return <Modal
    isOpen={deletingSale !== null}
    onSubmit={async () => {
      if (deletingSale)
        await deleteSale(deletingSale, updateStocks)
      setDeletingSale(null)
    }}
    onCancel={() => setDeletingSale(null)}
    title="Supprimer la vente"
    submitButtonText="Supprimer"
    submitButtonColor="error"
  >
    <div className="my-3">
      <p>Êtes-vous sûr de vouloir supprimer cette vente ?</p>
      <div className="flex items-start mt-2">
        <div className="flex items-center h-5">
          <input id="terms" aria-describedby="terms" type="checkbox" checked={updateStocks} onChange={(e) => setUpdateStocks(e.target.checked)} className="w-4 h-4 bg-gray-50 rounded border border-gray-300 focus:ring-3 focus:ring-blue-300" required />
        </div>
        <div className="ml-3 text-sm">
          <label htmlFor="terms" className="font-medium text-gray-900">Mettre aussi à jour les stocks</label>
        </div>
      </div>
    </div>
  </Modal>
}

function formatSaleArticles(saleArticlesId: number[], articles: IArticle[]): string[] {
  const saleArticlesMapped: IArticle[] = saleArticlesId.map((articleId) => articles.find((a) => a.id === articleId) as IArticle)
  const cardById = articlesById(saleArticlesMapped)
  return cardById.sort((a, b) => b.quantity - a.quantity).map(({ quantity, article }) => `${quantity} ${article.name}`)
}

export default withAuthentication(Sales)

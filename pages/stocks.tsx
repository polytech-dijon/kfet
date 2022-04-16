import { useEffect, useState } from 'react'
import Head from 'next/head'
import toast from 'react-hot-toast'
import { withAuthentication } from '../components/withAuthentication'
import api from '../services/api'
import Modal from '../components/Modal'
import type { NextPage } from 'next'
import type { IArticle, IProduct } from '../types/db'
import type { StocksData } from './api/stocks'

const Stocks: NextPage = () => {
  const [articles, setArticles] = useState<IArticle[]>([])
  const [products, setProducts] = useState<IProduct[]>([])
  const [editingProduct, setEditingProduct] = useState<IProduct | null>(null);

  async function getStocks() {
    try {
      const { data } = await api.get<StocksData>('/api/stocks')
      setProducts(data.products)
      setArticles(data.articles)
    }
    catch {
      toast.error('Une erreur est survenue')
    }
  }

  async function updateProduct(product: IProduct) {
    try {
      const { data } = await api.post<StocksData>('/api/stocks', {
        data: {
          product,
        },
      })
      await getStocks()
      toast.success('Stock mis à jour !')
    }
    catch {
      toast.error('Une erreur est survenue')
    }
  }

  useEffect(() => {
    getStocks()
  }, [])

  return (
    <>
      <Head>
        <title>MEGA KFET - Stocks</title>
        <meta name="description" content="Gestion des stocks de la MEGA KFET" />
      </Head>
      <div className="grow container flex flex-col py-4">
        <h1 className="text-4xl text-center my-8">Gestion des stocks :</h1>
        {products.length > 0 && articles.length > 0 && (
          <div className="flex flex-col items-center">
            <div className="relative overflow-x-auto shadow-md sm:rounded-lg w-full">
              <table className="w-full text-sm text-left text-gray-500">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 w-2/5">
                      Nom du produit
                    </th>
                    <th scope="col" className="px-6 py-3 w-1/5">
                      Quantité
                    </th>
                    <th scope="col" className="px-6 py-3 w-1/5">
                      Prix d&apos;achat
                    </th>
                    <th scope="col" className="px-6 py-3 w-1/5">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product, key) => (
                    <tr key={key} className="bg-white">
                      <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                        {product.name}
                      </th>
                      <td className="px-6 py-4">
                        {product.quantity}
                      </td>
                      <td className="px-6 py-4">
                        {product.buying_price}€
                      </td>
                      <td className="px-6 py-4">
                        <button className="button" onClick={() => setEditingProduct(product)}>Éditer</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
      <EditProductModal editingProduct={editingProduct} setEditingProduct={setEditingProduct} updateProduct={updateProduct} />
    </>
  )
}

type EditProductModalProps = {
  editingProduct: IProduct | null;
  setEditingProduct: (product: IProduct | null) => void;
  updateProduct: (product: IProduct) => Promise<void>;
}
function EditProductModal({ editingProduct, setEditingProduct, updateProduct }: EditProductModalProps) {
  const [name, setName] = useState('')
  const [quantity, setQuantity] = useState(0)
  const [buyingPrice, setBuyingPrice] = useState(0)

  useEffect(() => {
    if (editingProduct) {
      setName(editingProduct.name)
      setQuantity(editingProduct.quantity)
      setBuyingPrice(editingProduct.buying_price)
    }
  }, [editingProduct]);

  return <Modal
    isOpen={editingProduct !== null}
    onSubmit={async () => {
      await updateProduct({
        id: editingProduct!.id,
        name,
        quantity,
        buying_price: buyingPrice
      })
      setEditingProduct(null)
    }}
    onCancel={() => setEditingProduct(null)}
    title="Modifier le stock"
    submitButtonText="Sauvegarder"
  >
    <div className="my-3">
      <label htmlFor="productName" className="block mb-2 text-sm font-medium text-gray-900">Nom du produit :</label>
      <input type="text" id="productName" value={name} onChange={(e) => setName(e.target.value)} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" required />
    </div>
    <div className="my-3">
      <label htmlFor="productQuantity" className="block mb-2 text-sm font-medium text-gray-900">Quantité en stock :</label>
      <input type="number" id="productQuantity" value={quantity} onChange={(e) => setQuantity(parseInt(e.target.value, 10))} min={0} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" required />
    </div>
    <div className="my-3">
      <label htmlFor="productBuyingPrice" className="block mb-2 text-sm font-medium text-gray-900">Prix d&apos;achat :</label>
      <input type="number" id="productBuyingPrice" value={buyingPrice} onChange={(e) => setBuyingPrice(parseFloat(e.target.value))} step={0.05} min={0} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" required />
    </div>
  </Modal>
}

export default withAuthentication(Stocks)

import { useEffect, useState } from 'react'
import Head from 'next/head'
import toast from 'react-hot-toast'
import { RiAddLine, RiDeleteBinFill, RiEditFill } from 'react-icons/ri'
import { withAuthentication } from '../components/withAuthentication'
import api from '../services/api'
import Modal from '../components/Modal'
import Select from '../components/Select'
import { Round } from '../utils'
import { categories, categoryNames } from '../utils/db-enum'
import type { NextPage } from 'next'
import type { Category, IProduct } from '../types/db'
import type { ApiRequest } from '../types/api'
import type { DeleteStocksBody, DeleteStocksResult, GetStocksResult, PostStocksBody, PostStocksResult, PutStocksBody, PutStocksResult } from './api/stocks'

const Stocks: NextPage = () => {
  const [products, setProducts] = useState<IProduct[]>([])
  const [productNameFilter, setProductNameFilter] = useState('')
  const [editingProduct, setEditingProduct] = useState<IProduct | null>(null)
  const [deletingProduct, setDeletingProduct] = useState<IProduct | null>(null)
  const [createProductOpen, setCreateModalOpen] = useState(false)

  async function getStocks() {
    try {
      const { data } = await api.get<GetStocksResult>('/api/stocks')
      setProducts(data.products)
    }
    catch {
      toast.error('Une erreur est survenue')
    }
  }

  async function updateProduct(product: IProduct) {
    try {
      await api.put<PutStocksResult, ApiRequest<PutStocksBody>>('/api/stocks', {
        data: {
          product,
        },
      })
      await getStocks()
      toast.success('Produit mis à jour !')
    }
    catch (e) {
      console.error(e)
      toast.error('Une erreur est survenue...')
    }
  }

  async function deleteProduct(product: IProduct) {
    try {
      await api.remove<DeleteStocksResult, ApiRequest<DeleteStocksBody>>('/api/stocks', {
        data: {
          id: product.id,
        },
      })
      await getStocks()
      toast.success('Produit supprimé !')
    }
    catch (e) {
      console.error(e)
      toast.error('Une erreur est survenue...')
    }
  }

  async function createProduct(product: Partial<IProduct>) {
    try {
      await api.post<PostStocksResult, ApiRequest<PostStocksBody>>('/api/stocks', {
        data: {
          product,
        },
      })
      await getStocks()
      toast.success('Produit créé !')
    }
    catch (e) {
      console.error(e)
      toast.error('Une erreur est survenue...')
    }
  }

  useEffect(() => {
    getStocks()
  }, [])

  const filteredProducts = productNameFilter.length > 0 ? products.filter(product => product.name.toLowerCase().includes(productNameFilter.toLowerCase())) : products

  return (
    <>
      <Head>
        <title>MEGA KFET - Stocks</title>
        <meta name="description" content="Gestion des stocks de la MEGA KFET" />
      </Head>
      <div className="grow container flex flex-col py-4">
        <div className="flex justify-between items-center">
          <h1 className="text-4xl text-center my-8">Gestion des stocks :</h1>
          <button className="button flex items-center" onClick={() => setCreateModalOpen(true)}>
            <RiAddLine className="-ml-1.5 mr-1" size={24} />
            Nouveau produit
          </button>
        </div>
        <div className="shadow-md sm:rounded-lg w-full mt-6 mb-8 p-4 bg-white">
          <h3 className="text-xl">Filtres :</h3>
          <div className="mt-2 flex items-center">
            <span className="mr-1.5">Nom du produit :</span>
            <input
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-1.5"
              type="text"
              value={productNameFilter}
              onChange={e => setProductNameFilter(e.target.value)}
            />
          </div>
        </div>
        {filteredProducts.length > 0 && (
          <div className="flex flex-col items-center">
            <div className="relative overflow-x-auto shadow-md sm:rounded-lg w-full">
              <table className="w-full text-sm text-left text-gray-500">
                <thead className="text-sm text-gray-700 uppercase bg-gray-50">
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
                  {filteredProducts.map((product, key) => (
                    <tr key={key} className="odd:bg-white even:bg-gray-50">
                      <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                        {product.name}
                      </th>
                      <td className="px-6 py-4">
                        {product.quantity}
                      </td>
                      <td className="px-6 py-4">
                        {Round(product.buying_price)}€
                      </td>
                      <td className="px-6 py-1 flex">
                        <button className="button" onClick={() => setEditingProduct(product)}>
                          <RiEditFill size={20} />
                        </button>
                        <button className="button red ml-3" onClick={() => setDeletingProduct(product)}>
                          <RiDeleteBinFill size={20} />
                        </button>
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
      <DeleteProductModal deletingProduct={deletingProduct} setDeletingProduct={setDeletingProduct} deleteProduct={deleteProduct} />
      <CreateProductModal createProductOpen={createProductOpen} setCreateModalOpen={setCreateModalOpen} createProduct={createProduct} />
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
      if (!editingProduct) return
      await updateProduct({
        id: editingProduct.id,
        name,
        quantity,
        buying_price: buyingPrice,
        deleted: editingProduct.deleted,
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

type DeleteProductModalProps = {
  deletingProduct: IProduct | null;
  setDeletingProduct: (product: IProduct | null) => void;
  deleteProduct: (product: IProduct) => Promise<void>;
}
function DeleteProductModal({ deletingProduct, setDeletingProduct, deleteProduct }: DeleteProductModalProps) {
  return <Modal
    isOpen={deletingProduct !== null}
    onSubmit={async () => {
      if (!deletingProduct) return
      await deleteProduct({ ...deletingProduct })
      setDeletingProduct(null)
    }}
    onCancel={() => setDeletingProduct(null)}
    title="Supprimer le produit"
    submitButtonText="Supprimer"
    submitButtonColor="error"
  >
    <div className="my-3">
      <p>Êtes-vous sûr de vouloir supprimer ce produit ?</p>
    </div>
  </Modal>
}

type CreateProductModalProps = {
  createProductOpen: boolean;
  setCreateModalOpen: (open: boolean) => void;
  createProduct: (product: Partial<IProduct>) => Promise<void>;
}
function CreateProductModal({ createProductOpen, setCreateModalOpen, createProduct }: CreateProductModalProps) {
  const [name, setName] = useState('')
  const [quantity, setQuantity] = useState(0)
  const [buyingPrice, setBuyingPrice] = useState(0)

  return <Modal
    isOpen={createProductOpen}
    onSubmit={async () => {
      await createProduct({
        name,
        quantity,
        buying_price: buyingPrice,
      })
      setCreateModalOpen(false)
      setName('')
      setQuantity(0)
      setBuyingPrice(0)
    }}
    onCancel={() => setCreateModalOpen(false)}
    title="Créer un produit"
    submitButtonText="Créer"
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

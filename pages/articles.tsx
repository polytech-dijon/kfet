import { useEffect, useState } from 'react'
import Head from 'next/head'
import toast from 'react-hot-toast'
import { RiAddLine, RiDeleteBinFill, RiEditFill } from 'react-icons/ri'
import { withAuthentication } from '../components/withAuthentication'
import api from '../services/api'
import Select from '../components/Select'
import Modal from '../components/Modal'
import MultiSelect from '../components/MultiSelect'
import { Category } from '../types/db'
import type { NextPage } from 'next'
import type { IArticle, IProduct } from '../types/db'
import type { ApiRequest } from '../types/api'
import type { DeleteArticlesBody, DeleteArticlesResult, GetArticlesResult, PostArticlesBody, PostArticlesResult, PutArticlesBody, PutArticlesResult } from './api/articles'
import { categories, categoryNames } from '../utils/db-enum'

const Articles: NextPage = () => {
  const [products, setProducts] = useState<IProduct[]>([])
  const [articles, setArticles] = useState<IArticle[]>([])
  const [editingArticle, setEditingArticle] = useState<IArticle | null>(null)
  const [deletingArticle, setDeletingArticle] = useState<IArticle | null>(null)
  const [createArticleOpen, setCreateModalOpen] = useState(false)

  async function getArticles() {
    try {
      const { data } = await api.get<GetArticlesResult>('/api/articles')
      setArticles(data.articles)
      setProducts(data.products)
    }
    catch {
      toast.error('Une erreur est survenue')
    }
  }

  async function updateArticle(article: IArticle) {
    try {
      await api.put<PutArticlesResult, ApiRequest<PutArticlesBody>>('/api/articles', {
        data: {
          article,
        },
      })
      await getArticles()
      toast.success('Article mis à jour !')
    }
    catch (e) {
      console.error(e)
      toast.error('Une erreur est survenue...')
    }
  }

  async function deleteArticle(article: IArticle) {
    try {
      await api.remove<DeleteArticlesResult, ApiRequest<DeleteArticlesBody>>('/api/articles', {
        data: {
          id: article.id,
        },
      })
      await getArticles()
      toast.success('Article supprimé !')
    }
    catch (e) {
      console.error(e)
      toast.error('Une erreur est survenue...')
    }
  }

  async function createArticle(article: Partial<IArticle>) {
    try {
      await api.post<PostArticlesResult, ApiRequest<PostArticlesBody>>('/api/articles', {
        data: {
          article,
        },
      })
      await getArticles()
      toast.success('Article créé !')
    }
    catch (e) {
      console.error(e)
      toast.error('Une erreur est survenue...')
    }
  }

  useEffect(() => {
    getArticles()
  }, [])

  return (
    <>
      <Head>
        <title>MEGA KFET - Articles</title>
        <meta name="description" content="Gestion des articles de la MEGA KFET" />
      </Head>
      <div className="grow container flex flex-col py-4">
        <div className="flex justify-between items-center">
          <h1 className="text-4xl text-center my-8">Gestion des articles :</h1>
          <button className="button flex items-center" onClick={() => setCreateModalOpen(true)}>
            <RiAddLine className="-ml-1.5 mr-1" size={24} />
            Nouvel article
          </button>
        </div>
        {articles.length > 0 && (
          <div className="flex flex-col items-center">
            <div className="relative overflow-x-auto shadow-md sm:rounded-lg w-full">
              <table className="w-full text-sm text-left text-gray-500">
                <thead className="text-sm text-gray-700 uppercase bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 w-2/5">
                      Nom de l&apos;article
                    </th>
                    <th scope="col" className="px-6 py-3 w-1/5">
                      Catégorie
                    </th>
                    <th scope="col" className="px-6 py-3 w-1/5">
                      Prix de vente
                    </th>
                    <th scope="col" className="px-6 py-3 w-1/5">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {articles.map((article, key) => (
                    <tr key={key} className="odd:bg-white even:bg-gray-50">
                      <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                        {article.name}
                      </th>
                      <td className="px-6 py-4">
                        {categoryNames[article.category]}
                      </td>
                      <td className="px-6 py-4">
                        {article.sell_price}€
                      </td>
                      <td className="px-6 py-1 flex">
                        <button className="button" onClick={() => setEditingArticle(article)}>
                          <RiEditFill size={20} />
                        </button>
                        <button className="button red ml-3" onClick={() => setDeletingArticle(article)}>
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
      <EditArticleModal editingArticle={editingArticle} setEditingArticle={setEditingArticle} products={products} updateArticle={updateArticle} />
      <DeleteArticleModal deletingArticle={deletingArticle} setDeletingArticle={setDeletingArticle} deleteArticle={deleteArticle} />
      <CreateArticleModal createArticleOpen={createArticleOpen} setCreateModalOpen={setCreateModalOpen} products={products} createArticle={createArticle} />
    </>
  )
}

type EditArticleModalProps = {
  editingArticle: IArticle | null;
  setEditingArticle: (article: IArticle | null) => void;
  products: IProduct[];
  updateArticle: (article: IArticle) => Promise<void>;
}
function EditArticleModal({ editingArticle, setEditingArticle, products, updateArticle }: EditArticleModalProps) {
  const [name, setName] = useState('')
  const [category, setCategory] = useState<Category>(Category.COLD_DRINKS)
  const [sellPrice, setSellPrice] = useState(0)
  const [articleProducts, setArticleProducts] = useState<number[]>([])

  useEffect(() => {
    if (editingArticle) {
      setName(editingArticle.name)
      setCategory(editingArticle.category as Category)
      setSellPrice(editingArticle.sell_price)
      setArticleProducts(editingArticle.products)
    }
  }, [editingArticle]);

  const multiSelectOptions = products
    .map((product) => ({
      value: product.id,
      label: product.name,
    }))

  return <Modal
    isOpen={editingArticle !== null}
    onSubmit={async () => {
      if (!editingArticle) return
      await updateArticle({
        id: editingArticle.id,
        name,
        description: editingArticle.description,
        sell_price: sellPrice,
        category,
        products: articleProducts,
        image: editingArticle.image,
        deleted: editingArticle.deleted,
      })
      setEditingArticle(null)
    }}
    onCancel={() => setEditingArticle(null)}
    title="Modifier le stock"
    submitButtonText="Sauvegarder"
  >
    <div className="my-3">
      <label htmlFor="articleName" className="block mb-2 text-sm font-medium text-gray-900">Nom de l&apos;article :</label>
      <input type="text" id="articleName" value={name} onChange={(e) => setName(e.target.value)} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" required />
    </div>
    <div className="my-3">
      <label className="block mb-2 text-sm font-medium text-gray-900">Catégorie :</label>
      <Select
        value={category}
        setValue={setCategory}
        values={categories}
        accessor={(cat) => categoryNames[cat]}
        className="w-full"
      />
    </div>
    <div className="my-3">
      <label htmlFor="articleSellPrice" className="block mb-2 text-sm font-medium text-gray-900">Prix de vente :</label>
      <input type="number" id="articleSellPrice" value={sellPrice} onChange={(e) => setSellPrice(parseFloat(e.target.value))} step={0.05} min={0} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" required />
    </div>
    <div className="my-3">
      <label className="block mb-2 text-sm font-medium text-gray-900">Produits :</label>
      <MultiSelect
        options={multiSelectOptions}
        placeholder="Sélectionnez un ou plusieurs produits"
        isMulti
        value={articleProducts.map((articleProduct) => multiSelectOptions.find((option) => option.value === articleProduct))}
        onChange={(values) => setArticleProducts(values.map((value) => value!.value))}
        isClearable={false}
      />
    </div>
  </Modal>
}

type DeleteArticleModalProps = {
  deletingArticle: IArticle | null;
  setDeletingArticle: (article: IArticle | null) => void;
  deleteArticle: (article: IArticle) => Promise<void>;
}
function DeleteArticleModal({ deletingArticle, setDeletingArticle, deleteArticle }: DeleteArticleModalProps) {
  return <Modal
    isOpen={deletingArticle !== null}
    onSubmit={async () => {
      if (!deletingArticle) return
      await deleteArticle({ ...deletingArticle })
      setDeletingArticle(null)
    }}
    onCancel={() => setDeletingArticle(null)}
    title="Supprimer l'article"
    submitButtonText="Supprimer"
    submitButtonColor="error"
  >
    <div className="my-3">
      <p>Êtes-vous sûr de vouloir supprimer cet article ?</p>
    </div>
  </Modal>
}

type CreateArticleModalProps = {
  createArticleOpen: boolean;
  setCreateModalOpen: (open: boolean) => void;
  products: IProduct[];
  createArticle: (article: Partial<IArticle>) => Promise<void>;
}
function CreateArticleModal({ createArticleOpen, setCreateModalOpen, products, createArticle }: CreateArticleModalProps) {
  const [name, setName] = useState('')
  const [category, setCategory] = useState(Category.COLD_DRINKS)
  const [sellPrice, setSellPrice] = useState(0)
  const [articleProducts, setArticleProducts] = useState<number[]>([])

  const multiSelectOptions = products
    .filter((product) => !product.deleted)
    .map((product) => ({
      value: product.id,
      label: product.name,
    }))

  return <Modal
    isOpen={createArticleOpen}
    onSubmit={async () => {
      await createArticle({
        name,
        category,
        sell_price: sellPrice,
        products: articleProducts,
      })
      setCreateModalOpen(false)
    }}
    onCancel={() => setCreateModalOpen(false)}
    title="Créer un article"
    submitButtonText="Créer"
  >
    <div className="my-3">
      <label htmlFor="articleName" className="block mb-2 text-sm font-medium text-gray-900">Nom de l&apos;article :</label>
      <input type="text" id="articleName" value={name} onChange={(e) => setName(e.target.value)} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" required />
    </div>
    <div className="my-3">
      <label className="block mb-2 text-sm font-medium text-gray-900">Catégorie :</label>
      <Select
        value={category}
        setValue={setCategory}
        values={categories}
        accessor={(cat) => categoryNames[cat]}
        className="w-full"
      />
    </div>
    <div className="my-3">
      <label htmlFor="articleSellPrice" className="block mb-2 text-sm font-medium text-gray-900">Prix de vente :</label>
      <input type="number" id="articleSellPrice" value={sellPrice} onChange={(e) => setSellPrice(parseFloat(e.target.value))} step={0.05} min={0} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" required />
    </div>
    <div className="my-3">
      <label className="block mb-2 text-sm font-medium text-gray-900">Produits :</label>
      <MultiSelect
        options={multiSelectOptions}
        placeholder="Sélectionnez un ou plusieurs produits"
        isMulti
        value={articleProducts.map((articleProduct) => multiSelectOptions.find((option) => option.value === articleProduct))}
        onChange={(values) => setArticleProducts(values.map((value) => value!.value))}
        isClearable={false}
      />
    </div>
  </Modal>
}

export default withAuthentication(Articles)

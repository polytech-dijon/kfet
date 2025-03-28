import { useEffect, useState } from 'react'
import Head from 'next/head'
import toast from 'react-hot-toast'
import { RiAddLine, RiDeleteBinFill, RiEditFill, RiStarFill, RiStarLine } from 'react-icons/ri'
import { withAuthentication } from '../components/withAuthentication'
import api from '../services/api'
import { categoryNames } from '../utils/db-enum'
import type { NextPage } from 'next'
import type { IArticle } from '../types/db'
import type { ApiRequest } from '../types/api'
import type { DeleteArticlesBody, DeleteArticlesResult, GetArticlesResult, PostArticlesBody, PostArticlesResult, PutArticlesBody, PutArticlesResult } from './api/articles'
import { EditArticleModal } from '../components/articles/editArticle'
import { CreateArticleModal } from '../components/articles/createArticle'
import { DeleteModal } from '../components/deleteModal'

const Articles: NextPage = () => {
  const [articles, setArticles] = useState<IArticle[]>([])
  const [editingArticle, setEditingArticle] = useState<IArticle | null>(null)
  const [deletingArticle, setDeletingArticle] = useState<IArticle | null>(null)
  const [createArticleOpen, setCreateModalOpen] = useState(false)

  async function getArticles() {
    try {
      const { data } = await api.get<GetArticlesResult>('/api/articles')
      setArticles(data.articles)
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

  async function setFavoriteArticle(article: IArticle) {
    article.favorite = !article.favorite;
    updateArticle(article);
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
        <title>KFET KING - Articles</title>
        <meta name="description" content="Gestion des articles de la KFET" />
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
                        <DeleteModal deleteItem={deleteArticle} deletingItem={article}/>
                        <button className="button-outline ml-3" onClick={() => setFavoriteArticle(article)}>
                          {article.favorite ?
                          <RiStarFill size={20} fill='rgb(250 204 21)'/>
                          :
                          <RiStarLine size={20}/>
                          }
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
      <EditArticleModal editingArticle={editingArticle} setEditingArticle={setEditingArticle} updateArticle={updateArticle} />
      <CreateArticleModal createArticleOpen={createArticleOpen} setCreateModalOpen={setCreateModalOpen} createArticle={createArticle} articles={articles} />
    </>
  )
}


export default withAuthentication(Articles)

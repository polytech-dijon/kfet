import { useEffect, useMemo, useState } from 'react'
import Head from 'next/head'
import toast from 'react-hot-toast'
import { RiAddLine, RiSubtractLine, RiArrowGoBackFill, RiCloseLine } from 'react-icons/ri'
import { withAuthentication } from '../components/withAuthentication'
import Modal from '../components/Modal'
import prisma from '../prisma'
import api from '../services/api'
import esipay, { EsipayPaiementResponseStatus } from '../services/esipay'
import { articlesById, mapPrismaItems, Round } from '../utils'
import { categories, categoryNames, paiementMethods, paiementMethodsNames } from '../utils/db-enum'
import { PaiementMethod } from '../types/db'
import type { GetServerSideProps, NextPage } from 'next'
import type { IArticle, IProduct, Category } from '../types/db'
import type { ApiRequest } from '../types/api'
import type { PostCheckoutBody, PostCheckoutResult } from './api/checkout'

interface CheckoutProps {
  articles: IArticle[];
  products: IProduct[];
}
const Checkout: NextPage<CheckoutProps> = ({ articles, products }) => {
  const [categoryOpen, setCategoryOpen] = useState<Category | null>(null)
  const [card, setCard] = useState<IArticle[]>([])
  const [priceAdjustment, setPriceAdjustment] = useState<number | null>(null)

  function addArticle(article: IArticle) {
    setCard(card.concat(article))
  }

  async function submitCard(paiementMethod: PaiementMethod) {
    if (card.length === 0)
      return

    setCategoryOpen(null)

    let toastId: string | null = null
    try {
      const price = priceAdjustment ? priceAdjustment : card.reduce((acc, article) => acc + article.sell_price, 0)
      let idEsipay: string | null = null

      if (paiementMethod === PaiementMethod.ESIPAY) {
        if (!esipay.isConnected()) {
          if (await esipay.start())
            toast.success('EsiPay : connexion réussie')
          else
            return toast.error('EsiPay : échec de la connexion')
        }

        toastId = toast.loading('EsiPay : en attente de la transaction')

        try {
          idEsipay = await esipay.askPayment(price)
        }
        catch {
          toast.error('EsiPay : échec de la transaction', toastId ? { id: toastId } : {})
          return
        }
      }

      const { data } = await api.post<PostCheckoutResult, ApiRequest<PostCheckoutBody>>('/api/checkout', {
        data: {
          card,
          paiementMethod,
          priceAdjustment,
          idEsipay,
        }
      })

      if (paiementMethod === PaiementMethod.ESIPAY && data.paiementResponseStatus !== EsipayPaiementResponseStatus.OK) {
        if (data.paiementResponseStatus === EsipayPaiementResponseStatus.NOT_ENOUGH_MONEY)
          toast.error('EsiPay : solde insuffisant', toastId ? { id: toastId } : {})
        else if (data.paiementResponseStatus === EsipayPaiementResponseStatus.UNKNOWN_CARD)
          toast.error('EsiPay : carte inconnue', toastId ? { id: toastId } : {})
        else
          toast.error('EsiPay : une erreur inconnue est survenue', toastId ? { id: toastId } : {})
        esipay.cancelPayment()
        return
      }

      setCard([])
      setPriceAdjustment(null)
      await esipay.paiementResponse(data.paiementResponseStatus!, data.newBalance!)

      toast.success('EsiPay : transaction réussie', toastId ? { id: toastId } : {})
    }
    catch {
      toast.error('EsiPay : une erreur inconnue est survenue', toastId ? { id: toastId } : {})
      if (paiementMethod === PaiementMethod.ESIPAY)
        esipay.cancelPayment()
    }
  }

  return (
    <>
      <Head>
        <title>KFET KING</title>
        <meta name="description" content="Gestion de la caisse" />
      </Head>
      <div className="grow flex items-stretch">
        {!categoryOpen && (
          <div className="grow container h-[calc(100vh-64px)] overflow-y-auto">
            <div className="flex flex-col justify-center items-center h-full">
              <div className="mt-8 grid grid-cols-2 gap-4">
                {categories.map((category, key) => (
                  <div
                    key={key}
                    className="p-16 card cursor-pointer text-2xl flex justify-center items-center h-32 select-none"
                    onClick={() => setCategoryOpen(category)}
                  >
                    {categoryNames[category]}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
        {categoryOpen && <ArticleList articles={articles} category={categoryOpen} setCategoryOpen={setCategoryOpen} addArticle={addArticle} />}
        <CardOverview card={card} setCard={setCard} submitCard={submitCard} priceAdjustment={priceAdjustment} setPriceAdjustment={setPriceAdjustment} />
      </div>
    </>
  )
}

type ArticleListProps = {
  articles: IArticle[];
  category: Category;
  setCategoryOpen: (category: Category | null) => void;
  addArticle: (article: IArticle) => void;
}
const ArticleList = ({ articles, category, setCategoryOpen, addArticle }: ArticleListProps) => {
  return <div className="grow container h-[calc(100vh-64px)] overflow-y-auto flex flex-col justify-between py-4">
    <div className="grow flex items-center">
      <div className="grow">
        <h2 className="px-4 my-2 text-2xl font-semibold">{categoryNames[category]}</h2>
        <div className="grid grid-cols-4 gap-4 p-4">
          {articles
            .filter((article) => article.category === category && !article.deleted)
            .sort((a, b) => a.name.localeCompare(b.name))
            .map((article, key2) => (
              <div key={key2} className="p-6 card cursor-pointer text-2xl flex justify-center items-center h-32 select-none text-center" onClick={() => addArticle(article)}>
                <h3 className="text-center">{article.name}</h3>
              </div>
            ))
          }
        </div>
      </div>
    </div>
    <div className="flex justify-center">
      <button className="p-16 card cursor-pointer text-2xl flex justify-center items-center h-32 select-none" onClick={() => setCategoryOpen(null)}>
        <RiArrowGoBackFill size={32} className="-ml-1.5 mr-4" />
        Retour
      </button>
    </div>
  </div>
}

type CardOverviewProps = {
  card: IArticle[];
  setCard: (card: IArticle[]) => void;
  submitCard: (paiementMethod: PaiementMethod) => void;
  priceAdjustment: number | null;
  setPriceAdjustment: (price: number | null) => void;
}
const CardOverview = ({ card, setCard, submitCard, priceAdjustment, setPriceAdjustment }: CardOverviewProps) => {
  const [selectedPaimentMethod, setSelectPaimentMethod] = useState<PaiementMethod>(PaiementMethod.CASH)
  const [priceAdjustmentOpen, setPriceAdjustmentOpen] = useState<boolean>(false)

  const total = priceAdjustment !== null ? priceAdjustment : Round(card.reduce((acc, article) => acc + article.sell_price, 0), 2)

  const cardById = useMemo(() => articlesById(card), [card])

  function addArticle(article: IArticle) {
    setCard(card.concat({ ...article }))
  }
  function removeArticle(article: IArticle) {
    const newCard = [...card]
    for (let i = 0; i < newCard.length; i++) {
      if (newCard[i].id === article.id) {
        newCard.splice(i, 1)
        break
      }
    }
    setCard(newCard)
  }

  return <div className="right-0 w-96 bg-white flex flex-col justify-between">
    <h2 className="text-center text-3xl mt-4">Panier :</h2>
    <div className="flex flex-col p-4">
      {cardById.length === 0 && priceAdjustment === null && <div className="text-center text-xl">Aucun article</div>}
      {cardById.map(({ quantity, article }, key) => (
        <div key={key} className="flex justify-between text-xl">
          <span>{article.name}</span>
          <div className="flex justify-center items-center text-2xl">
            <button onClick={() => removeArticle(article)}><RiSubtractLine /></button>
            <span className="mx-2">{quantity}</span>
            <button onClick={() => addArticle(article)}><RiAddLine /></button>
          </div>
        </div>
      ))}
      {priceAdjustment !== null && (
        <div className="flex justify-between text-xl">
          <span className="italic">Ajustement du prix</span>
          <div className="flex justify-center items-center text-2xl">
            <button onClick={() => setPriceAdjustment(null)}><RiCloseLine /></button>
          </div>
        </div>
      )}
      {cardById.length > 0 && <div className="flex justify-center mt-2">
        <button
          className="text-red-600 underline"
          onClick={() => {
            setCard([])
            setPriceAdjustment(null)
          }}
        >
          Supprimer les articles
        </button>
      </div>}
    </div>
    <div className="p-4 flex flex-col justify-between">
      <div className="flex justify-between items-center">
        <div className="underline cursor-pointer" onClick={() => setPriceAdjustmentOpen(true)}>
          Ajuster le prix
        </div>
        <h4 className="text-2xl text-right">Total : {total}€</h4>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2">
        {paiementMethods.map((paiementMethod, key) => (
          <button
            key={key}
            className={`text-xl ${selectedPaimentMethod === paiementMethod ? 'button' : 'button-outline'}`}
            onClick={() => setSelectPaimentMethod(paiementMethod)}
          >
            {paiementMethodsNames[paiementMethod]}
          </button>
        ))}
      </div>
      <div className="mt-2 flex justify-center">
        <button className="button bg-green-700 w-full text-2xl" onClick={() => submitCard(selectedPaimentMethod)}>Valider</button>
      </div>
    </div>
    <PriceAdjustmentModal
      priceAdjustmentOpen={priceAdjustmentOpen}
      setPriceAdjustmentOpen={setPriceAdjustmentOpen}
      priceAdjustment={priceAdjustment}
      ajustPrice={setPriceAdjustment}
      card={card}
    />
  </div>
}

type PriceAdjustmentModalProps = {
  priceAdjustmentOpen: boolean;
  setPriceAdjustmentOpen: (open: boolean) => void;
  priceAdjustment: number | null;
  ajustPrice: (price: number) => void;
  card: IArticle[];
}
function PriceAdjustmentModal({ priceAdjustmentOpen, setPriceAdjustmentOpen, priceAdjustment, ajustPrice, card }: PriceAdjustmentModalProps) {
  const [price, setPrice] = useState(card.reduce((acc, article) => acc + article.sell_price, 0))

  useEffect(() => {
    if (priceAdjustmentOpen)
      setPrice(priceAdjustment !== null ? priceAdjustment : card.reduce((acc, article) => acc + article.sell_price, 0))
  }, [priceAdjustmentOpen])

  async function handleSubmit() {
    ajustPrice(price)
    setPriceAdjustmentOpen(false)
  }

  return <Modal
    isOpen={priceAdjustmentOpen}
    onSubmit={handleSubmit}
    onCancel={() => setPriceAdjustmentOpen(false)}
    title="Ajuster le prix"
    submitButtonText="Ajuster"
  >
    <div className="my-3">
      <label htmlFor="priceAdjustment" className="block mb-2 text-sm font-medium text-gray-900">Ajustement du prix (en €) :</label>
      <input
        type="number"
        id="priceAdjustment"
        value={price}
        onChange={(e) => setPrice(parseFloat(e.target.value))}
        step={0.05}
        min={0}
        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
        required
        onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
      />
    </div>
  </Modal>
}

export const getServerSideProps: GetServerSideProps<CheckoutProps> = async () => {
  const [articles, products] = await Promise.all([
    prisma.article.findMany(),
    prisma.product.findMany(),
  ])
  prisma.$disconnect()
  return {
    props: {
      articles: mapPrismaItems(articles),
      products: mapPrismaItems(products),
    },
  }
}

export default withAuthentication(Checkout)

import { useState } from 'react'
import Head from 'next/head'
import toast from 'react-hot-toast'
import { PrismaClient } from '@prisma/client'
import { RiAddLine, RiSubtractLine } from 'react-icons/ri'
import { withAuthentication } from '../components/withAuthentication'
import api from '../services/api'
import { mapPrismaItems, Round } from '../utils'
import { categories, categoryNames } from '../utils/categories'
import { PaiementMethod } from '../types/db'
import type { GetServerSideProps, NextPage } from 'next'
import type { IArticle, IProduct } from '../types/db'

interface CheckoutProps {
  articles: IArticle[];
  products: IProduct[];
}
const Checkout: NextPage<CheckoutProps> = ({ articles, products }) => {
  const [card, setCard] = useState<IArticle[]>([])

  function addArticle(article: IArticle) {
    setCard(card.concat(article))
  }
  function resetArticles() {
    setCard([])
  }

  async function submitCard(paiementMethod: PaiementMethod) {
    if (card.length === 0)
      return

    try {
      await api.post('/api/checkout', {
        card,
        paiementMethod
      })
  
      setCard([])
      toast.success('Panier envoyé !')
    }
    catch {
      toast.error('Une erreur est survenue')
    }
  }

  return (
    <>
      <Head>
        <title>MEGA KFET</title>
        <meta name="description" content="Cette page n'existe pas." />
      </Head>
      <div className="grow flex items-stretch">
        <ArticleList articles={articles} addArticle={addArticle} />
        <CardOverview card={card} setCard={setCard} submitCard={submitCard} />
      </div>
    </>
  )
}

type ArticleListProps = {
  articles: IArticle[];
  addArticle: (article: IArticle) => void;
}
const ArticleList = ({ articles, addArticle }: ArticleListProps) => {
  return <div className="grow container h-[calc(100vh-64px)] overflow-y-auto">
    {categories.map((category, key1) => <div key={key1}>
      <h2 className="px-4 my-2 text-2xl font-semibold">{categoryNames[category]}</h2>
      <div className="grid grid-cols-4 gap-4 p-4">
        {articles.filter((article) => article.category === category).map((article, key2) => (
          <div key={key2} className="p-6 card cursor-pointer text-2xl flex justify-center items-center h-32 select-none" onClick={() => addArticle(article)}>
            <h3>{article.name}</h3>
          </div>
        ))}
      </div>
    </div>)}
  </div>
}

type CardOverviewProps = {
  card: IArticle[];
  setCard: (card: IArticle[]) => void;
  submitCard: (paiementMethod: PaiementMethod) => void;
}
const CardOverview = ({ card, setCard, submitCard }: CardOverviewProps) => {
  const [selectedPaimentMethod, setSelectPaimentMethod] = useState<PaiementMethod>(PaiementMethod.CASH)

  const total = Round(card.reduce((acc, article) => acc + article.sell_price, 0), 2)

  const cardById: { quantity: number, article: IArticle }[] = []
  for (let article of card) {
    const found = cardById.find((a) => a.article.id === article.id)
    if (found)
      found.quantity++
    else {
      cardById.push({
        quantity: 1,
        article
      })
    }
  }

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
      {cardById.length === 0 && <div className="text-center text-xl">Aucun article</div>}
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
      {cardById.length > 0 && <div className="flex justify-center mt-2">
        <button className="text-red-600 underline" onClick={() => setCard([])}>Supprimer les articles</button>
      </div>}
    </div>
    <div className="p-4 flex flex-col justify-between">
      <div className="flex flex-col">
        <h4 className="text-2xl text-right">Total : {total}€</h4>
      </div>
      <div className="mt-4 grid grid-cols-3 gap-4">
        <button className={`text-xl ${selectedPaimentMethod === PaiementMethod.CASH ? 'button' : 'button-outline'}`} onClick={() => setSelectPaimentMethod(PaiementMethod.CASH)}>Espèce</button>
        <button className={`text-xl ${selectedPaimentMethod === PaiementMethod.LYDIA ? 'button' : 'button-outline'}`} onClick={() => setSelectPaimentMethod(PaiementMethod.LYDIA)}>Lydia</button>
        <button className={`text-xl ${selectedPaimentMethod === PaiementMethod.CARD ? 'button' : 'button-outline'}`} onClick={() => setSelectPaimentMethod(PaiementMethod.CARD)}>Carte bleue</button>
      </div>
      <div className="mt-2 flex justify-center">
        <button className="button bg-green-700 w-full text-2xl" onClick={() => submitCard(selectedPaimentMethod)}>Valider</button>
      </div>
    </div>
  </div>
}

export const getServerSideProps: GetServerSideProps<CheckoutProps> = async () => {
  const prisma = new PrismaClient()
  const [articles, products] = await Promise.all([
    prisma.article.findMany(),
    prisma.product.findMany(),
  ])
  return {
    props: {
      articles: mapPrismaItems(articles),
      products: mapPrismaItems(products),
    },
  }
}

export default withAuthentication(Checkout)

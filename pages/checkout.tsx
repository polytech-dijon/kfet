import Head from 'next/head'
import { withAuthentication } from '../components/withAuthentication'
import type { NextPage } from 'next'

const categories = [
  'hot_drinks',
  'cold_drinks',
  'sweet',
  'salty',
]
const categoryNames: { [key: string]: string } = {
  hot_drinks: 'Boissons chaude',
  cold_drinks: 'Boissons froides',
  sweet: 'Sucré',
  salty: 'Salé',
}

const Checkout: NextPage = () => {
  return (
    <>
      <Head>
        <title>MEGA KFET</title>
        <meta name="description" content="Cette page n'existe pas." />
      </Head>
      <div className="container grow flex flex-col justify-center items-center">
        <div className="mt-8 grid grid-cols-2 gap-4 justify-items-center">
          {categories.map((category, key) => (
            <div key={key} className="p-8 card cursor-pointer text-xl uppercase w-full text-center font-semibold">
              {categoryNames[category]}
            </div>
          ))}
        </div>
      </div>
    </>
  )
}

export default withAuthentication(Checkout)

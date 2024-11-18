import Head from 'next/head'
import Link from 'next/link'
import { withAuthentication } from '../components/withAuthentication'
import type { NextPage } from 'next'

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>KFET KING</title>
        <meta name="description" content="Site de la KFET de Polytech Dijon" />
      </Head>
      <div className="container grow flex flex-col justify-center items-center">
        <div className="mt-6 grid grid-cols-2 gap-4 justify-items-center">
          <Link href="/articles">
            <a className="p-8 card text-xl uppercase w-full text-center font-semibold">
              Gestion des articles
            </a>
          </Link>
          <Link href="/commands">
            <a className="p-8 card text-xl uppercase w-full text-center font-semibold">
              Gestion des commandes
            </a>
          </Link>
        </div>
      </div>
    </>
  )
}

export default withAuthentication(Home)

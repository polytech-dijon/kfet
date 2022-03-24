import Head from 'next/head'
import { withAuthentication } from '../components/withAuthentication'
import type { NextPage } from 'next'

const Page404: NextPage = () => {
  return (
    <>
      <Head>
        <title>MEGA KFET</title>
        <meta name="description" content="Cette page n'existe pas." />
      </Head>
      <div className="container grow flex flex-col justify-center items-center">
        <h1 className="text-4xl font-semibold">Accueil</h1>
      </div>
    </>
  )
}

export default withAuthentication(Page404)

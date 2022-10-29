import Head from 'next/head'
import type { NextPage } from 'next'

const Page500: NextPage = () => {
  return (
    <>
      <Head>
        <title>Erreur - KFET KING</title>
        <meta name="description" content="Une erreur s'est produite lors du chargement de cette page." />
      </Head>
      <div className="container grow flex flex-col justify-center items-center">
        <h1 className="text-4xl font-semibold">Erreur</h1>
        <h3 className="text-xl mt-4">Une erreur s&apos;est produite lors du chargement de cette page.</h3>
      </div>
    </>
  )
}

export default Page500

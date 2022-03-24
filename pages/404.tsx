import Head from 'next/head'
import type { NextPage } from 'next'

const Page404: NextPage = () => {
  return (
    <>
      <Head>
        <title>Page introuvable - BDE MEGA</title>
        <meta name="description" content="Cette page n'existe pas." />
      </Head>
      <div className="container grow flex flex-col justify-center items-center">
        <h1 className="text-4xl font-semibold">Page introuvable</h1>
        <h3 className="text-xl mt-4">Cette page n&apos;existe pas.</h3>
      </div>
    </>
  )
}

export default Page404

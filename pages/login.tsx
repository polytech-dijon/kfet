import { useState } from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import toast from 'react-hot-toast'
import { useDispatch } from 'react-redux'
import { login } from '../redux/actions'
import api from '../services/api'
import type { NextPage } from 'next'
import type { SigninData } from '../types/authentication'

const Page404: NextPage = () => {
  const router = useRouter()
  const dispatch = useDispatch()

  const [password, setPassword] = useState('')

  async function handleSubmit() {
    try {
      const { data } = await api.post<SigninData, { password: string }>('/api/login', { password })
      const { access_token } = data
      dispatch(login({ accessToken: access_token }))
      api.setToken(access_token)

      await router.push("/")
      toast.success("Connexion effectuée !")
    }
    catch {
      toast.error("Mot de passe incorrect !")
    }
  }

  return (
    <>
      <Head>
        <title>MEGA KFET - Connexion</title>
        <meta name="description" content="Cette page n'existe pas." />
      </Head>
      <div className="container grow flex flex-col justify-center items-center">
        <div>
          <h1 className="text-4xl font-semibold">KFET - Connexion</h1>
          <div className="mt-6">
            <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900">Mot de passe :</label>
            <input type="text" id="password" value={password} onChange={(e) => setPassword(e.target.value)} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" required />
            <button type="button" onClick={handleSubmit} className="mt-2 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Let&apos;s go !</button>
          </div>
        </div>
      </div>
    </>
  )
}

export default Page404

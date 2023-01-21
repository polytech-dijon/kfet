import { useState } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/router'
import toast from 'react-hot-toast'
import { useDispatch } from 'react-redux'
import { login } from '../redux/actions'
import api from '../services/api'
import type { NextPage } from 'next'
import type { SigninData } from '../types/authentication'

const Login: NextPage = () => {
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
        <title>KFET KING - Connexion</title>
        <meta name="description" content="Connexion à la KFET" />
      </Head>
      <div className="container grow flex flex-col justify-center items-center">
        <div>
          <div className="flex justify-center">
            <Image src="/kfet-king.svg" alt="Logo" width={256} height={256} />
          </div>
          <div className="mt-4 mb-16 flex justify-center">
            <Link href="/commands">
              <a className="mt-2 button-outline">
                Liste des commandes
              </a>
            </Link>
          </div>
          <div className="mt-6">
            <h3 className="text-xl font-semibold">Connexion</h3>
            <div className="flex mt-2 w-full gap-2">
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block flex-1 p-2.5"
                onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
                placeholder="Mot de passe"
                required
              />
              <button
                type="button"
                onClick={handleSubmit}
                className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
              >
                Let&apos;s go !
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Login

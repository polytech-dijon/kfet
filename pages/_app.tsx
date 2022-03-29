import '../styles/globals.css'
import { useEffect, useState } from 'react'
import Head from 'next/head'
import { Provider, useSelector } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import { Toaster } from 'react-hot-toast'
import { useRouter } from 'next/router'
import { useDispatch } from 'react-redux'
import { store, persistor } from '../redux/store'
import { logout } from '../redux/actions'
import Navbar from '../components/Navbar'
import api from '../services/api'
import type { AppProps } from 'next/app'
import type { RootState } from '../redux/store'

function AppContainer(props: AppProps) {
  if (typeof window === 'undefined') { // SSR
    return <Provider store={store}>
      <MyApp {...props} />
    </Provider>
  }
  else { // Client
    return <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <MyApp {...props} />
      </PersistGate>
    </Provider>
  }
}

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter()
  const dispatch = useDispatch()
  const accessToken: string | null = useSelector((state: RootState) => state.accessToken)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    (async () => {
      if (accessToken) {
        api.setToken(accessToken)
        try {
          await api.get('/api/verifyAuth')
          setLoaded(true)
        }
        catch {
          api.setToken(null)
          setLoaded(true)
          dispatch(logout())
          router.push('/')
        }
      }
      else
        setLoaded(true)
    })()
  }, [])

  return <div>
    <Head>
      <link rel="icon" href="/favicon.ico" />
    </Head>
    {!loaded && (
      <div className="flex flex-col min-h-screen bg-background-light text-black">
        Chargement...
      </div>
    )}
    {loaded && (
      <div className="flex flex-col min-h-screen bg-background-light text-black">
        {accessToken ? <Navbar /> : null}
        <Component {...pageProps} />
      </div>
    )}
    <Toaster />
  </div>
}

export default AppContainer

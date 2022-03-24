import '../styles/globals.css'
import { useEffect } from 'react'
import Head from 'next/head'
import { Provider, useSelector } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import { store, persistor } from '../redux/store'
import { Toaster } from 'react-hot-toast'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
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
  const accessToken: string | null = useSelector((state: RootState) => state.accessToken)

  useEffect(() => {
    api.setToken(accessToken)
  }, [])

  return <div>
    <Head>
      <link rel="icon" href="/favicon.ico" />
    </Head>
    <div className="flex flex-col min-h-screen bg-background-light text-black">
      {/* {accessToken ? <Navbar /> : null} */}
      <Component {...pageProps} />
      {/* {accessToken ? <Footer /> : null} */}
    </div>
    <Toaster />
  </div>
}

export default AppContainer

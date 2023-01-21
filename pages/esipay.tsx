import { useState } from 'react'
import Head from 'next/head'
import { HiCheck, HiExclamation } from 'react-icons/hi'
import toast from 'react-hot-toast'
import api from '../services/api'
import esipay, { PACKET_IDS, ReadCardResult } from '../services/esipay'
import { withAuthentication } from '../components/withAuthentication'
import Modal from '../components/Modal'
import { wait } from '../utils'
import type { NextPage } from 'next'

const EsipayPage: NextPage = () => {
  const [password, setPassword] = useState('')
  const [logged, setLogged] = useState(false)

  async function login() {
    try {
      const { ok } = await api.post('/api/esipay/login', { password })
      if (!ok) throw new Error()
      toast.success("Connexion réussie !")
      setLogged(true)
    }
    catch {
      toast.error("Mot de passe incorrect")
    }
  }

  return (
    <>
      <Head>
        <title>Gestion EsiPay - KFET KING</title>
        <meta name="description" content="Page de gestion d'EsiPay" />
      </Head>
      <div className="container grow flex flex-col justify-center items-center">
        <h1 className="text-4xl font-semibold">Gestion d&apos;EsiPay</h1>
        {!logged && (
          <div className="mt-4 flex gap-2 justify-center items-center">
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block flex-1 p-2.5"
              onKeyDown={(e) => e.key === 'Enter' && login()}
              placeholder="Mot de passe"
              required
            />
            <button
              type="button"
              onClick={login}
              className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            >
              Let&apos;s go !
            </button>
          </div>
        )}
        {logged && (
          <div className="mt-6 flex gap-4 justify-center items-stretch">
            <ReadCardModal />
            <WriteCardModal />
          </div>
        )}
      </div>
    </>
  )
}

const ReadCardModal = () => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [cardInfos, setCardInfos] = useState<ReadCardResult | null>(null);

  async function readCardCallback(result: number[]) {
    setCardInfos(esipay.parseRead(result))
  }
  async function readCard() {
    if (!(await esipay.start())) return
    setIsModalOpen(true)
    esipay.once(PACKET_IDS.READ_RESPONSE, readCardCallback)
    esipay.write(PACKET_IDS.ASK_READ, [])
  }
  async function cancel() {
    if (!cardInfos) {
      esipay.off(PACKET_IDS.READ_RESPONSE, readCardCallback)
      esipay.write(PACKET_IDS.CANCEL_READ, [])
    }
    setIsModalOpen(false)
    await wait(300)
    setCardInfos(null)
  }

  return <>
    <button className="button w-48" onClick={() => readCard()}>Lire une carte</button>
    <Modal
      isOpen={isModalOpen}
      cancelButtonText={cardInfos ? "Fermer" : "Annuler"}
      onCancel={() => cancel()}
      submitButton={false}
      title="Lire une carte"
    >
      <div>
        {!cardInfos && (
          <span>En attente de la carte...</span>
        )}
        {cardInfos && !cardInfos.success && (
          <span>Erreur de lecture</span>
        )}
        {cardInfos && cardInfos.success && (
          <div className="pt-2 flex flex-col gap-1">
            <span>Identifiant uB : {cardInfos.idUb}</span>
            <span>Nom : {cardInfos.lastname}</span>
            <span>Prénom : {cardInfos.firstname}</span>
            <span>Date d&apos;écriture de la carte : {new Date(cardInfos.timestamp).toLocaleString()}</span>
          </div>
        )}
      </div>
    </Modal>
  </>
}

const WriteCardModal = () => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [state, setState] = useState<'idle' | 'fetching' | 'writing' | 'done' | 'error'>('idle')
  const [idUb, setIdUb] = useState('')
  const [error, setError] = useState('')

  async function writeCardCallback(result: number[]) {
    setState('done')
  }
  async function writeCard() {
    if (!idUb) return
  
    try {
      setState('fetching')
      const { data } = await api.post('/api/esipay/write-card', { idUb })

      if (!(await esipay.start())) return setState('idle')
      setState('writing')
      esipay.once(PACKET_IDS.CREATE_RESPONSE, writeCardCallback)
      esipay.writeCard(data.idEsipay, data.firstname, data.lastname, data.timestamp, data.idUb)
    }
    catch (e: any) {
      console.log("write error", e)
      setState('error')
      if (e.error === 'Invalid id')
        setError('Erreur : identifiant uB invalide')
      else
        setError('Erreur lors de l\'écriture de la carte')
    }
  }
  async function cancel() {
    if (state === 'writing') {
      esipay.off(PACKET_IDS.CREATE_RESPONSE, writeCardCallback)
      esipay.write(PACKET_IDS.CANCEL_CREATE, [])
    }
    setIsModalOpen(false)
    await wait(300)
    setState('idle')
  }

  return <>
    <button className="button w-48" onClick={() => setIsModalOpen(true)}>Écrire une carte</button>
    <Modal
      isOpen={isModalOpen}
      cancelButton={state === 'idle' || state === 'error'}
      onCancel={() => cancel()}
      submitButton={state === 'idle' || state === 'done'}
      submitButtonText={state === 'done' ? "OK" : "Écrire"}
      onSubmit={() => state === 'done' ? cancel() : writeCard()}
      title="Écrire une carte"
    >
      <div className="pt-2">
        {state === 'idle' && (
          <div className="flex flex-col gap-2 justify-center items-center">
            <span>Entrez l&apos;identifiant uB de la carte :</span>
            <input type="text" className="input-field w-32" placeholder="ab123456" value={idUb} onChange={(e) => setIdUb(e.target.value)} />
            <span className="mt-2 text-red-500 flex items-center gap-1">
              <HiExclamation className="text-2xl" />
              Cette opération est irréversible !
            </span>
          </div>
        )}
        {state === 'fetching' && (
          <span>Récupération des informations...</span>
        )}
        {state === 'writing' && (
          <span>En attente de la carte à écrire...</span>
        )}
        {state === 'done' && (
          <span className="mt-2 flex items-center gap-1">
            <HiCheck className="text-2xl text-green-500" />
            La carte a été écrite !
          </span>
        )}
        {state === 'error' && (
          <span className="mt-2 flex items-center gap-1">
            <HiExclamation className="text-2xl text-red-500" />
            {error || "Une erreur s'est produite lors de l'écriture."}
          </span>
        )}
      </div>
    </Modal>
  </>
}

export default withAuthentication(EsipayPage)

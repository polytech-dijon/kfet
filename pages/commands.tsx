import { useEffect, useState } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { useSelector } from 'react-redux'
import toast from 'react-hot-toast'
import api from '../services/api'
import type { NextPage } from 'next'
import type { Command } from '../types/db'
import type { ApiRequest } from '../types/api'
import type { RootState } from '../redux/store'
import type { DeleteCommandBody, DeleteCommandResult, GetCommandResult, PostCommandBody, PostCommandResult, PutCommandBody, PutCommandResult } from './api/commands'
import { CommandsPanel } from '../components/commands/commandsPanel'
import { CommandsList } from '../components/commands/commandList'


const Commands: NextPage = () => {
  const accessToken: string | null = useSelector((state: RootState) => state.accessToken)
  const [commands, setCommands] = useState<Command[] | null>(null)
  const [commandsListOpen, setCommandsListOpen] = useState(false)

  async function getCommand() {
    try {
      const { data } = await api.get<GetCommandResult>('/api/commands')
      setCommands(data.commands)
    }
    catch {
      toast.error('Une erreur est survenue')
    }
  }

  async function updateCommand(command: Command) {
    try {
      await api.put<PutCommandResult, ApiRequest<PutCommandBody>>('/api/commands', {
        data: {
          command,
        },
      })
      await getCommand()
      toast.success('Commande mise à jour !')
    }
    catch (e) {
      console.error(e)
      toast.error('Une erreur est survenue...')
    }
  }

  async function deleteCommand(command: Command) {
    try {
      await api.remove<DeleteCommandResult, ApiRequest<DeleteCommandBody>>('/api/commands', {
        data: {
          id: command.id,
        },
      })
      await getCommand()
      toast.success('Commande supprimée !')
    }
    catch (e) {
      console.error(e)
      toast.error('Une erreur est survenue...')
    }
  }

  async function createCommand(command: Partial<Command>) {
    try {
      await api.post<PostCommandResult, ApiRequest<PostCommandBody>>('/api/commands', {
        data: {
          command,
        },
      })
      await getCommand()
      toast.success('Commande créée !')
    }
    catch (e) {
      console.error(e)
      toast.error('Une erreur est survenue...')
    }
  }

  useEffect(() => {
    getCommand()
    const interval = setInterval(() => {
      getCommand()
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  return (
    <>
      <Head>
        <title>Commandes - KFET KING</title>
        <meta name="description" content="Cette page n'existe pas." />
      </Head>
      <div className="container grow flex flex-col justify-center items-center">
        {accessToken && <>
          {!commandsListOpen && <>
            <CommandsPanel commands={commands} updateCommand={updateCommand} deleteCommand={deleteCommand} createCommand={createCommand} />
            <button
              className="mt-6 button-outline"
              onClick={() => setCommandsListOpen(true)}
            >
              Ouvrir la liste des commandes
            </button>
          </>}
          {commandsListOpen && <div className="fixed top-0 left-0 right-0 w-screen h-screen bg-background-light grow flex flex-col justify-center items-center z-30">
            <CommandsList commands={commands} />
            <div className="fixed bottom-2 right-0">
              <button
                className="mr-4 button-outline"
                onClick={() => setCommandsListOpen(false)}
              >
                Retour
              </button>
            </div>
          </div>}
        </>}
        {!accessToken && <div className="fixed top-0 left-0 right-0 w-screen h-screen bg-background-light grow flex flex-col justify-center items-center z-30">
          <CommandsList commands={commands} />
          <div className="fixed bottom-2 right-0">
            <Link href="/login">
              <a className="mr-4 button-outline">
                Connexion
              </a>
            </Link>
          </div>
        </div>}
      </div>
    </>
  )
}

export default Commands

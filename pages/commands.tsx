import { useEffect, useState } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import Image from 'next/image'
import { useSelector } from 'react-redux'
import toast from 'react-hot-toast'
import { RiAddLine, RiDeleteBinFill, RiEditFill, RiCheckboxCircleLine, RiTimeLine, RiFileListLine } from 'react-icons/ri'
import api from '../services/api'
import Modal from '../components/Modal'
import Select from '../components/Select'
import { commandStatus, commandStatusNames } from '../utils/db-enum'
import { CommandStatus, IArticle } from '../types/db'
import type { NextPage } from 'next'
import type { Command } from '../types/db'
import type { ApiRequest } from '../types/api'
import type { RootState } from '../redux/store'
import type { DeleteCommandBody, DeleteCommandResult, GetCommandResult, PostCommandBody, PostCommandResult, PutCommandBody, PutCommandResult } from './api/commands'
import type { GetArticlesResult } from './api/articles'

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

type CommandsList = {
  commands: Command[] | null;
}
const CommandsList = ({ commands }: CommandsList) => {
  if (!commands)
    return <p>Chargement...</p>

  const Item = ({ command }: { command: Command }) => (
    <div className="flex flex-row gap-y-4 justify-between items-center border-gray-300 mt-5 pt-4">
      <div className="flex flex-col">
        <span className="text-5xl font-semibold">{command.title}</span>
        <span className="text-4xl">{command.description}</span>
      </div>
      {command.status === CommandStatus.IN_PROGRESS && <RiTimeLine className="text-5xl" />}
      {command.status === CommandStatus.DONE && <RiCheckboxCircleLine className="text-5xl" />}
    </div>
  )

  return <div className="flex-1 w-full h-full grid grid-cols-2 grid-flow-row relative">
    <div className="border-r-4 border-black flex flex-col">
      <div className="bg-orange-400 h-40 text-6xl text-white text-center flex justify-center items-center font-bold">
        <span>Commandes en préparation</span>
      </div>
      <div className="flex-1 flex flex-col items-center">
        <div className="grid grid-rows-6 grid-flow-col gap-x-16">
          {commands
            .filter((command) => command.status === CommandStatus.IN_PROGRESS)
            .map((command) => <Item key={command.id} command={command} />)
          }
        </div>
      </div>
    </div>
    <div>
      <div className="bg-green-700 h-40 text-6xl text-white text-center flex justify-center items-center font-bold">
        <span>Commandes prêtes</span>
      </div>
      <div className="flex-1 flex flex-col items-center">
        <div className="grid grid-rows-6 grid-flow-col gap-x-16">
          {commands
            .filter((command) => command.status === CommandStatus.DONE)
            .map((command) => <Item key={command.id} command={command} />)
          }
        </div>
      </div>
    </div>
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 bg-white rounded-full">
      <Image src="/kfet-king.svg" width={192} height={192} alt="" />
    </div>
    {/* <div className="flex-1 w-full h-full grid grid-cols-2 grid-flow-row">
      {commands.map((command) => (
        <div key={command.id} className="flex flex-row gap-6 justify-between items-center border-gray-300 mt-5 pt-4 min-w-[16rem]">
          <div className="flex flex-col">
            <span className="text-xl font-semibold">{command.title}</span>
            <span className="text-sm">{command.description}</span>
          </div>
          <div className="flex flex-row justify-between items-center">
            <span className="text-sm mr-1.5 mb-0.5">{commandStatusNames[command.status]}</span>
            {command.status === CommandStatus.DONE && <RiCheckboxCircleLine className="text-green-500" />}
            {command.status === CommandStatus.IN_PROGRESS && <RiTimeLine className="text-yellow-500" />}
            {command.status === CommandStatus.PENDING && <RiFileListLine className="text-gray-500" />}
          </div>
        </div>
      ))}
    </div> */}
  </div>
}

type CommandsPanelProps = {
  commands: Command[] | null;
  updateCommand: (command: Command) => Promise<void>;
  deleteCommand: (command: Command) => Promise<void>;
  createCommand: (command: Partial<Command>) => Promise<void>;
}
const CommandsPanel = ({ commands, createCommand, deleteCommand, updateCommand }: CommandsPanelProps) => {
  const [articles, setArticles] = useState<IArticle[] | null>(null)
  const [isNewCommandOpen, setIsNewCommandOpen] = useState(false)
  const [editingCommand, setEditingCommand] = useState<Command | null>(null)

  /**
   * Convert a timestamp to a readable time taking into account the timezone offset
   * @param timestamp The timestamp to convert
   * @returns The readable time
   */
  function toReadableCurrentTime(timestamp: Date) {
    timestamp = new Date(timestamp)
    let offset = timestamp.getTimezoneOffset()
    timestamp = new Date(timestamp.getTime() - (offset * 60000))
    return timestamp.toISOString().substring(11, 19)
  }
  
  async function getArticles() {
    try {
      const { data } = await api.get<GetArticlesResult>('/api/articles')
      data.articles.sort((a, b) => a.favorite === b.favorite ? 0 : a.favorite ? -1 : 1)
      setArticles(data.articles)
    }
    catch {
      toast.error('Une erreur est survenue')
    }
  }

  useEffect(() => {
    getArticles()
  }, [])

  if (!commands || !articles) {
    return <>
      <h1 className="text-4xl font-semibold">Gestion des commandes</h1>
      <p>Chargement...</p>
    </>
  }

  return <>
    <h1 className="text-4xl font-semibold">Gestion des commandes</h1>
    <div className="my-4">
      <button className="button flex items-center gap-2" onClick={() => setIsNewCommandOpen(true)}>
        <RiAddLine />
        <span>Nouvelle commande</span>
      </button>
      <EditCommandModal isOpen={isNewCommandOpen} onClose={() => setIsNewCommandOpen(false)} onSubmit={createCommand} articles={articles} />
    </div>
    <div>
      {commands.length === 0 && (
        <div className="flex justify-center">
          Aucune commande trouvée.
        </div>
      )}
      {commands.length > 0 && (
        <div className="flex justify-center relative overflow-x-auto shadow-md sm:rounded-lg w-full">
          <table className="w-full text-sm text-left text-gray-500">
            <thead className="text-sm text-gray-700 uppercase bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 w-1/6">
                  Nom
                </th>
                <th scope="col" className="px-6 py-3 w-1/3">
                  Description
                </th>
                <th scope="col" className="px-6 py-3 w-1/6">
                  Statut
                </th>
                <th scope="col" className="px-6 py-3 w-1/6">
                  Heure de création
                </th>
                <th scope="col" className="px-6 py-3 w-1/6">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {commands.map((command, key) => (
                <tr key={key} className="bg-white">
                  <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                    {command.title}
                  </th>
                  <td className="px-6 py-4">
                    {command.description || <span className="italic">Aucune description</span>}
                  </td>
                  <td className="px-6 py-4">
                    {commandStatusNames[command.status]}
                  </td>
                  <td className="px-6 py-4">
                    {toReadableCurrentTime(command.created_at)}
                  </td>
                  <td className="px-6 py-1 flex gap-1.5">
                    <button className="button" onClick={() => setEditingCommand(command)}>
                      <RiEditFill size={20} />
                      <EditCommandModal isOpen={editingCommand?.id === command.id} command={editingCommand || {}} onClose={() => setEditingCommand(null)} onSubmit={(c) => updateCommand(c as Command)} articles={articles} />
                    </button>
                    <button className="button red" onClick={() => deleteCommand(command)}>
                      <RiDeleteBinFill size={20} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  </>
}

type EditCommandModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (command: Partial<Command>) => Promise<void>;
  articles: IArticle[];
  command?: Partial<Command>;
}
const EditCommandModal = ({ isOpen, onClose, onSubmit, articles, command }: EditCommandModalProps) => {
  const [title, setTitle] = useState('')
  const [article, setArticle] = useState<IArticle | null>(null)
  // const [description, setDescription] = useState('')
  const [status, setStatus] = useState<CommandStatus>(CommandStatus.PENDING)
  // const [estimatedEnd, setEstimatedEnd] = useState<string | null>(null)

  useEffect(() => {
    if (!command)
      return
    setTitle(command.title || '')
    setArticle(articles.find((a) => a.name === command.description) || null)
    // setDescription(command.description || '')
    setStatus(command.status as CommandStatus || CommandStatus.PENDING)
  }, [command])

  return (
    <>
      <Modal
        isOpen={isOpen}
        onSubmit={async () => {
          if (!title)
            return toast.error('Nom de commande requis !')
          await onSubmit({ ...command, title, description: article ? article.name : '', status, estimated_end: null })
          if (!command) {
            setTitle('')
            setArticle(null)
            // setDescription('')
            setStatus(CommandStatus.PENDING)
          }
          onClose()
        }}
        onCancel={() => onClose()}
        title="Nouvelle commande"
        submitButtonText="Sauvegarder"
      >
        <div className="my-3">
          <label htmlFor="commandTitle" className="block mb-2 text-sm font-medium text-gray-900">Nom de la commande :</label>
          <input type="text" id="commandTitle" value={title} onChange={(e) => setTitle(e.target.value)} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" required />
        </div>
        <div className="my-3">
          <label htmlFor="commandDescription" className="block mb-2 text-sm font-medium text-gray-900">Description (optionnel) :</label>
          <Select
            value={article}
            setValue={setArticle}
            values={articles}
            accessor={(a) => !!a ? a.name+(a.favorite?"⭐":"") : "Nom de l'article..."}
            className="w-72"
          />
        </div>
        <div className="my-3">
          <label htmlFor="commandStatus" className="block mb-2 text-sm font-medium text-gray-900">Statut de la commande :</label>
          <Select
            value={status}
            setValue={setStatus}
            values={commandStatus}
            accessor={(s) => commandStatusNames[s]}
            className="w-40"
          />
        </div>
        {/* <div className="my-3">
          <label htmlFor="commandEstimatedEnd" className="block mb-2 text-sm font-medium text-gray-900">Date de fin estimée (optionnel) :</label>
          <input type="number" id="commandEstimatedEnd" value={estimatedEnd || ''} onChange={(e) => setEstimatedEnd(e.target.value || null)} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" />
        </div> */}
      </Modal>
    </>
  )
}

export default Commands

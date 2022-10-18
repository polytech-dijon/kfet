import { useEffect, useState } from 'react'
import Head from 'next/head'
import toast from 'react-hot-toast'
import { RiAddLine, RiDeleteBinFill, RiEditFill } from 'react-icons/ri'
import { withAuthentication } from '../components/withAuthentication'
import api from '../services/api'
import Modal from '../components/Modal'
import Select from '../components/Select'
import type { NextPage } from 'next'
import { Command, CommandStatus } from '../types/db'
import type { ApiRequest } from '../types/api'
import type { DeleteCommandBody, DeleteCommandResult, GetCommandResult, PostCommandBody, PostCommandResult, PutCommandBody, PutCommandResult } from './api/commands'
import { commandStatus, commandStatusNames } from '../utils/db-enum'

const Commands: NextPage = () => {
  const [commands, setCommands] = useState<Command[]>([])
  const [isNewCommandOpen, setIsNewCommandOpen] = useState(false)
  const [editingCommand, setEditingCommand] = useState<Command | null>(null)

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
  }, [])

  return (
    <>
      <Head>
        <title>Commandes - MEGA KFET</title>
        <meta name="description" content="Cette page n'existe pas." />
      </Head>
      <div className="container grow flex flex-col justify-center items-center">
        <h1 className="text-4xl font-semibold">Gestion des commandes</h1>
        <div className="my-4">
          <button className="button flex items-center gap-2" onClick={() => setIsNewCommandOpen(true)}>
            <RiAddLine />
            <span>Nouvelle commande</span>
          </button>
          <EditCommandModal isOpen={isNewCommandOpen} onClose={() => setIsNewCommandOpen(false)} onSubmit={createCommand} />
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
                        {new Date(command.created_at).toISOString().substring(11, 19)}
                      </td>
                      <td className="px-6 py-1 flex gap-1.5">
                        <button className="button" onClick={() => setEditingCommand(command)}>
                          <RiEditFill size={20} />
                          <EditCommandModal isOpen={editingCommand?.id === command.id} command={editingCommand || {}} onClose={() => setEditingCommand(null)} onSubmit={(c) => updateCommand(c as Command)} />
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
      </div>
    </>
  )
}

type EditCommandModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (command: Partial<Command>) => Promise<void>;
  command?: Partial<Command>;
}
const EditCommandModal = ({ isOpen, onClose, onSubmit, command }: EditCommandModalProps) => {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [status, setStatus] = useState<CommandStatus>(CommandStatus.PENDING)
  // const [estimatedEnd, setEstimatedEnd] = useState<string | null>(null)

  useEffect(() => {
    if (!command)
      return
    setTitle(command.title || '')
    setDescription(command.description || '')
    setStatus(command.status as CommandStatus || CommandStatus.PENDING)
  }, [command])

  return (
    <>
      <Modal
        isOpen={isOpen}
        onSubmit={async () => {
          if (!title)
            return toast.error('Nom de commande requis !')
          await onSubmit({ ...command, title, description, status, estimated_end: null })
          if (!command) {
            setTitle('')
            setDescription('')
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
          <textarea id="commandDescription" value={description} onChange={(e) => setDescription(e.target.value)} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" />
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

export default withAuthentication(Commands)

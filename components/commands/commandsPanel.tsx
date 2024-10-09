import { Command } from "@prisma/client";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { RiAddLine, RiEditFill, RiDeleteBinFill } from "react-icons/ri";
import StatusSelector from "../StatusSelector";
import api from "../../services/api";
import { IArticle } from "../../types/db";
import { GetArticlesResult } from "../../pages/api/articles";
import { EditCommandModal } from "./editCommandModal";

type CommandsPanelProps = {
  commands: Command[] | null;
  updateCommand: (command: Command) => Promise<void>;
  deleteCommand: (command: Command) => Promise<void>;
  createCommand: (command: Partial<Command>) => Promise<void>;
}

export const CommandsPanel = ({ commands, createCommand, deleteCommand, updateCommand }: CommandsPanelProps) => {
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
                    <StatusSelector command={command} onClick={updateCommand} />
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
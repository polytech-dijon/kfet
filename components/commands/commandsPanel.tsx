import { Command } from "@prisma/client";
import { IconButton } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import { RiAddLine, RiDeleteBinFill } from "react-icons/ri";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import StatusSelector from "../StatusSelector";
import api from "../../services/api";
import { IArticle } from "../../types/db";
import { GetArticlesResult } from "../../pages/api/articles";
import { NewCommandModal } from "./newCommandModal";
import { CommandNameField } from "./commandNameField";
import { Countdown } from "../CountDown";
import { EditCommandArticleModal } from "./editCommandArticleModal";
import { Timer } from "../Timer";

type CommandsPanelProps = {
  commands: Command[] | null;
  updateCommand: (command: Command) => Promise<void>;
  deleteCommand: (command: Command) => Promise<void>;
  createCommand: (command: Partial<Command>) => Promise<void>;
}

export const CommandsPanel = ({ commands, createCommand, deleteCommand, updateCommand }: CommandsPanelProps) => {
  const [articles, setArticles] = useState<IArticle[] | null>(null)
  const [isNewCommandOpen, setIsNewCommandOpen] = useState(false)
  const [isEditingCommandOpen, setIsEditingCommandOpen] = useState(false)
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

  const openEditArticleModal = (command: Command) => {
    setEditingCommand(command)
    setIsEditingCommandOpen(true)
  }

  useEffect(() => {
    getArticles()
  }, [commands])

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
      <NewCommandModal isOpen={isNewCommandOpen} onClose={() => setIsNewCommandOpen(false)} onSubmit={createCommand} articles={articles} />
      <EditCommandArticleModal isOpen={isEditingCommandOpen} onClose={() => setIsEditingCommandOpen(false)} onSubmit={updateCommand} articles={articles} command={editingCommand!} />
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
                  Temps avant suppression
                </th>
                <th scope="col" className="px-6 py-3 w-1/6">
                  Supprimer
                </th>
              </tr>
            </thead>
            <tbody>
              {commands.map((command, key) => (
                <tr key={key} className="bg-white">
                  <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                    <CommandNameField currentName={command.title} setNewName={(newName : string)=>updateCommand({...command, title : newName})}/>
                  </th>
                  <td className="px-6 py-4">
                    {command.description || <span className="italic">Aucune description</span>}
                    <IconButton
                      onClick={() => openEditArticleModal(command)}
                    >
                      <EditIcon />
                    </IconButton>
                  </td>
                  <td className="px-6 py-4">
                    <StatusSelector command={command} onClick={updateCommand} />
                  </td>
                  <td className="px-6 py-4">
                    À {toReadableCurrentTime(command.created_at)}
                    <br />
                    Il y a <Timer acceptable_wait_time={15} long_wait_time={20} created_at={command.created_at as unknown as number} />
                  </td>
                  <td className="px-6 py-4">
                    {
                      command.expires_at === null ? <span className="italic">Aucune suppression planifiée</span> :
                        <Countdown initialSeconds={(command.expires_at as unknown as number)- Date.now()} />
                    }
                  </td>
                  <td className="px-1 py-1 text-center">
                    <button className="button red inline-flex" onClick={() => deleteCommand(command)}>
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
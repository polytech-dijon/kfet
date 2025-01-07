import { Command } from "@prisma/client";
import { IconButton } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import { useState } from "react";
import StatusSelector from "../StatusSelector";
import { CommandNameField } from "./commandNameField";
import { Countdown } from "../CountDown";
import { Timer } from "../Timer";
import { DeleteModal } from "../deleteModal";
import { EditCommandArticleModal } from "./editCommandArticleModal";

type CommandsPanelProps = {
    commands: Command[];
    updateCommand: (command: Command) => Promise<void>;
    deleteCommand: (command: Command) => Promise<void>;
}

export const CommandsTable = ({ commands, deleteCommand, updateCommand }: CommandsPanelProps) => {
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

    const openEditArticleModal = (command: Command) => {
        setEditingCommand(command)
        setIsEditingCommandOpen(true)
    }

    return <>
        <EditCommandArticleModal isOpen={isEditingCommandOpen} onClose={() => setIsEditingCommandOpen(false)} onSubmit={updateCommand} command={editingCommand!} />
        <table className="w-full text-sm text-left text-gray-500 shadow-md sm:rounded-lg">
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
                            <CommandNameField currentName={command.title} setNewName={(newName: string) => updateCommand({ ...command, title: newName })} />
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
                                    <Countdown initialSeconds={(command.expires_at as unknown as number) - Date.now()} />
                            }
                        </td>
                        <td className="px-1 py-1 text-center">
                            <DeleteModal deleteItem={deleteCommand} deletingItem={command} />
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    </>
}
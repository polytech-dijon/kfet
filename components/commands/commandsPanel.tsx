import { Command } from "@prisma/client";
import { RiAddLine } from "react-icons/ri";
import { useState } from "react";
import { NewCommandModal } from "./newCommandModal";
import { CommandsTable } from "./commandTable";

type CommandsPanelProps = {
  commands: Command[] | null;
  updateCommand: (command: Command) => Promise<void>;
  deleteCommand: (command: Command) => Promise<void>;
  createCommand: (command: Partial<Command>) => Promise<void>;
}

export const CommandsPanel = ({ commands, createCommand, deleteCommand, updateCommand }: CommandsPanelProps) => {
  const [isNewCommandOpen, setIsNewCommandOpen] = useState(false)

  if (!commands) {
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
      <NewCommandModal isOpen={isNewCommandOpen} onClose={() => setIsNewCommandOpen(false)} onSubmit={createCommand}/>
    </div>
    <div>
      {commands.length === 0 && (
        <div className="flex justify-center">
          Aucune commande trouvée.
        </div>
      )}
      {commands.length > 0 && (
        <div className="flex justify-center relative overflow-x-auto shadow-md sm:rounded-lg w-full">
          <CommandsTable commands={commands} updateCommand={updateCommand} deleteCommand={deleteCommand}/>
        </div>
      )}
    </div>
  </>
}
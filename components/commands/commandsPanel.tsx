import { Command } from "@prisma/client";
import { RiAddLine } from "react-icons/ri";
import { useState } from "react";
import { NewCommandModal } from "./newCommandModal";
import { CommandsTable } from "./commandTable";
import { CommandStatus } from "../../types/db";

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
      <NewCommandModal isOpen={isNewCommandOpen} onClose={() => setIsNewCommandOpen(false)} onSubmit={createCommand} />
    </div>
    <div className="flex justify-center flex-col gap-4">
      {commands.length === 0 && (
        <p>
          Aucune commande trouvée.
        </p>
      )}
      {commands.length > 0 && (
        <>
          <h2 className="text-2xl font-semibold">Commandes</h2>
          <CommandsTable commands={commands.filter(e => e.status !== CommandStatus.DONE)} updateCommand={updateCommand} deleteCommand={deleteCommand} />
          {commands.filter(e => e.status === CommandStatus.DONE).length > 0 && (
            <>
              <h2 className="text-2xl font-semibold">Commandes terminées</h2>
              <CommandsTable commands={commands.filter(e => e.status === CommandStatus.DONE)} updateCommand={updateCommand} deleteCommand={deleteCommand} />
            </>
          )}
          {commands.filter(e => e.status === CommandStatus.DONE).length === 0 && (
            <>
              <h2 className="text-2xl font-semibold">Commandes terminées</h2>
              <p className="text-center opacity-50"> Aucune commande terminée.</p>
            </>
          )}
        </>
      )}
    </div>
  </>
}
import { Command } from "@prisma/client";
import { CommandStatus } from "../../../types/db";
import Image from 'next/image'
import { CommandColumn } from "./commandsColumn";

type CommandsList = {
  commands: Command[] | null;
}

export const CommandsDisplay = ({ commands }: CommandsList) => {
  if (!commands)
    return <p>Chargement...</p>
  return <div className="flex-1 w-full h-full grid grid-cols-2 grid-flow-row relative">
    <div className="border-r-4 border-black flex flex-col">
      <CommandColumn commandStatus={CommandStatus.IN_PROGRESS} commands={commands} />
    </div>
    <div>
      <CommandColumn commandStatus={CommandStatus.DONE} commands={commands} />
    </div>
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 bg-white rounded-full">
      <Image src="/kfet-king.svg" width={192} height={192} alt="" />
    </div>
  </div>
}

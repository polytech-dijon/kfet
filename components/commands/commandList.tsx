import { Command } from "@prisma/client";
import { RiTimeLine, RiCheckboxCircleLine } from "react-icons/ri";
import { CommandStatus } from "../../types/db";
import Image from 'next/image'

type CommandsList = {
  commands: Command[] | null;
}

export const CommandsList = ({ commands }: CommandsList) => {
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
  </div>
}
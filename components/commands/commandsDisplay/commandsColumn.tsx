import { Command } from "@prisma/client";
import { CommandStatus } from "../../../types/db";
import { CommandLine } from "./commandLine";

const mapByTitle = (commands: Command[]): Command[][] => {
  let titleList = new Set(commands?.map((command) => command.title));
  let sortedCommands: Command[][] = [];
  titleList.forEach((title) => {
    sortedCommands.push(commands.filter((command) => command.title === title))
  })
  return sortedCommands
}


export const CommandColumn = ({ commandStatus, commands }: { commandStatus: CommandStatus, commands: Command[] }) => {
  let [bgColor, title] = commandStatus === CommandStatus.IN_PROGRESS ? ["orange-400", "Commandes en préparation"] : ["green-700", "Commandes prêtes"];
  return (
    <>
      <div className={`bg-${bgColor} h-40 text-6xl text-white text-center flex justify-center items-center font-bold`}>
        <span>{title}</span>
      </div>
      <div className="flex-1 flex flex-col items-center">
        <div className="grid grid-rows-6 grid-flow-col gap-x-16">
          {mapByTitle(commands
            .filter((command) => command.status === commandStatus)
          ).map((commandList) => <CommandLine key={commandList[0].id} commands={commandList} />)}
        </div>
      </div>
    </>
  );
}

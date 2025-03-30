import { Command } from "@prisma/client";
import { CommandLineItem } from "./commandLineItem";

export const CommandLine = ({ commands }: { commands: Command[] }) => (
  <div className="flex flex-row gap-y-4 justify-between items-center border-gray-300 mt-5 pt-4">
    <div className="flex flex-col">
      <span className="text-5xl font-semibold">{commands[0].title}</span>
      <ul className="pt-3">
        {commands.map((command) => <CommandLineItem key={command.id} command={command} />)}
      </ul>
    </div>
  </div>
)

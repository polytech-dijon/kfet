import { Command } from "@prisma/client";
import { RiCheckboxCircleLine, RiTimeLine } from "react-icons/ri";
import { CommandStatus } from "../../../types/db";

export const CommandLineItem = ({ command }: { command: Command }) => (
  <li className="flex items-center text-4xl pl-6 pt-2">
    • {command.description}
    <span className="pl-3">
      {command.status === CommandStatus.IN_PROGRESS && <RiTimeLine className="text-4xl" />}
      {command.status === CommandStatus.DONE && <RiCheckboxCircleLine className="text-4xl" />}
    </span>
  </li>
)

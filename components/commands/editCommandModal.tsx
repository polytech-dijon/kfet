import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { Command, CommandStatus, IArticle } from "../../types/db";
import Modal from "../Modal";
import { ArticlesSelector } from "./articlesSelector";
import { IconButton } from "@mui/material";
import RemoveIcon from "@mui/icons-material/Remove";

type EditCommandModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (command: Partial<Command>) => Promise<void>;
  articles: IArticle[];
  command?: Partial<Command>;
};

export const EditCommandModal = ({
  isOpen,
  onClose,
  onSubmit,
  articles,
  command,
}: EditCommandModalProps) => {
  const [title, setTitle] = useState("");
  const [article, setArticle] = useState<IArticle | null>(null);
  const commandListState = useState<Map<string, number>>(new Map());
  const [commandList, setCommandList] = commandListState;

  const resetValues = () => {
    setTitle("");
    setArticle(null);
    setCommandList(new Map());
  };

  useEffect(() => {
    if (!command) return;
    setTitle(command.title || "");
    setArticle(articles.find((a) => a.name === command.description) || null);
    setCommandList(new Map().set(command.description, 1));
  }, [command]);

  return (
    <>
      <Modal
        isOpen={isOpen}
        onSubmit={async () => {
          if (!title) return toast.error("Nom de commande requis !");
          for (const [article, quantity] of commandList) {
            for (let i = 0; i < quantity; i++)
              await onSubmit({
                ...command,
                title,
                description: article,
                status: command?.status ?? CommandStatus.PENDING,
              });
          }
          if (!command) {
            setTitle("");
            setArticle(null);
          }
          resetValues();
          onClose();
        }}
        onCancel={() => {
          resetValues();
          onClose();
        }}
        title={!command ? "Nouvelle commande" : "Éditer la commande"}
        submitButtonText="Sauvegarder"
      >
        <div className="my-3">
          <label
            htmlFor="commandTitle"
            className="block mb-2 text-sm font-medium text-gray-900"
          >
            Nom de la commande :
          </label>
          <input
            type="text"
            id="commandTitle"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            required
          />
        </div>
        <div className="my-3">
          <label
            htmlFor="commandDescription"
            className="block mb-2 text-sm font-medium text-gray-900"
          >
            Description (optionnel) :
          </label>
          <ArticlesSelector
            articles={articles}
            commandListState={commandListState}
          />
          <>
            <h1 className="text-lg">Résumé</h1>
            <div className="grid grid-cols-2">
              {Array.from(commandListState[0].entries()).map(
                ([article, quantity]) => (
                  <p className="even:pl-4 odd:pr-4 border-r-2 even:border-r-0 border-[#00000022] flex justify-between">
                    <span>{article} :</span>
                    <span>{quantity}</span>
                  </p>
                )
              )}
            </div>
          </>
        </div>
      </Modal>
    </>
  );
};

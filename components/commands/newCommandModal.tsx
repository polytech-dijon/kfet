import { useState } from "react";
import toast from "react-hot-toast";
import { Command, CommandStatus, IArticle } from "../../types/db";
import Modal from "../Modal";
import { ArticlesSelector } from "./articlesSelector";
import RemoveIcon from '@mui/icons-material/Remove';
import AddIcon from '@mui/icons-material/Add';
import { IconButton } from "@mui/material";
import { GetArticlesResult } from "../../pages/api/articles";
import API from "../../services/api";

type NewCommandModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (command: Partial<Command>) => Promise<void>;
};

export const NewCommandModal = ({
  isOpen,
  onClose,
  onSubmit
}: NewCommandModalProps) => {
  const [articles, setArticles] = useState<IArticle[] | null>(null)
  const [title, setTitle] = useState("");
  const [commandList, setCommandList] = useState<Map<string, number>>(new Map());;
  const [submitLock, setSubmitLock] = useState(false);

  const resetValues = () => {
    setTitle("");
    setCommandList(new Map());
  };

  const filterThenSetCommandList = (newCommandList: Map<string, number>) => {
    setCommandList(new Map(
      [...newCommandList]
        .filter(([k, v]) => v > 0)
    ));
  }

  async function getArticles() {
    try {
      const { data } = await API.get<GetArticlesResult>('/api/articles')
      data.articles.sort((a, b) => a.favorite === b.favorite ? 0 : a.favorite ? -1 : 1)
      setArticles(data.articles)
    }
    catch {
      toast.error('Une erreur est survenue')
    }
  }

  async function onSubmitModal(){
    if (submitLock) return;
    setSubmitLock(true);
    try {
      if (!title) return toast.error("Nom de commande requis !");
      if (!commandList.values().some(e => e > 0))
        return toast.error("Aucun article sélectionné !");
      for (const [article, quantity] of commandList) {
        for (let i = 0; i < quantity; i++)
          await onSubmit({
            title,
            description: article,
            status:  CommandStatus.PENDING,
          });
      }
      resetValues();
      onClose();
    } finally {
      setSubmitLock(false);
    }
  }

  getArticles()

  return (
    <Modal
      isOpen={isOpen}
      onSubmit={onSubmitModal}
      onCancel={() => {
        resetValues();
        onClose();
      }}
      title={"Nouvelle commande"}
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
          Description :
        </label>
        <ArticlesSelector
          articles={articles}
          commandList={commandList}
          setCommandList={filterThenSetCommandList}
        />
        <h1 className="text-lg">Résumé</h1>
        {!commandList.values().some(e => e > 0) ? (
          <p className="text-center text-gray-500">
            Aucun article sélectionné
          </p>
        ) : (
          <div className="grid grid-cols-2">
            {Array.from(commandList.entries()).map(
              ([article, quantity], index) => (
                quantity > 0 && <p
                  className="even:pl-4 odd:pr-4 border-r-2 even:border-r-0 border-[#00000022] flex justify-between items-center"
                  key={index}
                >
                  <span style={{ display: "block", maxWidth: "150px", textOverflow: "ellipsis", whiteSpace: "nowrap", overflow: "hidden" }}>{article}</span>
                  <span>
                    :
                    <IconButton
                      onClick={() =>
                        filterThenSetCommandList(
                          new Map(commandList.set(article, quantity - 1))
                        )}
                    >
                      <RemoveIcon />
                    </IconButton>
                    {quantity}
                    <IconButton
                      onClick={() =>
                        filterThenSetCommandList(
                          new Map(commandList.set(article, quantity + 1))
                        )}
                    >
                      <AddIcon />
                    </IconButton>
                  </span>
                </p>
              )
            )}
          </div>
        )}
      </div>
    </Modal>
  );
};

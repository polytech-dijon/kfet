import { useState, useEffect } from "react";
import { Command, IArticle } from "../../types/db";
import Modal from "../Modal";
import { ArticlesSelector } from "./articlesSelector";
import toast from "react-hot-toast";
import { GetArticlesResult } from "../../pages/api/articles";
import API from "../../services/api";

type EditCommandArticleModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (command: Command) => Promise<void>;
  command: Command;
};

export const EditCommandArticleModal = ({
  isOpen,
  onClose,
  onSubmit,
  command,
}: EditCommandArticleModalProps) => {
  const [articles, setArticles] = useState<IArticle[] | null>(null)
  const [selectedArticle, setSelectedArticle] = useState<string>(command?.description ?? "");
  useEffect(() => {
    setSelectedArticle(command?.description ?? "");
  }
    , [command]);

  const currentSelected = new Map<string, number>(selectedArticle ? [[selectedArticle, 1]] : []);

  const setCommandList = (commandList: Map<string, number>) => {
    if (commandList.size > 1) {
      commandList.delete([...commandList.keys().filter(k => k === selectedArticle)][0]);
    }
    setSelectedArticle([...commandList.keys()][0]);
  }

  const resetValues = () => {
    setSelectedArticle("");
  };


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

  getArticles()

  return (
    <Modal
      isOpen={isOpen}
      onSubmit={async () => {
        await onSubmit({
          ...command,
          description: selectedArticle,
        });
        resetValues();
        onClose();
      }}
      onCancel={() => {
        resetValues();
        onClose();
      }}
      title={"Éditer l'article de la commande"}
      submitButtonText="Sauvegarder"
    >
      <div className="my-3">
        <label
          htmlFor="commandDescription"
          className="block mb-2 text-sm font-medium text-gray-900"
        >
          Description :
        </label>
        <ArticlesSelector
          articles={articles}
          commandList={currentSelected}
          setCommandList={setCommandList}
        />
        <label
          htmlFor="commandStatus"
          className="block mt-3 mb-2 text-sm font-medium text-gray-900"
        >
          Article sélectionné :
        </label>
        <p>{selectedArticle}</p>
      </div>
    </Modal>
  );
};

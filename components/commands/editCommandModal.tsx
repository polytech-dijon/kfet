import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { Command, CommandStatus, IArticle } from "../../types/db";
import Modal from '../Modal'
import {ArticlesSelector} from "./articlesSelector";



type EditCommandModalProps = {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (command: Partial<Command>) => Promise<void>;
    articles: IArticle[];
    command?: Partial<Command>;
}


export const EditCommandModal = ({ isOpen, onClose, onSubmit, articles, command }: EditCommandModalProps) => {
    const [title, setTitle] = useState('')
    const [article, setArticle] = useState<IArticle | null>(null)
    const [status, setStatus] = useState<CommandStatus>(CommandStatus.PENDING)

    useEffect(() => {
        if (!command)
            return
        setTitle(command.title || '')
        setArticle(articles.find((a) => a.name === command.description) || null)
        setStatus(command.status as CommandStatus || CommandStatus.PENDING)
    }, [command])

    return (
        <>
            <Modal
                isOpen={isOpen}
                onSubmit={async () => {
                    if (!title)
                        return toast.error('Nom de commande requis !')
                    await onSubmit({ ...command, title, description: article ? article.name : '', status })
                    if (!command) {
                        setTitle('')
                        setArticle(null)
                        // setDescription('')
                        setStatus(CommandStatus.PENDING)
                    }
                    onClose()
                }}
                onCancel={() => onClose()}
                title={!command?"Nouvelle commande":"Éditer la commande"}
                submitButtonText="Sauvegarder"
            >
                <div className="my-3">
                    <label htmlFor="commandTitle" className="block mb-2 text-sm font-medium text-gray-900">Nom de la commande :</label>
                    <input type="text" id="commandTitle" value={title} onChange={(e) => setTitle(e.target.value)} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" required />
                </div>
                <div className="my-3">
                    <label htmlFor="commandDescription" className="block mb-2 text-sm font-medium text-gray-900">Description (optionnel) :</label>
                    <ArticlesSelector articles={articles} />
                    {/* <Select
                        value={article}
                        setValue={setArticle}
                        values={articles}
                        accessor={(a) => !!a ? a.name + (a.favorite ? "⭐" : "") : "Nom de l'article..."}
                        className="w-72"
                    /> */}
                </div>
            </Modal>
        </>
    )
}
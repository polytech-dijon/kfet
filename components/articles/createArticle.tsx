import { useState } from "react";
import { Category, IArticle } from "../../types/db";
import { categories, categoryNames } from "../../utils/db-enum";
import Modal from "../Modal";
import Select from "../Select";
import toast from 'react-hot-toast';

type CreateArticleModalProps = {
    createArticleOpen: boolean;
    setCreateModalOpen: (open: boolean) => void;
    createArticle: (article: Partial<IArticle>) => Promise<void>;
    articles: IArticle[];
}

export function CreateArticleModal({ createArticleOpen, setCreateModalOpen, createArticle, articles }: CreateArticleModalProps) {
    const [name, setName] = useState('');
    const [category, setCategory] = useState(Category.COLD_DRINKS);
    const [sellPrice, setSellPrice] = useState(0);
    const [articleProducts, setArticleProducts] = useState<number[]>([]);
    const articleExists = articles.some((article) => article.name.toLowerCase() === name.toLowerCase());

    return <Modal
        isOpen={createArticleOpen}
        onSubmit={async () => {
            if (articleExists) {
                toast.error('Cet article existe déjà.');
                return; 
            }

            await createArticle({
                name,
                category,
                sell_price: sellPrice
            })
            setCreateModalOpen(false);
            setName('');
            setCategory(Category.COLD_DRINKS);
            setSellPrice(0);
            setArticleProducts([]);
        }}
        onCancel={() => {setCreateModalOpen(false), setSellPrice(0), setName('')}}
        title="Créer un article"
        submitButtonText="Créer"
    >
        <div className="my-3">
            <label htmlFor="articleName" className="block mb-2 text-sm font-medium text-gray-900">Nom de l&apos;article :</label>
            <input type="text" id="articleName" value={name} onChange={(e) => setName(e.target.value)} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" required />
        </div>
        <div className="my-3">
            <label className="block mb-2 text-sm font-medium text-gray-900">Catégorie :</label>
            <Select
                value={category}
                setValue={setCategory}
                values={categories}
                accessor={(cat) => categoryNames[cat]}
                className="w-full"
            />
        </div>
        <div className="my-3">
            <label htmlFor="articleSellPrice" className="block mb-2 text-sm font-medium text-gray-900">Prix de vente :</label>
            <input type="number" id="articleSellPrice" value={sellPrice} onChange={(e) => setSellPrice(parseFloat(e.target.value))} step={0.05} min={0} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" required />
        </div>
    </Modal>
}

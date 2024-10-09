import { useState, useEffect } from "react";
import { IArticle, Category } from "../../types/db";
import { categories, categoryNames } from "../../utils/db-enum";
import Modal from "../Modal";
import Select from "../Select";

type EditArticleModalProps = {
    editingArticle: IArticle | null;
    setEditingArticle: (article: IArticle | null) => void;
    updateArticle: (article: IArticle) => Promise<void>;
}

export function EditArticleModal({ editingArticle, setEditingArticle, updateArticle }: EditArticleModalProps) {
    const [name, setName] = useState('')
    const [category, setCategory] = useState<Category>(Category.COLD_DRINKS)
    const [sellPrice, setSellPrice] = useState(0)
    const [articleProducts, setArticleProducts] = useState<number[]>([])

    useEffect(() => {
        if (editingArticle) {
            setName(editingArticle.name)
            setCategory(editingArticle.category as Category)
            setSellPrice(editingArticle.sell_price)
        }
    }, [editingArticle]);


    return <Modal
        isOpen={editingArticle !== null}
        onSubmit={async () => {
            if (!editingArticle) return
            await updateArticle({
                id: editingArticle.id,
                name,
                description: editingArticle.description,
                sell_price: sellPrice,
                category,
                image: editingArticle.image,
                deleted: editingArticle.deleted,
                favorite: editingArticle.favorite,
            })
            setEditingArticle(null)
        }}
        onCancel={() => setEditingArticle(null)}
        title="Modifier le stock"
        submitButtonText="Sauvegarder"
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
import { IArticle } from "../../types/db";
import Modal from "../Modal";

type DeleteArticleModalProps = {
    deletingArticle: IArticle | null;
    setDeletingArticle: (article: IArticle | null) => void;
    deleteArticle: (article: IArticle) => Promise<void>;
}

export function DeleteArticleModal({ deletingArticle, setDeletingArticle, deleteArticle }: DeleteArticleModalProps) {
    return <Modal
        isOpen={deletingArticle !== null}
        onSubmit={async () => {
            if (!deletingArticle) return
            await deleteArticle({ ...deletingArticle })
            setDeletingArticle(null)
        }}
        onCancel={() => setDeletingArticle(null)}
        title="Supprimer l'article"
        submitButtonText="Supprimer"
        submitButtonColor="error"
    >
        <div className="my-3">
            <p>Êtes-vous sûr de vouloir supprimer cet article ?</p>
        </div>
    </Modal>
}
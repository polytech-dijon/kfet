import { RiDeleteBinFill } from "react-icons/ri";
import {} from "../types/db";
import Modal from "./Modal";
import { useState } from "react";

type DeleteModalProps<T> = {
    deletingItem: T | null;
    deleteItem: (item: T) => Promise<void>;
  };

export function DeleteModal<T>({
  deletingItem,
  deleteItem,
}: DeleteModalProps<T>) {
    const [isOpen, setIsOpen] = useState<boolean>(false)
  return (
    <>
      <button className="button red inline-flex" onClick={()=>setIsOpen(true)}>
        <RiDeleteBinFill size={20} />
      </button>
      <Modal
        isOpen={isOpen}
        onSubmit={async () => {
          if (!deletingItem) return;
          await deleteItem({ ...deletingItem })
          setIsOpen(false);
        }}
        onCancel={() => setIsOpen(false)}
        title="Supprimer"
        submitButtonText="Supprimer"
        submitButtonColor="error"
      >
        <div className="my-3">
          <p>Êtes-vous sûr de vouloir supprimer ?</p>
        </div>
      </Modal>
    </>
  );
}

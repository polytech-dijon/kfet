import { Fragment } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { HiX } from 'react-icons/hi';

export type ModalProps = {
  isOpen: boolean;
  title?: string;
  children: React.ReactNode;
  onSubmit?: () => void;
  onCancel?: () => void;
  cancelButton?: boolean;
  submitButton?: boolean;
  submitButtonText?: string;
  cancelButtonText?: string;
  submitButtonColor?: "primary" | "success" | "error";
}

const Modal = ({ isOpen, title, children, onSubmit, onCancel, cancelButton = true, submitButton = true, submitButtonText, cancelButtonText, submitButtonColor }: ModalProps) => {

  function submitModal() {
    if (onSubmit)
      onSubmit()
  }
  function cancelModal() {
    if (onCancel)
      onCancel()
  }

  return <Transition appear show={isOpen} as={Fragment}>
    <Dialog
      as="div"
      className="fixed inset-0 z-10 overflow-y-auto"
      onClose={cancelModal}
    >
      <div className="min-h-screen px-4 text-center">
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <Dialog.Overlay className="fixed inset-0 bg-black/50" />
        </Transition.Child>

        {/* This element is to trick the browser into centering the modal contents. */}
        <span
          className="inline-block h-screen align-middle"
          aria-hidden="true"
        >
          &#8203;
        </span>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0 scale-95"
          enterTo="opacity-100 scale-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100 scale-100"
          leaveTo="opacity-0 scale-95"
        >
          <div className="inline-block w-full max-w-xl p-6 my-8 text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
            {onCancel && (
              <div className="absolute cursor-pointer top-3 right-3 sm:top-5 sm:right-5 sm:pt-0.5">
                <HiX className="text-xl text-gray-500 transition-colors hover:text-red-500" onClick={onCancel} />
              </div>
            )}
            {/* To avoid scroll on the bottom button */}
            <div style={{ maxWidth: 0, maxHeight: 0, overflow: "hidden" }}>
              <input autoFocus />
            </div>
            <Dialog.Title
              as="h3"
              className="text-lg font-medium leading-6 text-gray-900"
            >
              {title || ""}
            </Dialog.Title>
            <div className="mt-2">
              {children}
            </div>

            <div className="mt-4 flex justify-end gap-3">
              {cancelButton && (
                <button
                  type="button"
                  className="button-outline"
                  onClick={cancelModal}
                >
                  {cancelButtonText || 'Annuler'}
                </button>
              )}
              {submitButton && (
                <button
                  type="button"
                  className={getButtonClass(submitButtonColor)}
                  onClick={submitModal}
                >
                  {submitButtonText || 'Valider'}
                </button>
              )}
            </div>
          </div>
        </Transition.Child>
      </div>
    </Dialog>
  </Transition>
}

function getButtonClass(color?: "primary" | "success" | "error") {
    if (color === "success")
      return "button green"
    else if (color === "error")
      return "button red"
    else
      return "button"
}

export default Modal
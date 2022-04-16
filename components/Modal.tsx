import { Fragment } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { RiCheckLine } from 'react-icons/ri'
import { HiSelector } from 'react-icons/hi'

export type ModalProps = {
  isOpen: boolean;
  title?: string;
  children: React.ReactNode;
  onSubmit?: () => void;
  onCancel?: () => void;
  cancelButton?: boolean;
  submitButtonText?: string;
  cancelButtonText?: string;
}

const Modal = ({ isOpen, title, children, onSubmit, onCancel, cancelButton = true, submitButtonText, cancelButtonText }: ModalProps) => {

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
          <div className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
            <Dialog.Title
              as="h3"
              className="text-lg font-medium leading-6 text-gray-900"
            >
              {title || ""}
            </Dialog.Title>
            <div className="mt-2">
              {/* <p className="text-sm text-gray-500">
                Your payment has been successfully submitted. We’ve sent you
                an email with all of the details of your order.
              </p> */}
              {children}
            </div>

            <div className="mt-4 flex justify-end">
              {cancelButton && (
                <button
                  type="button"
                  className="button-outline mr-3"
                  onClick={cancelModal}
                >
                  {cancelButtonText || 'Annuler'}
                </button>
              )}
              <button
                type="button"
                className="button"
                onClick={submitModal}
              >
                {submitButtonText || 'Valider'}
              </button>
            </div>
          </div>
        </Transition.Child>
      </div>
    </Dialog>
  </Transition>
}

export default Modal
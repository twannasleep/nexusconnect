import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { X } from "lucide-react";

interface ConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  const buttonClassName =
    "px-4 py-2 rounded-lg text-white font-semibold transition-all hover:-translate-y-0.5 active:translate-y-0";

  return (
    <Transition appear show={open} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onOpenChange}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="relative w-full max-w-md transform overflow-hidden rounded-lg bg-gray-800 p-6 shadow-xl transition-all">
                <Dialog.Title className="text-lg font-semibold mb-2 text-white">
                  {title}
                </Dialog.Title>
                <Dialog.Description className="text-gray-300 mb-6">
                  {description}
                </Dialog.Description>

                <div className="flex justify-end gap-3">
                  <button
                    onClick={() => {
                      onCancel();
                      onOpenChange(false);
                    }}
                    className={`${buttonClassName} bg-gray-600 hover:bg-gray-700`}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      onConfirm();
                      onOpenChange(false);
                    }}
                    className={`${buttonClassName} bg-indigo-500 hover:bg-indigo-600`}
                  >
                    Confirm
                  </button>
                </div>

                <button
                  onClick={() => onOpenChange(false)}
                  className="absolute right-4 top-4 text-gray-400 hover:text-gray-300"
                >
                  <X className="h-4 w-4" />
                </button>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}

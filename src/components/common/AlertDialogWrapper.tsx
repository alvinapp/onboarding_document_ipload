import * as AlertDialog from '@radix-ui/react-alert-dialog';
import React, { useState } from 'react';
import { Button } from './Button';
import { motion, AnimatePresence } from 'framer-motion';

interface AlertDialogWrapperProps {
  title: string;
  description: string;
  triggerButton?: React.ReactNode;
  triggerButtonText?: string;
  triggerButtonColor?: string;
  confirmButtonText: string;
  cancelButtonText?: string;
  confirmButtonColor?: string;
  cancelButtonColor?: string;
  onConfirm: () => void;
  onCancel?: () => void;
}

const AlertDialogWrapper: React.FC<AlertDialogWrapperProps> = ({
  title,
  description,
  triggerButton,
  triggerButtonText = 'Open',
  confirmButtonText,
  cancelButtonText = 'Cancel',
  triggerButtonColor = 'bg-gray-900 text-white',
  confirmButtonColor = 'bg-red-500 text-white',
  cancelButtonColor = 'bg-gray-600 text-white',
  onConfirm,
  onCancel,
}) => {
  const [open, setOpen] = useState(false);

  const handleConfirm = () => {
    onConfirm();
    setOpen(false);
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    }
    setOpen(false);
  };

  return (
    <AlertDialog.Root open={open} onOpenChange={setOpen}>
      <AlertDialog.Trigger asChild>
        {triggerButton ? (
          triggerButton
        ) : (
          <Button color={triggerButtonColor}>{triggerButtonText}</Button>
        )}
      </AlertDialog.Trigger>
      <AnimatePresence>
        {open && (
          <AlertDialog.Portal forceMount>
            <AlertDialog.Overlay asChild forceMount>
              <motion.div
                className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              />
            </AlertDialog.Overlay>
            <AlertDialog.Content asChild forceMount>
              <motion.div
                className="fixed z-50 w-full max-w-md p-6 top-[40%] left-[35%] transform -translate-x-1/2 -translate-y-1/2"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
              >
                <div className="relative bg-white/80 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-200 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-pink-50 opacity-30" />
                  <div className="relative z-10 p-6">
                    <AlertDialog.Title className="text-2xl font-bold text-gray-900">
                      {title}
                    </AlertDialog.Title>
                    <AlertDialog.Description className="text-sm text-gray-600 mt-2">
                      {description}
                    </AlertDialog.Description>
                    <div className="mt-6 flex justify-end space-x-3">
                      <AlertDialog.Cancel asChild>
                        <Button
                          onClick={handleCancel}
                          color={cancelButtonColor}
                          className="px-4 py-2 rounded-full transition-all duration-200 ease-in-out hover:shadow-md"
                        >
                          {cancelButtonText}
                        </Button>
                      </AlertDialog.Cancel>
                      <AlertDialog.Action asChild>
                        <Button
                          onClick={handleConfirm}
                          color={confirmButtonColor}
                          variant='destructive'
                          className="px-4 py-2 rounded-full transition-all duration-200 ease-in-out hover:shadow-md"
                        >
                          {confirmButtonText}
                        </Button>
                      </AlertDialog.Action>
                    </div>
                  </div>
                </div>
              </motion.div>
            </AlertDialog.Content>
          </AlertDialog.Portal>
        )}
      </AnimatePresence>
    </AlertDialog.Root>
  );
};

export default AlertDialogWrapper;
import * as AlertDialog from '@radix-ui/react-alert-dialog';
import React from 'react';
import { Button } from './Button';

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
  return (
    <AlertDialog.Root>
      <AlertDialog.Trigger asChild>
        {triggerButton ? (
          triggerButton
        ) : (
            <Button color={triggerButtonColor}>{triggerButtonText}</Button>
        )}
      </AlertDialog.Trigger>
      <AlertDialog.Portal>
        <AlertDialog.Overlay className="bg-black bg-opacity-50 fixed inset-0 z-50" />
        <AlertDialog.Content className="fixed z-50 bg-white p-6 rounded-lg shadow-lg max-w-md w-full top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <AlertDialog.Title className="text-lg font-bold">{title}</AlertDialog.Title>
          <AlertDialog.Description className="text-sm text-gray-600 mt-2">
            {description}
          </AlertDialog.Description>
          <div className="mt-4 flex justify-end space-x-3">
            <AlertDialog.Cancel asChild>
              <button
                onClick={onCancel}
                className={`px-4 py-2 rounded-md ${cancelButtonColor} hover:opacity-80`}
              >
                {cancelButtonText}
              </button>
            </AlertDialog.Cancel>
            <AlertDialog.Action asChild>
              <button
                onClick={onConfirm}
                className={`px-4 py-2 rounded-md ${confirmButtonColor} hover:opacity-80`}
              >
                {confirmButtonText}
              </button>
            </AlertDialog.Action>
          </div>
        </AlertDialog.Content>
      </AlertDialog.Portal>
    </AlertDialog.Root>
  );
};

export default AlertDialogWrapper;
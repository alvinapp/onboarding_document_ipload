import * as Dialog from '@radix-ui/react-dialog';
import { Cross2Icon } from '@radix-ui/react-icons';
import { Button } from './Button';
import React, { useState } from 'react';

interface DialogWrapperProps {
    triggerButton: React.ReactNode;
    title: string;
    description?: string;
    children: (onClose: () => void) => React.ReactNode;
}

const DialogWrapper: React.FC<DialogWrapperProps> = ({ triggerButton, title, description, children }) => {
    const [open, setOpen] = useState(false);

    const handleClose = () => setOpen(false);

    return (
        <Dialog.Root open={open} onOpenChange={setOpen}>
            <Dialog.Trigger asChild>{triggerButton}</Dialog.Trigger>
            <Dialog.Portal>
                <Dialog.Overlay className="bg-black opacity-30 fixed inset-0" />
                <Dialog.Content className="bg-white p-6 rounded-md shadow-lg fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-md focus:outline-none">
                    <Dialog.Title className="text-xl font-bold mb-4">{title}</Dialog.Title>
                    {description && <Dialog.Description className="text-sm text-gray-500 mb-6">{description}</Dialog.Description>}

                    {/* Pass the close function to the children */}
                    {children(handleClose)}

                    {/* Close Button */}
                    <Dialog.Close asChild>
                        <Button className="absolute top-3 right-3 text-gray-500 hover:text-gray-800" aria-label="Close" variant="ghost">
                            <Cross2Icon />
                        </Button>
                    </Dialog.Close>
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    );
};

export default DialogWrapper;
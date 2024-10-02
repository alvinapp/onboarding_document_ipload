import React from 'react';
import DialogWrapper from '../common/DialogWrapper';
import { Pencil } from "lucide-react";
import { Button } from '../common/Button';
import UserForm from './UserForm';

interface EditUserDialogProps {
    user?: {
        firstName: string;
        lastName: string;
        email: string;
        role: 'admin' | 'standard';
        title: string;
        department: string;
        linkedInUrl: string;
        designatedApprover: string;
    };
    triggerButton?: React.ReactNode;
    dialogTitle?: string;
    dialogDescription?: string;
}

const EditUserDialog: React.FC<EditUserDialogProps> = ({ user, triggerButton, dialogTitle, dialogDescription }) => {

    const handleUpdate = (userData: any) => {
        console.log("Updated user data:", userData);
        // Logic to handle user creation/update can go here
    };

    return (
        <DialogWrapper
            triggerButton={
                triggerButton
            }
            title={dialogTitle || 'Edit User'}
            description={dialogDescription || 'Update user details below.'}
        >
            {(onClose) => (
                <UserForm
                    user={user || undefined}
                    onUpdate={handleUpdate}
                    onClose={onClose}
                />
            )}
        </DialogWrapper>
    );
};

export default EditUserDialog;
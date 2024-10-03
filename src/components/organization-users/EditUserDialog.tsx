import React from 'react';
import DialogWrapper from '../common/DialogWrapper';
import UserForm from './UserForm';
import { useMutation } from 'react-query';
import { useToast } from '../common/ToastProvider';
import { useUserStore } from '../../store/useUserStore';

interface EditUserDialogProps {
    user?: {
        user_id: number;
        first_name: string;
        last_name: string;
        email: string;
        role: 'admin' | 'standard';
        title: string;
        department: string;
        linkedin_url: string;
        designatedApprover: string;
    };
    triggerButton?: React.ReactNode;
    dialogTitle?: string;
    dialogDescription?: string;
}

const EditUserDialog: React.FC<EditUserDialogProps> = ({ user, triggerButton, dialogTitle, dialogDescription }) => {
    const baseUrl = process.env.REACT_APP_BASE_URL;
    const editUserUrl = `${baseUrl}/users/edit/${user?.email}`;
    const { showToast } = useToast();
    const { updateUser } = useUserStore();

    // Use useMutation for handling the user edit request
    const { mutate: editUser, isLoading, isError } = useMutation(
        async (userData: any) => {
            const response = await fetch(editUserUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userData),
            });
            if (!response.ok) {
                const { message } = await response.json();
                showToast({
                    title: 'Error',
                    description: message || 'Failed to update user. Please try again.',
                    type: 'error',
                });
                throw new Error('Failed to update user');
            }
            return response.json();
        },
        {
            onSuccess: (updatedUser) => {
                // Update the store with the updated user data from the server
                updateUser(updatedUser.user);
                showToast({
                    title: 'User updated',
                    description: 'User details have been updated successfully.',
                    type: 'success',
                });
            },
        }
    );

    const handleUpdate = (userData: any, onClose: () => void) => {
        // Trigger the mutation and only close the modal on success
        editUser(userData, {
            onSuccess: () => {
                onClose();  // Close the modal on success
            },
        });
    };

    return (
        <DialogWrapper
            triggerButton={triggerButton}
            title={dialogTitle || 'Edit User'}
            description={dialogDescription || 'Update user details below.'}
        >
            {(onClose) => (
                <UserForm
                    user={user || undefined}
                    onUpdate={(userData) => handleUpdate(userData, onClose)}
                    onClose={onClose}
                    isLoading={isLoading}  // Pass the loading state to the form
                />
            )}
        </DialogWrapper>
    );
};

export default EditUserDialog;
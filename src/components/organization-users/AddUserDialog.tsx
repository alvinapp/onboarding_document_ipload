import React from 'react';
import DialogWrapper from '../common/DialogWrapper';
import UserForm from './UserForm';
import { useMutation } from 'react-query';
import { useToast } from '../common/ToastProvider';
import { useUserStore } from '../../store/useUserStore';
import { useOrganizationStore } from '../../store/useOrganizationStore';

interface AddUserDialogProps {
    user?: {
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

const AddUserDialog: React.FC<AddUserDialogProps> = ({ user, triggerButton, dialogTitle, dialogDescription }) => {
    const { selectedOrganization } = useOrganizationStore();
    const { showToast } = useToast();
    const { addUser } = useUserStore();

    const baseUrl = process.env.REACT_APP_BASE_URL;
    const addUserUrl = `${baseUrl}/users/admin/add_user/${selectedOrganization?.organizationId}`;

    // Use useMutation for handling the user addition request
    const { mutate: addNewUser, isLoading, isError } = useMutation(
        async (userData: any) => {
            const response = await fetch(addUserUrl, {
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
                    description: message,
                    type: 'error',
                });
                throw new Error('Failed to add user');
            }
            return response.json();
        },
        {
            onSuccess: (updatedUser) => {
                showToast({
                    title: 'User added',
                    description: 'User has been added successfully.',
                    type: 'success',
                });
                addUser(updatedUser.user);
            },
        }
    );

    const handleUpdate = (userData: any, onClose: () => void) => {
        // Trigger the mutation and only close the modal on success
        addNewUser(userData, {
            onSuccess: () => {
                onClose();  // Close the modal on success
            },
        });
    };

    return (
        <DialogWrapper
            triggerButton={triggerButton}
            title={dialogTitle || 'Add User'}
            description={dialogDescription || 'Fill in the details below to add a new user.'}
        >
            {(onClose) => (
                <UserForm
                    user={user || undefined}
                    onUpdate={(userData: any) => handleUpdate(userData, onClose)}
                    onClose={onClose}
                    isLoading={isLoading}
                />
            )}
        </DialogWrapper>
    );
};

export default AddUserDialog;
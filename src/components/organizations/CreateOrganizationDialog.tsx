import DialogWrapper from '../DialogWrapper';
import CreateOrganizationForm from './CreateOrganizationForm';
import { UsersIcon } from "lucide-react";
import { Button } from '../Button';

const CreateOrganizationDialog: React.FC = () => {
    return (
        <DialogWrapper
            triggerButton={
                <Button variant="default" className="bg-gray-900 text-white">
                    <UsersIcon className="w-4 h-4 mr-1" />
                    Create Organization
                </Button>
            }
            title="Create New Organization"
            description="Please fill in the details below to create a new organization."
        >
            {(onClose) => <CreateOrganizationForm onClose={onClose} />}
        </DialogWrapper>
    );
};

export default CreateOrganizationDialog;
import DialogWrapper from '../common/DialogWrapper';
import { Pencil, UsersIcon } from "lucide-react";
import { Button } from '../common/Button';
import EditOrganizationForm from './EditOrganizationForm';

interface EditOrganizationDialogProps {
    organization: any;
}

const EditOrganizationDialog: React.FC<EditOrganizationDialogProps> = ({organization}) => {
    console.log(organization);
    return (
        <DialogWrapper
            triggerButton={
                <Button variant="ghost" size="icon" className='hover:bg-green-100'>
                    <Pencil className="h-4 w-4" />
                  </Button>
            }
            title="Edit organization"
            description="Please fill in the details below to update the organization."
        >
            {(onClose) => <EditOrganizationForm organization={organization} onClose={onClose} />}
        </DialogWrapper>
    );
};

export default EditOrganizationDialog;
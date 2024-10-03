import React from 'react';
import DialogWrapper from '../common/DialogWrapper';
import EditDocumentForm from './EditDocumentForm';
import { Button } from "../common/Button";
import { Edit } from "lucide-react";

interface EditDocumentDialogProps {
    organizationId: string;
    documentId: string;
    documentName: string;
    documentType: string;
    triggerButton: React.ReactNode;
}

const EditDocumentDialog: React.FC<EditDocumentDialogProps> = ({ organizationId, documentId, documentName, documentType, triggerButton }) => {
    return (
        <DialogWrapper
            triggerButton={triggerButton}
            title="Edit New Document"
            description="Please fill out the details below to upload a new document."
        >
            {(onClose) => (
                <EditDocumentForm
                    organizationId={organizationId}
                    documentId={documentId}
                    documentName={documentName}
                    documentType={documentType}
                    onClose={onClose}
                />
            )}
        </DialogWrapper>
    );
};

export default EditDocumentDialog;
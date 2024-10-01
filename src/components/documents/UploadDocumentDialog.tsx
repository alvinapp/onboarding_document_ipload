import React from 'react';
import DialogWrapper from '../DialogWrapper';
import UploadDocumentsForm from './UploadDocumentsForm';
import { Button } from "../../components/Button";
import { Upload } from "lucide-react";

interface UploadDocumentDialogProps {
  organizationId: string; // The organization ID to be passed to the form
}

const UploadDocumentDialog: React.FC<UploadDocumentDialogProps> = ({ organizationId }) => {
  return (
    <DialogWrapper
      triggerButton={
        <Button variant="default" className="bg-gray-900 text-white">
          <Upload className="w-4 h-4 mr-1" />
          Upload Document
        </Button>
      }
      title="Upload New Document"
      description="Please fill out the details below to upload a new document."
    >
      {(onClose) => (
        <UploadDocumentsForm
          organizationId={organizationId}
          onClose={onClose}
        />
      )}
    </DialogWrapper>
  );
};

export default UploadDocumentDialog;
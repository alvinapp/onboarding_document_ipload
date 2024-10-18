import React from 'react';
import { useQueryClient } from 'react-query';
import DialogWrapper from '../common/DialogWrapper';
import UploadDocumentsForm from './UploadDocumentsForm';
import { Button } from "../common/Button";
import { Upload } from "lucide-react";

interface UploadDocumentDialogProps {
  organizationId: string; // The organization ID to be passed to the form
}

const UploadDocumentDialog: React.FC<UploadDocumentDialogProps> = ({ organizationId }) => {
  const queryClient = useQueryClient();
  const handleUpdate = () => {
    queryClient.invalidateQueries(['organizationData', organizationId]);
  };
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
          onUpload={handleUpdate}
        />
      )}
    </DialogWrapper>
  );
};

export default UploadDocumentDialog;
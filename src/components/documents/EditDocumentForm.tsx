import React, { useState } from 'react';
import axios from 'axios';
import { Button } from "../common/Button";
import { Input } from "../common/Input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../common/Select";
import { Loader2 } from "lucide-react";
import { useToast } from "../common/ToastProvider";
import { motion, AnimatePresence } from "framer-motion";
import { useOrganizationStore } from '../../store/useOrganizationStore'; // Import the zustand store

const baseUrl = process.env.REACT_APP_BASE_URL;

interface DocumentType {
    value: string;
    label: string;
}

const documentTypeOptions: DocumentType[] = [
    { value: 'Launchpad document', label: 'Launchpad document' },
    { value: 'Sales presentation', label: 'Sales presentation' },
    { value: 'Product briefing', label: 'Product briefing' },
    { value: 'Administrative', label: 'Administrative' },
    { value: 'Compliance', label: 'Compliance' },
    { value: 'Other', label: 'Other' },
];

interface EditDocumentsFormProps {
    organizationId: string;
    documentId: string;
    documentName: string;
    documentType: string;
    onClose: () => void;
}

const EditDocumentsForm: React.FC<EditDocumentsFormProps> = ({ organizationId, documentId, documentName, documentType, onClose }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [newDocumentName, setNewDocumentName] = useState(documentName); // Update the state variable name
    const [newDocumentType, setNewDocumentType] = useState(documentType); // Update the state variable name
    const { showToast } = useToast();
    const { editDocument } = useOrganizationStore();

    const handleSave = async () => {
        setIsLoading(true);

        if (!newDocumentType || !newDocumentName) {
            showToast({
                type: 'error',
                title: 'Error',
                description: 'Please fill all the required fields.',
                duration: 5000,
            });
            setIsLoading(false);
            return;
        }

        try {
            // Call the API to edit the document
            await axios.post(`${baseUrl}/onboarding_steps/document/${documentId}/edit_document`, {
                document_name: newDocumentName, // Use newDocumentName here
                document_type: newDocumentType, // Use newDocumentType here
            });

            // Update the document in the zustand store
            editDocument(organizationId, documentId, {
                documentName: newDocumentName, // Update to newDocumentName
                documentType: newDocumentType, // Update to newDocumentType
            });

            showToast({
                type: 'success',
                title: 'Success',
                description: 'Document updated successfully.',
                duration: 5000,
            });

            onClose(); // Close the modal or form after saving
        } catch (error) {
            showToast({
                type: 'error',
                title: 'Error',
                description: 'Failed to update document. Please try again.',
                duration: 5000,
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
            >
                <div className="mb-4">
                    <Input
                        type="text"
                        value={newDocumentName} // Use newDocumentName
                        onChange={(e) => setNewDocumentName(e.target.value)} // Update newDocumentName
                        placeholder="Enter document name"
                    />
                </div>

                <div className="mb-4">
                    <Select value={newDocumentType} onValueChange={setNewDocumentType}> {/* Update newDocumentType */}
                        <SelectTrigger>
                            <SelectValue placeholder="Select document type" />
                        </SelectTrigger>
                        <SelectContent>
                            {documentTypeOptions.map((type) => (
                                <SelectItem key={type.value} value={type.value}>
                                    {type.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div className="space-y-2">
                    <Button
                        onClick={handleSave}
                        disabled={!newDocumentType || !newDocumentName || isLoading}
                        className="w-full"
                    >
                        {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Save Changes'}
                    </Button>
                </div>
            </motion.div>
        </AnimatePresence>
    );
};

export default EditDocumentsForm;

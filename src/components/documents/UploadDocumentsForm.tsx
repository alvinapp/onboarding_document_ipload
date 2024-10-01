import React, { useState } from 'react';
import axios from 'axios';
import { useQuery } from 'react-query';
import { Button } from "../../components/Button";
import { Input } from "../../components/Input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/Select";
import { Loader2, Upload, ArrowLeft } from "lucide-react";
import { useToast } from "../../components/ToastProvider";
import { motion, AnimatePresence } from "framer-motion";

const baseUrl = 'http://localhost:5001';

interface OnboardingState {
    value: string;
    label: string;
    stepNumber: number;
}

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

const fetchOnboardingSteps = async (organizationId: string): Promise<OnboardingState[]> => {
    const response = await axios.get(`${baseUrl}/onboarding_steps/organization/${organizationId}/steps`);
    return response.data.map((state: any) => ({
        value: state.id,
        label: state.step_name,
        stepNumber: state.step_number,
    }));
};

interface UploadDocumentsFormProps {
    organizationId: string;
    onClose: () => void;
}

const UploadDocumentsForm: React.FC<UploadDocumentsFormProps> = ({ organizationId, onClose }) => {
    const [selectedOnboardingState, setSelectedOnboardingState] = useState<string>('');
    const [isLoading, setIsLoading] = useState(false);
    const [file, setFile] = useState<File | null>(null);
    const [documentType, setDocumentType] = useState<string>('');
    const [documentName, setDocumentName] = useState<string>('');
    const { showToast } = useToast();

    // Fetch onboarding states based on the provided organizationId
    const { data: onboardingStates = [], isError: stepsError } = useQuery(
        ['onboardingSteps', organizationId],
        () => fetchOnboardingSteps(organizationId),
        {
            onError: () => {
                showToast({
                    type: 'error',
                    title: 'Error',
                    description: 'Failed to fetch organization steps. Please try again.',
                    duration: 5000,
                });
            },
        }
    );

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const uploadedFile = event.target.files?.[0] || null;
        setFile(uploadedFile);
        if (uploadedFile) {
            setDocumentName(uploadedFile.name.replace(/\.[^/.]+$/, ''));
        }
    };

    const handleUpload = async () => {
        setIsLoading(true);
        if (!file || !selectedOnboardingState || !documentType || !documentName) {
            showToast({
                type: 'error',
                title: 'Error',
                description: 'Please fill all the required fields.',
                duration: 5000,
            });
            setIsLoading(false);
            return;
        }

        const formData = new FormData();
        formData.append('file', file);
        formData.append(
            'data',
            JSON.stringify({
                step_number: onboardingStates.find((state) => state.value === selectedOnboardingState)?.stepNumber,
                link_type: 'pdf',
                document_name: documentName,
                document_type: documentType,
            })
        );

        try {
            const response = await axios.post(`${baseUrl}/onboarding_steps/document/${organizationId}/upload_document`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            console.log('Upload successful:', response.data);
            showToast({
                type: 'success',
                title: 'Success',
                description: 'Document uploaded successfully.',
                duration: 5000,
            });
            onClose();
            resetForm();
        } catch (error) {
            console.error('Upload failed:', error);
            showToast({
                type: 'error',
                title: 'Error',
                description: 'Failed to upload document. Please try again.',
                duration: 5000,
            });
        } finally {
            setIsLoading(false);
        }
    };

    const resetForm = () => {
        setSelectedOnboardingState('');
        setFile(null);
        setDocumentType('');
        setDocumentName('');
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
                <Select value={selectedOnboardingState} onValueChange={setSelectedOnboardingState}>
                    <SelectTrigger>
                        <SelectValue placeholder="Select onboarding state" />
                    </SelectTrigger>
                    <SelectContent>
                        {onboardingStates.map((state) => (
                            <SelectItem key={state.value} value={state.value}>
                                {state.label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                </div>

                <div className="mb-4">
                <Select value={documentType} onValueChange={setDocumentType}>
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

                <div className="mb-4">
                <Input
                    type="text"
                    value={documentName}
                    onChange={(e) => setDocumentName(e.target.value)}
                    placeholder="Enter document name"
                />
                </div>

                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center cursor-pointer hover:border-primary mb-4"
                    onClick={() => document.getElementById('fileInput')?.click()}>
                    <p>Drag and drop or <span className="text-primary underline">browse</span> files</p>
                    <input
                        id="fileInput"
                        type="file"
                        onChange={handleFileChange}
                        className="hidden"
                    />
                </div>

                {file && (
                    <p className="text-sm text-gray-600 mb-4">
                        {file.name} - {(file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                )}

                <div className="space-y-2">
                    <Button
                        onClick={handleUpload}
                        disabled={!file || !selectedOnboardingState || !documentType || !documentName || isLoading}
                        className="w-full"
                    >
                        {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Upload className="mr-2 h-4 w-4" />}
                        Upload File
                    </Button>
                </div>
            </motion.div>
        </AnimatePresence>
    );
};

export default UploadDocumentsForm;
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from "../common/Button";
import { Input } from "../common/Input";
import { Check, User, UploadIcon, Loader2 } from 'lucide-react';
import { useToast } from '../common/ToastProvider';
import DialogWrapper from '../common/DialogWrapper';
import { useMutation } from 'react-query';
import { useOrganizationStore } from '../../store/useOrganizationStore';

interface User {
    name: string;
    email: string;
}

interface ChangeOrganizationStageFormProps {
    currentStage: string;
    users: User[];
}

const stages = [
    "Request a customer needs analysis call",
    "Scoping & Product Phasing Plan",
    "Pricing Model & Partnership Agreement",
    "SLA signing",
    "Integration and deployment",
    "UAT",
    "Deployed"
];

export default function ChangeOrganizationStageForm({
    currentStage,
    users,
}: ChangeOrganizationStageFormProps) {
    const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(false); // Loading state for the request
    const { selectedOrganization, updateOrganization } = useOrganizationStore();

    const baseurl = process.env.REACT_APP_BASE_URL;
    const changeStageUrl = `${baseurl}/onboarding_steps/organization/${selectedOrganization?.organizationId}/progress_step`;

    // Mutation logic to change the organization stage
    const changeStageMutation = useMutation(
        async (newStepNumber: number) => {
            setIsLoading(true);  // Set loading state to true when the mutation starts
            const response = await fetch(changeStageUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ "step_number": selectedOrganization ?selectedOrganization?.launchpadStepNumber + 1 : 1, "next_step": newStepNumber + 1 }),
            });

            if (!response.ok) {
                throw new Error('Failed to change organization stage.');
            }
            return response.json();
        },
        {
            onSuccess: (data) => {
                updateOrganization(data);
                setIsLoading(false);  // Set loading state to false on success
                showToast({
                    title: "Stage change published",
                    description: "The organization stage has been updated successfully.",
                    type: "success",
                });
            },
            onError: (error) => {
                setIsLoading(false);  // Set loading state to false on error
                showToast({
                    title: 'Error',
                    description: 'Failed to change organization stage. Please try again.',
                    type: 'error',
                });
            },
        }
    );

    const { showToast } = useToast();

    useEffect(() => {
        setSelectedUsers(users.map(user => user.email)); // Pre-select all users by default
    }, [users]);

    const toggleUser = (email: string) => {
        setSelectedUsers(prev =>
            prev.includes(email)
                ? prev.filter(e => e !== email)
                : [...prev, email]
        );
    };

    const handlePublish = (onClose: () => void) => {
        if (selectedOrganization) {
            changeStageMutation.mutate(selectedOrganization?.launchpadStepNumber + 1, {
                onSuccess: () => {
                    onClose();  // Only close the dialog on success
                }
            });
        }
    };

    return (
        <DialogWrapper
            triggerButton={
                <Button variant="outline">Change stage</Button>
            }
            title="Change organization stage"
            description="This action will update organization stage and send an email to the selected users to notify them of the stage change."
        >
            {(onClose) => (
                <div>
                    <div className="space-y-4">
                        <Input
                            value={stages[selectedOrganization?.launchpadStepNumber || 0]}
                            disabled
                            className="bg-gray-100"
                        />

                        <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-500">The email will be sent to the following users: </span>
                            <Button
                                variant="ghost"
                                onClick={() => setSelectedUsers(users.map(user => user.email))}
                                disabled={isLoading}  // Disable while loading
                            >
                                Select all
                            </Button>
                        </div>

                        <div className="flex flex-wrap gap-2">
                            <AnimatePresence>
                                {users.map((user) => (
                                    <motion.div
                                        key={user.email}
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.8 }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        <Button
                                            variant={selectedUsers.includes(user.email) ? "default" : "outline"}
                                            size="sm"
                                            onClick={() => toggleUser(user.email)}
                                            className="flex items-center space-x-1"
                                            disabled={isLoading}  // Disable buttons while loading
                                        >
                                            <User className="h-3 w-3" />
                                            <span>{user.name}</span>
                                            {selectedUsers.includes(user.email) && (
                                                <Check className="h-3 w-3 ml-1" />
                                            )}
                                        </Button>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>
                    </div>

                    {/* Publish Button */}
                    <Button
                        onClick={() => handlePublish(onClose)}
                        className="w-full mt-4"
                        disabled={selectedUsers.length === 0 || isLoading}  // Disable while loading or if no users are selected
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                Publishing...
                            </>
                        ) : (
                            <>
                                <UploadIcon className="h-4 w-4 mr-2" />
                                Publish
                            </>
                        )}
                    </Button>
                </div>
            )}
        </DialogWrapper>
    );
}
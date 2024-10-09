import { useState } from 'react';
import { Button } from '../common/Button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../common/Select';
import { Input } from '../common/Input';
import { useToast } from '../common/ToastProvider';
import { countries } from '../../data/countries';
import { useMutation } from 'react-query';
import { useOrganizationStore } from '../../store/useOrganizationStore';

interface Organization {
    name: string;
    type: 'fintech' | 'bank' | 'distribution channel partners' | '';
    country: string;
}

interface CreateOrganizationFormProps {
    onClose: () => void;  // Accept the close function via props
}

const CreateOrganizationForm: React.FC<CreateOrganizationFormProps> = ({ onClose }) => {
    const { addOrganization } = useOrganizationStore();
    const baseurl = process.env.REACT_APP_BASE_URL;
    const createOrganizationUrl = `${baseurl}/organizations/create`;

    const { showToast } = useToast();
    const [organization, setOrganization] = useState<Organization>({
        name: '',
        type: '',
        country: 'Nigeria', // Default country
    });
    const [isLoading, setIsLoading] = useState(false);

    // Use the useMutation hook to create a new organization
    const createOrganizationMutation = useMutation(
        async (organization: Organization) => {
            setIsLoading(true);
            const response = await fetch(createOrganizationUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(organization),
            });

            if (!response.ok) {
                throw new Error('Failed to create organization.');
            }
            return response.json();
        },
        {
            onSuccess: (data) => {
                showToast({
                    title: 'Organization Created',
                    description: `Organization ${organization.name} has been created successfully.`,
                    type: 'success',
                    duration: 5000,
                });
                addOrganization({
                    ...data, 
                    "launchpadStage": data.onboarding_steps[0].step_name,
                    "organizationCreatedOn": new Date(data.onboarding_steps[0].organization_created_on).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                    }),
                    "progress": data.onboarding_steps[0].progress,
                    "dueDate": data.onboarding_steps[0].due_date
                        ? new Date(data.onboarding_steps[0].due_date).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                        })
                        : 'N/A',
                    "organizationId": data.id,
                    "organization": data.name,
                }); 
                setIsLoading(false);
                onClose(); // Close the dialog only on success
            },
            onError: (error) => {
                showToast({
                    title: 'Error',
                    description: 'Failed to create organization. Please try again.',
                    type: 'error',
                });
                setIsLoading(false); // Stop the loading state
            },
        }
    );

    const handleCreateOrganization = () => {
        createOrganizationMutation.mutate(organization);
    };

    const organizationTypeOptions = [
        { value: 'fintech', label: 'Fintech' },
        { value: 'bank', label: 'Bank' },
        { value: 'distribution channel partners', label: 'Asset Managers' },
    ];

    return (
        <div>
            <Input
                type="text"
                value={organization.name}
                onChange={(e) => setOrganization({ ...organization, name: e.target.value })}
                placeholder="Enter organization name"
                className='mb-4'
                disabled={isLoading}  // Disable input during loading
            />

            <div className='mb-4'>
                <Select
                    value={organization.type}
                    onValueChange={(e) =>
                        setOrganization({
                            ...organization,
                            type: e as 'fintech' | 'bank' | 'distribution channel partners',
                        })
                    }
                    disabled={isLoading}  // Disable select during loading
                >
                    <SelectTrigger>
                        <SelectValue placeholder="Select organization type" />
                    </SelectTrigger>
                    <SelectContent>
                        {organizationTypeOptions.map((type) => (
                            <SelectItem key={type.value} value={type.value}>
                                {type.label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            <div className='mb-4'>
                <Select
                    value={organization.country}
                    onValueChange={(e) => setOrganization({ ...organization, country: e })}
                    disabled={isLoading}  // Disable select during loading
                >
                    <SelectTrigger>
                        <SelectValue placeholder="Select country" />
                    </SelectTrigger>
                    <SelectContent>
                        {countries.map((country) => (
                            <SelectItem key={country.code} value={country.name}>
                                {country.name}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            <div className="mt-6 flex justify-end">
                <Button
                    onClick={handleCreateOrganization}
                    className="w-full"
                    disabled={isLoading}  // Disable button during loading
                >
                    {isLoading ? 'Creating...' : 'Create Organization'}
                </Button>
            </div>
        </div>
    );
};

export default CreateOrganizationForm;
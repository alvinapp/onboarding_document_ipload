import { useState, useEffect } from 'react';
import { Button } from '../common/Button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../common/Select';
import { Input } from '../common/Input';
import { useToast } from '../common/ToastProvider';
import { countries } from '../../data/countries';
import { useMutation } from 'react-query';
import { useOrganizationStore } from '../../store/useOrganizationStore';

interface Organization {
    organizationId: string;
    organization: string;
    type: 'fintech' | 'bank' | 'distribution channel partners' | '';
    country: string;
}

interface EditOrganizationFormProps {
    organization: Organization;  // Accept the organization to edit as a prop
    onClose: () => void;         // Accept the close function via props
}

const EditOrganizationForm: React.FC<EditOrganizationFormProps> = ({ organization, onClose }) => {
    console.log("organization", organization);
    const { updateOrganization } = useOrganizationStore();
    const baseurl = process.env.REACT_APP_BASE_URL;
    const updateOrganizationUrl = `${baseurl}/organizations/${organization.organizationId}/update`;

    const { showToast } = useToast();
    const [updatedOrganization, setUpdatedOrganization] = useState<Organization>(organization);
    const [isLoading, setIsLoading] = useState(false);

    // Use the useMutation hook to update the organization
    const updateOrganizationMutation = useMutation(
        async (org: Organization) => {
            setIsLoading(true);
            const response = await fetch(updateOrganizationUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    "name": org.organization,
                    "type": org.type,
                    "country": org.country,
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to update organization.');
            }
            return response.json();
        },
        {
            onSuccess: (data) => {
                showToast({
                    title: 'Organization Updated',
                    description: `Organization ${updatedOrganization.organization} has been updated successfully.`,
                    type: 'success',
                    duration: 5000,
                });
                // updateOrganization({
                //     ...data,
                //     "organizationId": data.id,
                //     "organization": data.name,
                // });
                setIsLoading(false);
                onClose(); // Close the dialog only on success
            },
            onError: (error) => {
                showToast({
                    title: 'Error',
                    description: 'Failed to update organization. Please try again.',
                    type: 'error',
                });
                setIsLoading(false); // Stop the loading state
            },
        }
    );

    const handleUpdateOrganization = () => {
        updateOrganizationMutation.mutate(updatedOrganization);
    };

    const organizationTypeOptions = [
        { value: 'fintech', label: 'Fintech' },
        { value: 'bank', label: 'Bank' },
        { value: 'distribution channel partners', label: 'Distribution Channel Partners' },
    ];

    useEffect(() => {
        // Pre-fill form with existing organization data (if provided via props)
        setUpdatedOrganization(organization);
    }, [organization]);

    return (
        <div>
            <Input
                type="text"
                value={updatedOrganization.organization}
                onChange={(e) => setUpdatedOrganization({ ...updatedOrganization, organization: e.target.value })}
                placeholder="Enter organization name"
                className='mb-4'
                disabled={isLoading}  // Disable input during loading
            />

            <div className='mb-4'>
                <Select
                    value={updatedOrganization.type}
                    onValueChange={(e) =>
                        setUpdatedOrganization({
                            ...updatedOrganization,
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
                    value={updatedOrganization.country}
                    onValueChange={(e) => setUpdatedOrganization({ ...updatedOrganization, country: e })}
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
                    onClick={handleUpdateOrganization}
                    className="w-full"
                    disabled={isLoading}  // Disable button during loading
                >
                    {isLoading ? 'Updating...' : 'Update Organization'}
                </Button>
            </div>
        </div>
    );
};

export default EditOrganizationForm;

import { useState } from 'react';
import { Button } from '../common/Button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../common/Select';
import { Input } from '../common/Input';
import { useToast } from '../common/ToastProvider';
import { countries } from '../../data/countries';

interface Organization {
    organizationName: string;
    organizationType: 'fintech' | 'bank' | 'distribution channel partners' | '';
    country: string;
}

interface CreateOrganizationFormProps {
    onClose: () => void;  // Accept the close function via props
}

const CreateOrganizationForm: React.FC<CreateOrganizationFormProps> = ({ onClose }) => {
    const [organization, setOrganization] = useState<Organization>({
        organizationName: '',
        organizationType: '',
        country: 'Nigeria', // Default country
    });

    const { showToast } = useToast();

    const handleCreateOrganization = () => {
        console.log('Organization Created:', organization);
        showToast({
            title: 'Organization Created',
            description: `Organization ${organization.organizationName} has been created successfully.`,
            type: 'success',
            duration: 5000,
        });
        onClose();  // Trigger close after submission
    };

    const organizationTypeOptions = [
        { value: 'fintech', label: 'Fintech' },
        { value: 'bank', label: 'Bank' },
        { value: 'distribution channel partners', label: 'Distribution Channel Partners' },
    ];

    return (
        <div>
            <Input
                type="text"
                value={organization.organizationName}
                onChange={(e) => setOrganization({ ...organization, organizationName: e.target.value })}
                placeholder="Enter organization name"
                className='mb-4'
            />

            <div className='mb-4'>
                <Select
                    value={organization.organizationType}
                    onValueChange={(e) =>
                        setOrganization({
                            ...organization,
                            organizationType: e as 'fintech' | 'bank' | 'distribution channel partners',
                        })
                    }
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
                <Select value={organization.country} onValueChange={(e) => setOrganization({ ...organization, country: e })}>
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
                <Button onClick={handleCreateOrganization} className="w-full">
                    Create Organization
                </Button>
            </div>
        </div>
    );
};

export default CreateOrganizationForm;
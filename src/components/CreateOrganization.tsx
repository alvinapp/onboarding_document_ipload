import * as Dialog from '@radix-ui/react-dialog';
import { Cross2Icon } from '@radix-ui/react-icons';
import { UsersIcon } from "lucide-react"
import { countries } from '../data/countries';
import { useState } from 'react';
import { Button } from './Button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './Select';
import { Input } from './Input';
import { useToast } from '../components/ToastProvider';

// Define the Organization type
interface Organization {
    organizationName: string;
    organizationType: 'fintech' | 'bank' | 'distribution channel partners' | '';
    country: string;
}

// The main component
const CreateOrganizationDialog: React.FC = () => {
    // State for the form
    const [organization, setOrganization] = useState<Organization>({
        organizationName: '',
        organizationType: '',
        country: 'Nigeria', // Default country
    });

    const { showToast } = useToast();

    // Handle form submission
    const handleCreateOrganization = () => {
        //TODO: Handle organization creation logic here
        console.log('Organization Created:', organization);
        showToast({
            title: 'Organization Created',
            description: `Organization ${organization.organizationName} has been created successfully.`,
            type: 'success',
            duration: 5000,
        });
    };

    const organizationTypeOptions = [
        { value: 'fintech', label: 'Fintech' },
        { value: 'bank', label: 'Bank' },
        { value: 'distribution channel partners', label: 'Distribution Channel Partners' },
    ];

    return (
        <Dialog.Root>
            <Dialog.Trigger asChild>
                <Button variant="default" className="bg-gray-900 text-white">
                <UsersIcon className="w-4 h-4 mr-1" />
                    Create Organization
                </Button>
            </Dialog.Trigger>
            <Dialog.Portal>
                <Dialog.Overlay className="bg-black opacity-30 fixed inset-0" />
                <Dialog.Content className="bg-white p-6 rounded-md shadow-lg fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-md focus:outline-none">
                    <Dialog.Title className="text-xl font-bold mb-4">Create New Organization</Dialog.Title>
                    <Dialog.Description className="text-sm text-gray-500 mb-6">
                        Please fill in the details below to create a new organization.
                    </Dialog.Description>

                    {/* Organization Name Input */}
                    <Input
                        type="text"
                        value={organization.organizationName}
                        onChange={(e) => setOrganization({ ...organization, organizationName: e.target.value })}
                        placeholder="Enter organization name"
                        className='mb-4'
                    />

                    {/* Organization Type Select */}
                    <div className='mb-4'>
                        <Select value={organization.organizationType} onValueChange={(e) => setOrganization({
                            ...organization,
                            organizationType: e as 'fintech' | 'bank' | 'distribution channel partners'
                        })}>
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

                    {/* Country Select */}
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

                    {/* Submit Button */}
                    <div className="mt-6 flex justify-end">
                        <Dialog.Close asChild>
                            <Button
                                onClick={handleCreateOrganization}
                                className="w-full"
                            >
                                Create Organization
                            </Button>
                        </Dialog.Close>
                    </div>

                    {/* Close Button */}
                    <Dialog.Close asChild>
                        <Button
                            className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
                            aria-label="Close"
                            variant="ghost"
                        >
                            <Cross2Icon />
                        </Button>
                    </Dialog.Close>
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    );
};

export default CreateOrganizationDialog;
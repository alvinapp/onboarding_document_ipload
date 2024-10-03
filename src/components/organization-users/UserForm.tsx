import React from 'react'
import { Input } from "../common/Input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../common/Select"
import { Button } from "../common/Button"

const stages = [
    "Request a customer needs analysis call",
    "Scoping & Product Phasing Plan",
    "Pricing Model & Partnership Agreement",
    "SLA signing",
    "Integration and deployment",
    "UAT",
    "Deployed"
]

interface UserFormProps {
    user?: {
        first_name: string
        last_name: string
        email: string
        role: 'admin' | 'standard'
        title: string
        department: string
        linkedin_url: string
        designatedApprover: string
    }
    onUpdate: (userData: any) => void
    onClose: () => void
    isLoading: boolean
}

export default function UserForm({ user, onUpdate, onClose, isLoading }: UserFormProps) {
    const [userData, setUserData] = React.useState({
        first_name: user?.first_name || '',
        last_name: user?.last_name || '',
        email: user?.email || '',
        role: user?.role || 'standard',
        title: user?.title || '',
        department: user?.department || '',
        linkedin_url: user?.linkedin_url || '',
        designatedApprover: user?.designatedApprover || ''
    })

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setUserData(prev => ({ ...prev, [name]: value }))
    }

    const handleSelectChange = (name: string) => (value: string) => {
        setUserData(prev => ({ ...prev, [name]: value }))
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        onUpdate(userData)
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Input
                        id="first_name"
                        name="first_name"
                        value={userData.first_name}
                        onChange={handleInputChange}
                        placeholder='Enter first name'
                        required
                        disabled={isLoading}  // Disable input during loading
                    />
                </div>
                <div className="space-y-2">
                    <Input
                        id="last_name"
                        name="last_name"
                        value={userData.last_name}
                        onChange={handleInputChange}
                        placeholder='Enter last name'
                        required
                        disabled={isLoading}  // Disable input during loading
                    />
                </div>
            </div>

            <div className="space-y-2">
                <Input
                    id="email"
                    name="email"
                    type="email"
                    value={userData.email}
                    onChange={handleInputChange}
                    placeholder='Enter email'
                    required
                    disabled={isLoading}  // Disable input during loading
                />
            </div>

            <div className="space-y-2">
                <Select
                    value={userData.role}
                    onValueChange={handleSelectChange('role')}
                    disabled={isLoading}  // Disable select during loading
                >
                    <SelectTrigger id="role">
                        <SelectValue placeholder="Select a role" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="admin">Admin</SelectItem>
                        <SelectItem value="standard">Standard</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <div className="space-y-2">
                <Input
                    id="title"
                    name="title"
                    value={userData.title}
                    onChange={handleInputChange}
                    placeholder='Enter title'
                    disabled={isLoading}  // Disable input during loading
                />
            </div>

            <div className="space-y-2">
                <Input
                    id="department"
                    name="department"
                    value={userData.department}
                    onChange={handleInputChange}
                    placeholder='Enter department'
                    disabled={isLoading}  // Disable input during loading
                />
            </div>

            <div className="space-y-2">
                <Input
                    id="linkedin_url"
                    name="linkedin_url"
                    type="url"
                    value={userData.linkedin_url}
                    onChange={handleInputChange}
                    placeholder='Enter LinkedIn URL'
                    disabled={isLoading}  // Disable input during loading
                />
            </div>

            <div className="space-y-2">
                <Select
                    value={userData.designatedApprover}
                    onValueChange={handleSelectChange('designatedApprover')}
                    disabled={isLoading}  // Disable select during loading
                >
                    <SelectTrigger id="designatedApprover">
                        <SelectValue placeholder="Select a designated approver stage" />
                    </SelectTrigger>
                    <SelectContent>
                        {stages.map((stage) => (
                            <SelectItem key={stage} value={stage}>
                                {stage}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            <div className="flex justify-end pt-4 gap-2">
                <Button
                    variant='outline'
                    onClick={onClose}
                    disabled={isLoading}  // Disable cancel button during loading
                >
                    Cancel
                </Button>
                <Button
                    type="submit"
                    className="hover:bg-blue-700"
                    disabled={isLoading}  // Disable submit button during loading
                >
                    {isLoading ? 'Submitting...' : 'Submit'}
                </Button>
            </div>
        </form>
    )
}
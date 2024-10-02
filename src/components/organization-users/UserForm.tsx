import React from 'react'
import { Input } from "../common/Input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../common/Select"
import { Button } from "../common/Button"
import { Trash2 } from 'lucide-react'

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
        firstName: string
        lastName: string
        email: string
        role: 'admin' | 'standard'
        title: string
        department: string
        linkedInUrl: string
        designatedApprover: string
    }
    onUpdate: (userData: any) => void
    onClose: () => void
}

export default function UserForm({ user, onUpdate, onClose }: UserFormProps) {
    const [userData, setUserData] = React.useState({
        firstName: user?.firstName || '',
        lastName: user?.lastName || '',
        email: user?.email || '',
        role: user?.role || 'standard',
        title: user?.title || '',
        department: user?.department || '',
        linkedInUrl: user?.linkedInUrl || '',
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
        onClose()
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Input
                        id="firstName"
                        name="firstName"
                        value={userData.firstName}
                        onChange={handleInputChange}
                        placeholder='Enter first name'
                        required
                    />
                </div>
                <div className="space-y-2">
                    <Input
                        id="lastName"
                        name="lastName"
                        value={userData.lastName}
                        onChange={handleInputChange}
                        placeholder='Enter last name'
                        required
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
                />
            </div>

            <div className="space-y-2">
                <Select
                    value={userData.role}
                    onValueChange={handleSelectChange('role')}
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
                />
            </div>

            <div className="space-y-2">
                <Input
                    id="department"
                    name="department"
                    value={userData.department}
                    onChange={handleInputChange}
                    placeholder='Enter department'
                />
            </div>

            <div className="space-y-2">
                <Input
                    id="linkedInUrl"
                    name="linkedInUrl"
                    type="url"
                    value={userData.linkedInUrl}
                    onChange={handleInputChange}
                    placeholder='Enter LinkedIn URL'
                />
            </div>

            <div className="space-y-2">
                <Select
                    value={userData.designatedApprover}
                    onValueChange={handleSelectChange('designatedApprover')}
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
                >
                    Cancel
                </Button>
                <Button
                    type="submit"
                    className="hover:bg-blue-700"
                    onClick={handleSubmit}
                >
                    Submit
                </Button>
            </div>
        </form>
    )
}
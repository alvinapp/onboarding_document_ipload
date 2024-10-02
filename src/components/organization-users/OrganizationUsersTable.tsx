import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../common/Table";
import { Input } from "../common/Input";
import { Button } from "../common/Button";
import { Avatar, AvatarFallback, AvatarImage } from "../common/Avatar";
import { ChevronLeft, ChevronRight, Search, Pencil, LucideTrash2, UserPlus2 } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { useUserStore } from '../../store/useUserStore';
import { useToast } from '../common/ToastProvider';
import logoSvg from '../../assets/alvinlogo1.svg';
import { Card } from '../common/Card';
import EditUserDialog from './EditUserDialog';
import AlertDialogWrapper from '../common/AlertDialogWrapper';

function formatDate(dateString: string | null): string {
    if (!dateString) return 'Not logged in yet';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export default function OrganizationUsersTable() {
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState('');
    const navigate = useNavigate();
    const { users } = useUserStore();
    const { showToast } = useToast();

    console.log(users);

    // Filter users based on the search input
    const filteredUsers = users.filter(
        (user) =>
            user.first_name.toLowerCase().includes(search.toLowerCase()) ||
            user.last_name.toLowerCase().includes(search.toLowerCase()) ||
            user.email.toLowerCase().includes(search.toLowerCase()) ||
            user.role.toLowerCase().includes(search.toLowerCase())
    );

    const totalPages = Math.ceil(filteredUsers.length / 6);

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex justify-center mb-8">
                <img src={logoSvg} alt="Alvin Logo" className="h-12" />
            </div>
            <AnimatePresence>
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.5 }}>
                    <Card>
                        <div className="p-6">
                            <div className="flex items-center shadow p-2 rounded-md bg-white w-8 cursor-pointer hover:bg-accent" onClick={() => navigate(-1)}>
                                <ChevronLeft className="h-4 w-4" />
                            </div>
                            <div className="flex justify-between items-center mb-6">
                                <div>
                                    <h2 className="text-2xl font-semibold text-gray-900">User List</h2>
                                    <p className="text-sm text-gray-500">See information about all users</p>
                                </div>
                                <div className="flex space-x-4">
                                    <div className="relative">
                                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                        <Input
                                            type="text"
                                            placeholder="Search"
                                            className="pl-10 pr-4 py-2 w-64"
                                            value={search}
                                            onChange={(e) => setSearch(e.target.value)}
                                        />
                                    </div>
                                    <EditUserDialog user={{
                                        firstName: '',
                                        lastName: '',
                                        email: '',
                                        role: 'standard',
                                        title: '',
                                        department: '',
                                        linkedInUrl: '',
                                        designatedApprover: ''
                                    }} triggerButton={<Button><UserPlus2 className="h-4 w-4 mr-2" />ADD USER</Button>}
                                        dialogTitle='Add New User'
                                        dialogDescription='Fill in the details below to add a new user.'
                                    />
                                </div>
                            </div>

                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="w-[300px]">Name</TableHead>
                                        <TableHead>Role</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>First Login</TableHead>
                                        <TableHead>Last Login</TableHead>
                                        <TableHead></TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredUsers.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={6} className="text-center py-4">
                                                No users found.
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        filteredUsers.slice((page - 1) * 6, page * 6).map((user) => (
                                            <TableRow key={user.user_id}>
                                                <TableCell className="flex items-center space-x-3">
                                                    <Avatar>
                                                        <AvatarFallback>{user.first_name.charAt(0)}</AvatarFallback>
                                                    </Avatar>
                                                    <div>
                                                        <div className="font-medium">{user.first_name} {user.last_name}</div>
                                                        <div className="text-sm text-gray-500">{user.email}</div>
                                                    </div>
                                                </TableCell>
                                                <TableCell>{user.role}</TableCell>
                                                <TableCell className="flex items-center">
                                                    <div className={`px-2 py-1 rounded-full text-xs font-medium ${user.is_verified ? 'bg-green-100' : 'bg-[#f1f3fe]'}`}>
                                                        {user.is_verified ? 'Verified' : 'Pending Verification'}
                                                    </div>
                                                </TableCell>
                                                <TableCell>{formatDate(user.first_login)}</TableCell>
                                                <TableCell>{formatDate(user.last_login)}</TableCell>
                                                <TableCell>
                                                    <EditUserDialog user={{
                                                        firstName: user.first_name,
                                                        lastName: user.last_name,
                                                        email: user.email,
                                                        role: user.role as 'admin' | 'standard',
                                                        title: '', // Provide default or fetched value
                                                        department: '', // Provide default or fetched value
                                                        linkedInUrl: '', // Provide default or fetched value
                                                        designatedApprover: '' // Provide default or fetched value
                                                    }} triggerButton={
                                                        <Button variant="ghost" size="sm" className='hover:bg-green-100'>
                                                            <Pencil className="h-4 w-4" />
                                                        </Button>
                                                    } />
                                                    <AlertDialogWrapper
                                                        triggerButton={
                                                            <Button variant="ghost" size="sm" className="hover:bg-red-100">
                                                                <LucideTrash2 className="h-4 w-4" />
                                                            </Button>
                                                        }
                                                        title='Delete User'
                                                        description='Are you sure you want to delete this user?'
                                                        confirmButtonText='Yes, Delete'
                                                        onConfirm={() => {
                                                            // Delete user logic here
                                                            console.log(`Deleting document: ${user.first_name} ${user.last_name}`);
                                                            showToast({
                                                                title: "User Deleted",
                                                                description: "The user has been deleted successfully.",
                                                                type: "success",
                                                            })
                                                        }}
                                                    />
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>

                            {totalPages > 0 && <div className="flex justify-between items-center mt-4">
                                <p className="text-sm text-gray-500">
                                    Page {page} of {totalPages}
                                </p>
                                <div className="flex space-x-2">
                                    <Button variant="outline" size="sm" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}>
                                        <ChevronLeft className="h-4 w-4 mr-2" /> PREV
                                    </Button>
                                    <Button variant="outline" size="sm" onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages}>
                                        NEXT <ChevronRight className="h-4 w-4 ml-2" />
                                    </Button>
                                </div>
                            </div>}
                        </div>
                    </Card>
                </motion.div>
            </AnimatePresence>
        </div>
    );
}
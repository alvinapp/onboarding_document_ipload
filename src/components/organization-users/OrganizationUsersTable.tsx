import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../common/Table";
import { Input } from "../common/Input";
import { Button } from "../common/Button";
import { Avatar, AvatarFallback } from "../common/Avatar";
import { ChevronLeft, ChevronRight, Search, Pencil, LucideTrash2, UserPlus2, RefreshCwIcon, Loader2 } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { useUserStore } from '../../store/useUserStore';
import { useOrganizationStore } from '../../store/useOrganizationStore';
import { useToast } from '../common/ToastProvider';
import logoSvg from '../../assets/alvinlogo1.svg';
import { Card } from '../common/Card';
import { useQuery, useMutation } from 'react-query';
import EditUserDialog from './EditUserDialog';
import AlertDialogWrapper from '../common/AlertDialogWrapper';
import AddUserDialog from './AddUserDialog';
import axios from 'axios';

// Utility function to format dates
const formatDate = (dateString: string | null): string => {
    if (!dateString) return 'Not logged in yet';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

// Custom hook for pagination
const usePagination = (totalItems: number, itemsPerPage: number) => {
    const [page, setPage] = useState(1);
    const totalPages = Math.ceil(totalItems / itemsPerPage);

    const nextPage = () => setPage((prev) => Math.min(totalPages, prev + 1));
    const prevPage = () => setPage((prev) => Math.max(1, prev - 1));

    return { page, totalPages, nextPage, prevPage, setPage };
};

export default function OrganizationUsersTable() {
    const [search, setSearch] = useState('');
    const navigate = useNavigate();
    const { users, deleteUser, setUsers } = useUserStore();
    const { selectedOrganization } = useOrganizationStore();
    const { showToast } = useToast();
    const baseUrl = 'http://localhost:5001';

    const deleteUserUrl = `${baseUrl}/users/admin/delete`;
    const fetchOganizationUsersurl = `${baseUrl}/users/organization/admin-users/${selectedOrganization?.organizationId}/`;

    // Fetch users for the selected organization
    const { isLoading: isUsersLoading, refetch: fetchUsers } = useQuery(
        ['organizationUsers', selectedOrganization?.organizationId],
        () => axios.get(fetchOganizationUsersurl).then((res) => res.data.users),
        {
            enabled: !!selectedOrganization?.organizationId,
            onSuccess: (data) => setUsers(data),
            onError: () => {
                showToast({
                    title: "Error",
                    description: "Failed to fetch organization users. Please try again.",
                    type: "error",
                });
            },
        }
    );

    // Delete user mutation
    const deleteOrgUser = useMutation(
        (email: string) => axios.post(deleteUserUrl, { email }),
        {
            onSuccess: (_, email) => {
                deleteUser(email);
                showToast({
                    title: "User Deleted",
                    description: "The user has been deleted successfully.",
                    type: "success",
                });
            },
            onError: () => {
                showToast({
                    title: "Error",
                    description: "Failed to delete user. Please try again.",
                    type: "error",
                });
            },
        }
    );

    // Memoize filtered users
    const filteredUsers = useMemo(() => {
        return users
            .filter(
                (user) =>
                    user.first_name.toLowerCase().includes(search.toLowerCase()) ||
                    user.last_name.toLowerCase().includes(search.toLowerCase()) ||
                    user.email.toLowerCase().includes(search.toLowerCase()) ||
                    user.role.toLowerCase().includes(search.toLowerCase())
            )
            .sort((a, b) => {
                const fullNameA = `${a.first_name} ${a.last_name}`.toLowerCase();
                const fullNameB = `${b.first_name} ${b.last_name}`.toLowerCase();
                return fullNameA.localeCompare(fullNameB);
            });
    }, [users, search]);

    const { page, totalPages, nextPage, prevPage, setPage } = usePagination(filteredUsers.length, 6);

    // Handle search change
    const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value);
    }, []);

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
                                    <Button variant="outline" size="sm" onClick={() => fetchUsers()} disabled={isUsersLoading}>
                                    {isUsersLoading ? <Loader2 className="h-4 w-4 animate-spin" />: <RefreshCwIcon className='h-4 w-4' />}
                                    </Button>
                                    <div className="relative">
                                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                        <Input
                                            type="text"
                                            placeholder="Search"
                                            className="pl-10 pr-4 py-2 w-64"
                                            value={search}
                                            onChange={handleSearchChange}
                                        />
                                    </div>
                                    <AddUserDialog
                                        user={{
                                            first_name: '',
                                            last_name: '',
                                            email: '',
                                            role: 'standard',
                                            title: '',
                                            department: '',
                                            linkedin_url: '',
                                            designatedApprover: '',
                                        }}
                                        triggerButton={<Button><UserPlus2 className="h-4 w-4 mr-2" />ADD USER</Button>}
                                        dialogTitle="Add New User"
                                        dialogDescription="Fill in the details below to add a new user."
                                    />
                                </div>
                            </div>

                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="w-[300px]">Name</TableHead>
                                        <TableHead>Role</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Date Added</TableHead>
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
                                                    <div className={`px-2 py-1 rounded-full text-xs font-medium ${user.password_reset ? 'bg-green-100' : 'bg-[#f1f3fe]'}`}>
                                                        {user.password_reset ? 'Verified' : 'Pending Verification'}
                                                    </div>
                                                </TableCell>
                                                <TableCell>{formatDate(user.created_on)}</TableCell>
                                                <TableCell>{formatDate(user.last_login)}</TableCell>
                                                <TableCell>
                                                    <EditUserDialog
                                                        user={{
                                                            user_id: user.user_id,
                                                            first_name: user.first_name,
                                                            last_name: user.last_name,
                                                            email: user.email,
                                                            role: user.role as 'admin' | 'standard',
                                                            title: user.title,
                                                            department: user.department,
                                                            linkedin_url: user.linkedInUrl,
                                                            designatedApprover: '',
                                                        }}
                                                        triggerButton={
                                                            <Button variant="ghost" size="sm" className="hover:bg-green-100">
                                                                <Pencil className="h-4 w-4" />
                                                            </Button>
                                                        }
                                                    />
                                                    <AlertDialogWrapper
                                                        triggerButton={
                                                            <Button variant="ghost" size="sm" className="hover:bg-red-100">
                                                                <LucideTrash2 className="h-4 w-4" />
                                                            </Button>
                                                        }
                                                        title="Delete User"
                                                        description="Are you sure you want to delete this user?"
                                                        confirmButtonText="Yes, Delete"
                                                        onConfirm={() => deleteOrgUser.mutate(user.email)}
                                                    />
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>

                            {totalPages > 0 && (
                                <div className="flex justify-between items-center mt-4">
                                    <p className="text-sm text-gray-500">
                                        Page {page} of {totalPages}
                                    </p>
                                    <div className="flex space-x-2">
                                        <Button variant="outline" size="sm" onClick={prevPage} disabled={page === 1}>
                                            <ChevronLeft className="h-4 w-4 mr-2" /> PREV
                                        </Button>
                                        <Button variant="outline" size="sm" onClick={nextPage} disabled={page === totalPages}>
                                            NEXT <ChevronRight className="h-4 w-4 ml-2" />
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </Card>
                </motion.div>
            </AnimatePresence>
        </div>
    );
}
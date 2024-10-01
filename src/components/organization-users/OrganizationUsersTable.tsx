import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../common/Table";
import { Input } from "../common/Input";
import { Button } from "../common/Button";
import { Avatar, AvatarFallback, AvatarImage } from "../common/Avatar";
import { ChevronLeft, ChevronRight, Search, Pencil } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import logoSvg from '../../assets/alvinlogo1.svg';
import { Card } from '../common/Card';

interface Member {
    id: string;
    name: string;
    email: string;
    function: string;
    subFunction: string;
    status: 'PENDING INVITATION' | 'ACTIVE';
    employed: string;
    avatarUrl: string;
}

const members: Member[] = [
    { id: '1', name: 'Emma Roberts', email: 'emma@mail.com', function: 'Manager', subFunction: 'Organization', status: 'ACTIVE', employed: '23/04/24', avatarUrl: '/placeholder.svg?height=40&width=40' },
    { id: '2', name: 'Marcel Glock', email: 'marcel@mail.com', function: 'Executive', subFunction: 'Projects', status: 'ACTIVE', employed: '23/04/24', avatarUrl: '/placeholder.svg?height=40&width=40' },
    { id: '3', name: 'Misha Stam', email: 'misha@mail.com', function: 'Social Media', subFunction: 'Projects', status: 'PENDING INVITATION', employed: '23/04/24', avatarUrl: '/placeholder.svg?height=40&width=40' },
    { id: '4', name: 'Lucian Eurel', email: 'lucian@mail.com', function: 'Programator', subFunction: 'Developer', status: 'PENDING INVITATION', employed: '23/04/24', avatarUrl: '/placeholder.svg?height=40&width=40' },
    { id: '5', name: 'Linde Michele', email: 'linde@mail.com', function: 'Manager', subFunction: 'Organization', status: 'ACTIVE', employed: '23/04/24', avatarUrl: '/placeholder.svg?height=40&width=40' },
    { id: '6', name: 'Georg Joshiash', email: 'georg@mail.com', function: 'Designer', subFunction: 'Projects', status: 'ACTIVE', employed: '23/04/24', avatarUrl: '/placeholder.svg?height=40&width=40' },
];

function parseDate(dateStr: string): Date {
    const [day, month, year] = dateStr.split('/').map(Number);
    return new Date(`20${year}-${month}-${day}`); // Assuming the year is in the format 'YY'
}

export default function OrganizationUsersTable() {
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState('');
    const navigate = useNavigate();

    const filteredMembers = members.filter(
        (member) =>
            member.name.toLowerCase().includes(search.toLowerCase()) ||
            member.email.toLowerCase().includes(search.toLowerCase()) ||
            member.function.toLowerCase().includes(search.toLowerCase())
    );

    const totalPages = Math.ceil(filteredMembers.length / 6);

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
                                    <h2 className="text-2xl font-semibold text-gray-900">Members List</h2>
                                    <p className="text-sm text-gray-500">See information about all members</p>
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
                                    <Button>ADD MEMBER</Button>
                                </div>
                            </div>

                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="w-[300px]">Name</TableHead>
                                        <TableHead>Function</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Date Added</TableHead>
                                        <TableHead className="w-[50px]"></TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredMembers.slice((page - 1) * 6, page * 6).map((member) => (
                                        <TableRow key={member.id}>
                                            <TableCell className="flex items-center space-x-3">
                                                <Avatar>
                                                    <AvatarImage src={member.avatarUrl} alt={member.name} />
                                                    <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                                                </Avatar>
                                                <div>
                                                    <div className="font-medium">{member.name}</div>
                                                    <div className="text-sm text-gray-500">{member.email}</div>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div>{member.function}</div>
                                                <div className="text-sm text-gray-500">{member.subFunction}</div>
                                            </TableCell>
                                            <TableCell className="flex items-center">
                                                <div className={`px-2 py-1 rounded-full text-xs font-medium ${member.status === 'ACTIVE' ? 'bg-green-100' : 'bg-[#f1f3fe]'}`}>
                                                    {member.status}
                                                </div>
                                            </TableCell>
                                            <TableCell>{parseDate(member.employed).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</TableCell>
                                            <TableCell>
                                                <Button variant="ghost" size="sm">
                                                    <Pencil className="h-4 w-4" />
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>

                            <div className="flex justify-between items-center mt-4">
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
                            </div>
                        </div>
                    </Card>
                </motion.div>
            </AnimatePresence>
        </div>
    );
}
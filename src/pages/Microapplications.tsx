import React, { useState, useMemo, useCallback, useRef } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/common/Table";
import { Button } from "../components/common/Button";
import { Input } from "../components/common/Input";
import { CreditCard, Plus, Plane, ChevronLeft, AreaChartIcon } from 'lucide-react';
import DialogWrapper from '../components/common/DialogWrapper';
import { AnimatePresence, motion } from 'framer-motion';
import { Card } from '../components/common/Card';
import { useNavigate } from 'react-router-dom';
import PieChart from '../components/common/PieChart';
import AmChart3DClusteredBarChart from '../components/common/CommissionBarChart';
import { CustomDrawer, CustomDrawerRef } from '../components/common/CustomDrawer';
import { Popover, PopoverContent, PopoverTrigger } from '../components/common/Popover';
import DateRangePicker from '../components/common/DateRangePicker';

import logoSvg from '../assets/alvinlogo1.svg';

const organizations = [
    { id: 1, name: "Acme Corp", flightsBooked: 1800, creditsLeft: 6000, totalGMV: 12000 * 123 },
    { id: 2, name: "Globex Inc", flightsBooked: 900, creditsLeft: 3000, totalGMV: 6000 * 123 },
    { id: 3, name: "Initech", flightsBooked: 2400, creditsLeft: 1200, totalGMV: 2400 * 123 },
    { id: 4, name: "Umbrella Corp", flightsBooked: 1200, creditsLeft: 3600, totalGMV: 7200 * 123 },
    { id: 5, name: "Wayne Enterprises", flightsBooked: 600, creditsLeft: 2400, totalGMV: 4800 * 123 },
    { id: 6, name: "Stark Industries", flightsBooked: 3600, creditsLeft: 4800, totalGMV: 9600 * 123 },
    { id: 7, name: "Tyrell Corp", flightsBooked: 1500, creditsLeft: 1800, totalGMV: 3600 * 123 },
];

const generateRandomData = () =>
    organizations.map(org => ({
        label: org.name,
        value: Math.floor(Math.random() * 3000) + 50,
        category: org.name,
    }));

const generateRandomCommissionData = () =>
    organizations.map(org => {
        const sales = Math.floor(Math.random() * 100000) + 500;
        return { label: org.name, sales, commission: sales * 0.3, organization: org.name };
    });

const FlightStatistics: React.FC = () => {
    const [totalCredits, setTotalCredits] = useState(150000);
    const [selectedOrg, setSelectedOrg] = useState<number | null>(null);
    const [creditAmount, setCreditAmount] = useState('');
    const [selectedRange, setSelectedRange] = useState<{ start: Date; end: Date } | null>(null);
    const [isOpen, setIsOpen] = useState(false);
    const drawerRef = useRef<CustomDrawerRef>(null);

    const navigate = useNavigate();

    const pieChartData = useMemo(() => generateRandomData(), [selectedRange]);
    const commissionData = useMemo(() => generateRandomCommissionData(), [selectedRange]);

    const handleAddCredits = useCallback(() => {
        const amount = parseInt(creditAmount);
        if (isNaN(amount) || amount <= 0) return;

        if (selectedOrg === null) {
            setTotalCredits(prev => prev + amount);
        } else {
            organizations.forEach(org => {
                if (org.id === selectedOrg) org.creditsLeft += amount;
            });
            console.log('Updated organizations:', organizations);
        }

        setCreditAmount('');
        setSelectedOrg(null);
    }, [creditAmount, selectedOrg]);

    const handleRangeSelect = useCallback((range: { start: any; end: any; }) => {
        if (range.start && range.end) {
            setSelectedRange({ start: range.start, end: range.end });
        } else {
            setSelectedRange(null);
        }
    }, []);

    const handleViewStatistics = () => {
        if (selectedRange) {
            setIsOpen(false); // Close the Popover
            drawerRef.current?.open(); // Open the CustomDrawer
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex justify-center mb-8">
                <img src={logoSvg} alt="Alvin Logo" className="h-12" />
            </div>
            <AnimatePresence>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.5 }}
                >
                    <Card>
                        <div className="p-6">
                            <div className="flex justify-between items-center mb-6">
                                <div className="flex flex-col gap-2">
                                    <div
                                        className="shadow p-2 rounded-md bg-white cursor-pointer hover:bg-accent w-8"
                                        onClick={() => navigate('/')}
                                    >
                                        <ChevronLeft className="h-4 w-4" />
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <CreditCard className="h-6 w-6 text-primary" />
                                        <h1 className="font-bold">Total Available Credits: {totalCredits.toLocaleString()}</h1>
                                    </div>
                                </div>
                                <div className="flex space-x-2">
                                    <DialogWrapper
                                        triggerButton={
                                            <Button variant="outline">
                                                <Plus className="mr-2 h-4 w-4" /> Add Credits
                                            </Button>
                                        }
                                        title="Add Credits"
                                        description='Add credits to the total overall available credits.'
                                    >
                                        {(onClose) => (
                                            <>
                                                <div className="py-4">
                                                    <Input
                                                        id="creditAmount"
                                                        type="number"
                                                        value={creditAmount}
                                                        onChange={(e) => setCreditAmount(e.target.value)}
                                                    />
                                                </div>
                                                <div className='flex justify-end'>
                                                    <Button variant="outline" onClick={onClose} className="mr-2">Cancel</Button>
                                                    <Button onClick={() => { handleAddCredits(); onClose(); }}>Add Credits</Button>
                                                </div>
                                            </>
                                        )}
                                    </DialogWrapper>
                                    <Popover open={isOpen} onOpenChange={setIsOpen}>
                                        <PopoverTrigger asChild>
                                            <Button className="text-blue-600">
                                                <AreaChartIcon className="mr-2 h-4 w-4" /> More Statistics
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0" align="start">
                                            <DateRangePicker
                                                onRange={handleRangeSelect}
                                                initialStartDate={selectedRange ? selectedRange.start : new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)}
                                                initialEndDate={selectedRange ? selectedRange.end : new Date()}
                                            />
                                            <div className="flex justify-end mt-2 p-2">
                                                <Button className="w-full" disabled={!selectedRange} onClick={handleViewStatistics}>
                                                    <AreaChartIcon className="w-4 h-4 mr-2" /> View Statistics
                                                </Button>
                                            </div>
                                        </PopoverContent>
                                        <CustomDrawer
                                            ref={drawerRef}
                                            triggerButton={
                                                <Button className="hidden">Open Drawer</Button> // Hidden trigger button
                                            }
                                            title="Flight Booking Statistics"
                                            description="Statistics of flight bookings by organizations."
                                        >
                                            <div className="grid grid-cols-2 gap-2">
                                                <PieChart data={pieChartData} title="Flights by Organizations" />
                                                <AmChart3DClusteredBarChart data={commissionData} title="Sales & Commission" />
                                            </div>
                                            {selectedRange && (
                                                <p className="text-sm mt-4">
                                                    Showing data from {selectedRange.start.toDateString()} to {selectedRange.end.toDateString()}
                                                </p>
                                            )}
                                        </CustomDrawer>

                                    </Popover>
                                </div>
                            </div>

                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Organization</TableHead>
                                        <TableHead>Flights Booked</TableHead>
                                        <TableHead>Credits Left</TableHead>
                                        <TableHead>Total GMV</TableHead>
                                        <TableHead>Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {organizations.map((org) => (
                                        <TableRow key={org.id}>
                                            <TableCell>{org.name}</TableCell>
                                            <TableCell>
                                                <div className="flex items-center space-x-2">
                                                    <Plane className="h-4 w-4 text-primary" />
                                                    <span>{org.flightsBooked.toLocaleString()}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell>{org.creditsLeft.toLocaleString()}</TableCell>
                                            <TableCell>{org.totalGMV.toLocaleString()}</TableCell>
                                            <TableCell>
                                                <DialogWrapper
                                                    triggerButton={
                                                        <Button size="sm" variant="outline" onClick={() => setSelectedOrg(org.id)}>
                                                            <Plus className="mr-2 h-4 w-4" /> Add Credits
                                                        </Button>
                                                    }
                                                    title={`Add Credits for ${org.name}`}
                                                    description='Add credits to the organization.'
                                                >
                                                    {(onClose) => (
                                                        <>
                                                            <div className="py-4">
                                                                <Input
                                                                    id="orgCreditAmount"
                                                                    type="number"
                                                                    value={creditAmount}
                                                                    onChange={(e) => setCreditAmount(e.target.value)}
                                                                />
                                                            </div>
                                                            <div className='flex justify-end'>
                                                                <Button variant="outline" onClick={onClose} className="mr-2">Cancel</Button>
                                                                <Button onClick={() => { handleAddCredits(); onClose(); }}>Add Credits</Button>
                                                            </div>
                                                        </>
                                                    )}
                                                </DialogWrapper>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    </Card>
                </motion.div>
            </AnimatePresence>
        </div>
    );
};

export default FlightStatistics;

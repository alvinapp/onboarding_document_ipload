import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from './Avatar'
import { Button } from './Button';
import { Progress } from './Progress';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './Table';
import { MoreHorizontal, Filter } from 'lucide-react';

const organizationData = [
  {
    organization: 'I&M Bank',
    assignee: ['Airi Satou', 'Angelica Ramos', 'Ashton Cox'],
    team: 'Account profile creation',
    dueDate: '31 Jan 2024',
    progress: 10,
  },
  {
    organization: 'United Capital',
    assignee: ['Brielle Williamson', 'Bruno Nash', 'Caesar Vance'],
    team: 'Integration and Deployment',
    dueDate: '15 Feb 2024',
    progress: 100,
  },
  {
    organization: 'Nestle',
    assignee: ['Cara Stevens', 'Cedric Kelly'],
    team: 'Scoping and program phasing',
    dueDate: '01 Mar 2024',
    progress: 75,
  },
  {
    organization: 'Family Bank',
    assignee: ['Bradley Greer', 'Brenden Wagner'],
    team: 'Pricing agreement',
    dueDate: '20 Mar 2024',
    progress: 80,
  },
  {
    organization: 'ARM',
    assignee: ['Brielle Williamson', 'Bruno Nash'],
    team: 'Scoping and program phasing',
    dueDate: '27 Mar 2024',
    progress: 60,
  },
];

export default function CustomTable() {
  return (
    <div className="w-full p-6 bg-white rounded-lg shadow">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Organization Table</h2>
          <p className="text-sm text-gray-500">30 done this month</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="flex items-center gap-2">
            <div className="h-4 w-4">
              <Filter />
            </div>
            FILTER
          </Button>
          <Button variant="default" className="bg-gray-900 text-white">NEW ORGANIZATION</Button>
        </div>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[300px]">Organization</TableHead>
            <TableHead>Assignee</TableHead>
            <TableHead>Launchpad Stage</TableHead>
            <TableHead>Progress</TableHead>
            <TableHead>Due Date</TableHead>
            <TableHead className="w-[50px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {organizationData
            .sort((a, b) => a.organization.localeCompare(b.organization)) // {{ edit_1 }}
            .map((organization, index) => (
              <TableRow key={index}>
                <TableCell className="font-medium">{organization.organization}</TableCell>
                <TableCell>
                  <div className="flex -space-x-2">
                    {organization.assignee.map((person, personIndex) => (
                      <Avatar key={personIndex} className="border-2 border-white">
                        <AvatarImage src={`https://randomuser.me/api/portraits/men/${Math.floor(Math.random() * 100)}.jpg`} />
                        <AvatarFallback>{person.charAt(0)}</AvatarFallback>
                      </Avatar>
                    ))}
                  </div>
                </TableCell>
                <TableCell>
                  <span className="px-2 py-1 bg-gray-100 rounded-full text-xs font-medium">
                    {organization.team}
                  </span>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col items-start gap-1">
                    <span className="text-xs font-medium">{organization.progress}%</span>
                    <Progress value={organization.progress} className="w-[80px] h-[10px] bg-[#f7f7f7]" />
                  </div>
                </TableCell>
                <TableCell>{organization.dueDate}</TableCell>
                <TableCell>
                  <Button variant="ghost" size="icon">
                    <div className="h-4 w-4">
                      <MoreHorizontal />
                    </div>
                  </Button>
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
      <div className="flex justify-between items-center mt-4">
        <p className="text-sm text-gray-500">Page 2 of 10</p>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">PREV</Button>
          <Button variant="outline" size="sm">NEXT</Button>
        </div>
      </div>
    </div>
  );
}
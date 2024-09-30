import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from './Avatar'
import { Button } from './Button';
import { Progress } from './Progress';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './Table';
import { MoreHorizontal, Filter } from 'lucide-react';

const organizationData = [
  {
    project: 'I&M Bank',
    assignee: ['Airi Satou', 'Angelica Ramos', 'Ashton Cox'],
    budget: '$140,000',
    team: 'DESIGN',
    dueDate: '31 Jan 2024',
    progress: 50,
  },
  {
    project: 'United Capital',
    assignee: ['Brielle Williamson', 'Bruno Nash', 'Caesar Vance'],
    budget: '$200,000',
    team: 'BACK-END',
    dueDate: '15 Feb 2024',
    progress: 100,
  },
  {
    project: 'Scoping Analysis',
    assignee: ['Cara Stevens', 'Cedric Kelly'],
    budget: '$300,000',
    team: 'DEVELOPMENT',
    dueDate: '01 Mar 2024',
    progress: 75,
  },
  {
    project: 'Platform Errors Fix',
    assignee: ['Bradley Greer', 'Brenden Wagner'],
    budget: '$100,000',
    team: 'DEVELOPMENT',
    dueDate: '20 Mar 2024',
    progress: 50,
  },
  {
    project: 'New Pricing Page',
    assignee: ['Brielle Williamson', 'Bruno Nash'],
    budget: '$80,000',
    team: 'MARKETING',
    dueDate: '27 Mar 2024',
    progress: 60,
  },
];

export default function CustomTable() {
  return (
    <div className="w-full p-6 bg-white rounded-lg shadow">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Projects Table</h2>
          <p className="text-sm text-gray-500">30 done this month</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="flex items-center gap-2">
            <div className="h-4 w-4">
              <Filter />
            </div>
            FILTER
          </Button>
          <Button variant="default" className="bg-gray-900 text-white">NEW PROJECT</Button>
        </div>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[300px]">Project</TableHead>
            <TableHead>Assignee</TableHead>
            <TableHead>Budget</TableHead>
            <TableHead>Team</TableHead>
            <TableHead>Progress</TableHead>
            <TableHead>Due Date</TableHead>
            <TableHead className="w-[50px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {organizationData.map((project, index) => (
            <TableRow key={index}>
              <TableCell className="font-medium">{project.project}</TableCell>
              <TableCell>
                <div className="flex -space-x-2">
                  {project.assignee.map((person, personIndex) => (
                    <Avatar key={personIndex} className="border-2 border-white">
                      <AvatarImage src={`https://randomuser.me/api/portraits/men/${personIndex}.jpg`} />
                      <AvatarFallback>{person.charAt(0)}</AvatarFallback>
                    </Avatar>
                  ))}
                </div>
              </TableCell>
              <TableCell>{project.budget}</TableCell>
              <TableCell>
                <span className="px-2 py-1 bg-gray-100 rounded-full text-xs font-medium">
                  {project.team}
                </span>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Progress value={project.progress} className="w-[100px] bg-[#f7f7f7]" />
                  <span className="text-sm font-medium">{project.progress}%</span>
                </div>
              </TableCell>
              <TableCell>{project.dueDate}</TableCell>
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
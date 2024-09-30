import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'
import { Avatar, AvatarFallback, AvatarImage } from './Avatar';
import { Button } from './Button';
import { Progress } from './Progress';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './Table';
import { MoreHorizontal, Filter, ArrowLeft, ChevronLeft } from 'lucide-react';
import { useQuery } from 'react-query';
import axios from 'axios';
import CustomLoader from './CustomLoader';
import CreateOrganizationDialog from './CreateOrganization';

export default function CustomTable() {
  const [page, setPage] = useState(1);
  const perPage = 10;
  const navigate = useNavigate();

  const baseUrl = 'http://localhost:5001';

  const { data, isLoading, isError, isFetching } = useQuery(
    ['onboardingSteps', page],
    () =>
      axios
        .get(
          `${baseUrl}/onboarding_steps/all?page=${page}&per_page=${perPage}`
        )
        .then((res) => res.data),
    {
      keepPreviousData: true,
      staleTime: 60*1000*5,
    }
  );

  if (isLoading) return <div className='flex items-center justify-center w-full h-full'><CustomLoader isLoading={isLoading} /></div>;
  if (isError) return <div>Error loading data.</div>;

  const organizationData = data.steps.map((step: any) => ({
    organization: step.organization_name,
    assignee: ['John Doe', 'Jane Smith'], // Dummy assignee data
    launchpadStage: step.latest_step_name,
    progress: step.latest_step_progress,
    dueDate: step.due_date
      ? new Date(step.due_date).toLocaleDateString(
        'en-US',
        {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        }
      )
      : 'N/A',
  }));

  return (
    <div className="w-full p-6 bg-white rounded-lg shadow">
      <CustomLoader isLoading={isFetching} />
      <div className="flex justify-between items-center mb-6">
        <div>
        <div className='flex items-center shadow p-2 rounded-md bg-white w-8 cursor-pointer hover:bg-accent mb-1' onClick={
            () => navigate("/")
          }>
              <ChevronLeft className="h-4 w-4" />
          </div>
          <p className="text-sm text-gray-500">
            {data.total} organizations
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            FILTER
          </Button>
          {/* <Button variant="default" className="bg-gray-900 text-white">
            NEW ORGANIZATION
          </Button> */}
          <CreateOrganizationDialog/>
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
            <TableHead className="w-[50px]" />
          </TableRow>
        </TableHeader>
        <TableBody>
          {organizationData
            .sort((a: any, b: any) => a.organization.localeCompare(b.organization))
            .map((org: any, index: any) => (
              <TableRow key={index} className='cursor-pointer' onClick={()=>{navigate('/organization-dashboard')}}>
                <TableCell className="font-medium">
                  {org.organization}
                </TableCell>
                <TableCell>
                  <div className="flex -space-x-2">
                    {org.assignee.map((person: any, idx: any) => (
                      <Avatar
                        key={idx}
                        className="border-2 border-white"
                      >
                        <AvatarImage
                          src={`https://randomuser.me/api/portraits/men/${(index + idx) % 100
                            }.jpg`}
                        />
                        <AvatarFallback>
                          {person.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                    ))}
                  </div>
                </TableCell>
                <TableCell>
                  <span className="px-2 py-1 bg-gray-100 rounded-full text-xs font-medium">
                    {org.launchpadStage}
                  </span>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col items-start gap-1">
                    <span className="text-xs font-medium">
                      {org.progress}%
                    </span>
                    <Progress
                      value={org.progress}
                      className="w-[80px] h-[10px] bg-[#f7f7f7]"
                    />
                  </div>
                </TableCell>
                <TableCell>{org.dueDate}</TableCell>
                <TableCell>
                  <Button variant="ghost" size="icon">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
      <div className="flex justify-between items-center mt-4">
        <p className="text-sm text-gray-500">
          Page {data.current_page} of {data.pages}
        </p>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((old) => Math.max(old - 1, 1))}
            disabled={!data.has_prev}
          >
            PREV
          </Button>
          {Array.from({ length: data.pages }, (_, i) => (
            <Button
              key={i}
              variant="outline"
              size="sm"
              onClick={() => setPage(i + 1)}
              className={i + 1 === data.current_page ? 'bg-gray-200' : ''}
            >
              {i + 1}
            </Button>
          ))}
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              setPage((old) =>
                data.has_next ? Math.min(old + 1, data.pages) : old
              )
            }
            disabled={!data.has_next}
          >
            NEXT
          </Button>
        </div>
      </div>
    </div>
  );
}
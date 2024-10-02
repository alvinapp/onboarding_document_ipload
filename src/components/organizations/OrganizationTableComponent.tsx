import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../common/Button';
import { Progress } from '../common/Progress';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../common/Table';
import { MoreHorizontal, Filter, ChevronLeft } from 'lucide-react';
import { useQuery } from 'react-query';
import axios from 'axios';
import CustomLoader from '../common/CustomLoader';
import CreateOrganizationDialog from './CreateOrganizationDialog';
import { useOrganizationStore } from '../../store/useOrganizationStore';
import { DropdownButton } from '../common/DropDownButton';
import { FilterDropdown } from './FilterProps';

export default function CustomTable() {
  const [page, setPage] = useState(1);
  const perPage = 10;
  const navigate = useNavigate();

  // State to handle filters - explicitly typed as Date | null for startDate, endDate, and string for stage
  const [filters, setFilters] = useState<{ startDate: Date | null; endDate: Date | null; stage: string }>({
    startDate: null,
    endDate: null,
    stage: '',
  });

  const baseUrl = 'http://localhost:5001';

  const { organizations, setOrganizations, selectOrganization } = useOrganizationStore();

  const { data, isLoading, isError, isFetching } = useQuery(
    ['onboardingSteps', page, filters],
    () =>
      axios
        .get(
          `${baseUrl}/onboarding_steps/all?page=${page}&per_page=${perPage}&start_date=${
            filters.startDate ? filters.startDate.toISOString() : ''
          }&end_date=${filters.endDate ? filters.endDate.toISOString() : ''}&stage=${filters.stage}`
        )
        .then((res) => res.data),
    {
      keepPreviousData: true,
      staleTime: 60 * 1000 * 5,
    }
  );

  useEffect(() => {
    if (data) {
      const orgData = data.steps.map((step: any) => {
        const documents = step.steps.flatMap((stepDetail: any) =>
          stepDetail.document_links.map((doc: any) => ({
            documentId: doc.id,
            linkType: doc.link_type,
            documentLink: doc.document_link,
            documentType: doc.document_type,
            documentName: doc.document_name,
            createdAt: new Date(doc.created_at).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            }),
          }))
        );

        return {
          organizationId: step.organization_id,
          organization: step.organization_name,
          assignee: ['John Doe', 'Jane Smith'],
          launchpadStage: step.latest_step_name,
          launchpadStepNumber: step.latest_step_number,
          progress: step.latest_step_progress,
          dueDate: step.due_date
            ? new Date(step.due_date).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              })
            : 'N/A',
          organizationCreatedOn: new Date(step.organization_created_on).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
          }),
          documents: documents,
        };
      });

      setOrganizations(orgData);
    }
  }, [data, setOrganizations]);

  // Handle filter submission with proper typing
  const handleFilter = ({ startDate, endDate, stage }: { startDate: Date | null; endDate: Date | null; stage: string | null }) => {
    // Ensure stage is always a string (convert null to empty string)
    setFilters({ startDate, endDate, stage: stage || '' });
    setPage(1); // Reset to first page when applying new filters
  };

  if (isLoading)
    return (
      <div className="flex items-center justify-center w-full h-full">
        <CustomLoader isLoading={isLoading} />
      </div>
    );
  if (isError) return <div>Error loading data.</div>;

  return (
    <div className="w-full p-6 bg-white rounded-lg shadow">
      <CustomLoader isLoading={isFetching} />
      <div className="flex justify-between items-center mb-6">
        <div>
          <div
            className="flex items-center shadow p-2 rounded-md bg-white w-8 cursor-pointer hover:bg-accent mb-1"
            onClick={() => navigate('/')}
          >
            <ChevronLeft className="h-4 w-4" />
          </div>
          <p className="text-sm text-gray-500">{data.total} organizations</p>
        </div>
        <div className="flex gap-2">
          {/* <DropdownButton label="Filter" icon={<Filter className="h-4 w-4" />} children={
            <FilterDropdown onFilter={handleFilter} />
          } /> */}
          <CreateOrganizationDialog />
        </div>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[300px]">Organization</TableHead>
            <TableHead>Launchpad Stage</TableHead>
            <TableHead>Due Date</TableHead>
            <TableHead>Progress</TableHead>
            <TableHead>Date Created</TableHead>
            <TableHead className="w-[50px]" />
          </TableRow>
        </TableHeader>
        <TableBody>
          {organizations.map((org: any) => (
            <TableRow
              key={org.organizationId}
              className="cursor-pointer"
              onClick={() => {
                selectOrganization(org);
                navigate('/organization-dashboard');
              }}
            >
              <TableCell className="font-medium">{org.organization}</TableCell>
              <TableCell>
                <span className="px-2 py-1 bg-gray-100 rounded-full text-xs font-medium">
                  {org.launchpadStage?.toUpperCase()}
                </span>
              </TableCell>
              <TableCell>{org.dueDate}</TableCell>
              <TableCell>
                <div className="flex flex-col items-start gap-1">
                  <span className="text-xs font-medium">{org.progress}%</span>
                  <Progress
                    value={org.progress}
                    className="w-[80px] h-[10px] bg-[#f7f7f7]"
                  />
                </div>
              </TableCell>
              <TableCell>{org.organizationCreatedOn}</TableCell>
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
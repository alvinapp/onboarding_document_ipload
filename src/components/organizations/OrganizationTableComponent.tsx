import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../common/Button';
import { Progress } from '../common/Progress';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../common/Table';
import { ChevronLeft, Loader2, RefreshCwIcon, Search, XCircle } from 'lucide-react';
import { useQuery, useMutation } from 'react-query';
import axios from 'axios';
import CustomLoader from '../common/CustomLoader';
import CreateOrganizationDialog from './CreateOrganizationDialog';
import { useOrganizationStore } from '../../store/useOrganizationStore';
import EditOrganizationDialog from './EditOrganizationDialog';
import { useToast } from '../common/ToastProvider';
import { Input } from '../common/Input';

export default function CustomTable() {
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [submittedSearchTerm, setSubmittedSearchTerm] = useState('');
  const [isSearchActive, setIsSearchActive] = useState(false);
  const perPage = 10;
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { organizations, setOrganizations, selectOrganization } = useOrganizationStore();
  const baseUrl = process.env.REACT_APP_BASE_URL;

  const fetchOrganizations = async () => {
    const endpoint = submittedSearchTerm
      ? `${baseUrl}/onboarding_steps/search`
      : `${baseUrl}/onboarding_steps/all`;

    const response = await axios({
      method: submittedSearchTerm ? 'post' : 'get',
      url: endpoint,
      data: submittedSearchTerm ? { search_term: submittedSearchTerm } : undefined,
      params: submittedSearchTerm ? {} : { page, per_page: perPage },
    });

    if (submittedSearchTerm && response.data.steps.length === 0) {
      showToast({
        title: 'No Results',
        description: `No organization found for search term '${submittedSearchTerm}'`,
        type: 'warning',
      });
      return { steps: [] }; // Return empty data
    }

    return response.data;
  };

  const { data, isLoading, isError, isFetching, refetch } = useQuery(
    ['onboardingSteps', page, submittedSearchTerm],
    fetchOrganizations,
    {
      keepPreviousData: false,
      staleTime: 60 * 1000 * 5,
      refetchOnWindowFocus: true,
    }
  );

  const deleteOrg = useMutation(
    (organizationId) => axios.post(`${baseUrl}/organizations/${organizationId}/delete`),
    {
      onSuccess: () => {
        showToast({
          title: 'Success',
          description: 'Organization deleted successfully.',
          type: 'success',
        });
        refetch();
      },
      onError: () => {
        showToast({
          title: 'Error',
          description: 'Failed to delete organization.',
          type: 'error',
        });
      },
    }
  );

  useEffect(() => {
    if (data && data.steps) {
      const orgData = data.steps.map((step: { organization_id: any; organization_name: any; latest_step_name: any; latest_step_number: any; latest_step_progress: any; due_date: string | number | Date; organization_created_on: string | number | Date; }) => ({
        organizationId: step.organization_id,
        organization: step.organization_name,
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
        organizationCreatedOn: new Date(step.organization_created_on).toLocaleDateString(
          'en-US',
          { month: 'short', day: 'numeric', year: 'numeric' }
        ),
      }));
      setOrganizations(orgData);
    } else {
      setOrganizations([]); // Clear organizations if no data
    }
  }, [data, setOrganizations]);

  const handleClearSearch = () => {
    setSearchTerm(''); // Clear the search input
    setSubmittedSearchTerm(''); // Clear the submitted search term
    setIsSearchActive(false); // Deactivate search mode
    setPage(1); // Reset to the first page
    refetch(); // Fetch all organizations
  };

  const handleSearchChange = (e: { target: { value: any; }; }) => {
    const value = e.target.value;
    setSearchTerm(value);

    if (value === '') {
      setPage(1);
      setSubmittedSearchTerm(''); // Clear submitted search term
      refetch(); // Refetch all data if search is cleared
    }
  };

  const handleKeyDown = (e: { key: string; }) => {
    if (e.key === 'Enter') {
      setSubmittedSearchTerm(searchTerm);
      setPage(1);
      refetch(); // Fetch new data based on search term
    }
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
          {/* Refresh Button */}
          <Button variant="outline" onClick={() => refetch()} disabled={isLoading || isFetching}>
            {isLoading || isFetching ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <RefreshCwIcon className="h-4 w-4" />
            )}
          </Button>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              type="text"
              placeholder="Search"
              value={searchTerm}
              onChange={handleSearchChange}
              onKeyDown={handleKeyDown}
              className="pl-10 pr-4 py-2 w-64"
            />
            {searchTerm && (
              <XCircle
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 cursor-pointer"
                onClick={handleClearSearch}
              />
            )}
          </div>
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
          {organizations.length > 0 ? (
            organizations.map((org) => (
              <TableRow key={org.organizationId} className="cursor-pointer">
                <TableCell
                  className="font-medium"
                  onClick={() => {
                    selectOrganization(org);
                    navigate('/organization-dashboard');
                  }}
                >
                  {org.organization}
                </TableCell>
                <TableCell
                  onClick={() => {
                    selectOrganization(org);
                    navigate('/organization-dashboard');
                  }}
                >
                  <span className="px-2 py-1 bg-gray-100 rounded-full text-xs font-medium">
                    {org.launchpadStage?.toUpperCase()}
                  </span>
                </TableCell>
                <TableCell
                  onClick={() => {
                    selectOrganization(org);
                    navigate('/organization-dashboard');
                  }}
                >
                  {org.dueDate}
                </TableCell>
                <TableCell
                  onClick={() => {
                    selectOrganization(org);
                    navigate('/organization-dashboard');
                  }}
                >
                  <div className="flex flex-col items-start gap-1">
                    <span className="text-xs font-medium">{org.progress}%</span>
                    <Progress
                      value={org.progress}
                      className="w-[80px] h-[10px] bg-[#f7f7f7]"
                    />
                  </div>
                </TableCell>
                <TableCell
                  onClick={() => {
                    selectOrganization(org);
                    navigate('/organization-dashboard');
                  }}
                >
                  {org.organizationCreatedOn}
                </TableCell>
                <TableCell>
                  <div className="flex flex-row items-center gap-2">
                    <EditOrganizationDialog organization={org} />
                    {/* Additional actions can be added here */}
                  </div>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={6} className="text-center">
                No organizations found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      {data.pages > 0 && ( // Check if there are pages to display
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
              onClick={() => setPage((old) => (data.has_next ? Math.min(old + 1, data.pages) : old))}
              disabled={!data.has_next}
            >
              NEXT
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

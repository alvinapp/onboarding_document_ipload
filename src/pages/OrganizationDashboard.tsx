import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/common/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/common/Card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/common/Table';
import { ArrowLeft, ChevronLeft, LucideTrash2 } from 'lucide-react';
import Timeline from '../components/organizations/OrganizationOnboardingTimeline';
import logoSvg from '../assets/alvinlogo1.svg';
import { motion, steps } from 'framer-motion';
import UploadDocumentDialog from '../components/documents/UploadDocumentDialog';
import { useOrganizationStore } from '../store/useOrganizationStore';
import { useUserStore } from '../store/useUserStore';
import { useQuery } from 'react-query';
import axios from 'axios';
import ChangeOrganizationStageForm from '../components/organizations/UpdateOrganizationStepDialog';
import AlertDialogWrapper from '../components/common/AlertDialogWrapper';
import { useToast } from '../components/common/ToastProvider';

export default function OrganizationDashboard() {
  const { selectedOrganization, selectOrganization } = useOrganizationStore();
  const { users, setUsers } = useUserStore();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [currentPage, setCurrentPage] = useState(1);
  const documentsPerPage = 5;

  const baseUrl = 'http://localhost:5001';
  const fetchOrganizationDataUrl = `${baseUrl}/onboarding_steps/all/${selectedOrganization?.organizationId}/`;
  const fetchOganizationUsersurl = `${baseUrl}/users/organization/admin-users/${selectedOrganization?.organizationId}/`;

  // Fetch organization data on window refocus
  const { data: organizationData, refetch, isFetching } = useQuery(
    ['organizationData', selectedOrganization?.organizationId],
    async () => {
      const { data } = await axios.get(fetchOrganizationDataUrl);
      return data;
    },
    {
      enabled: !!selectedOrganization?.organizationId, // Enable query only if we have an organization ID
      initialData: selectedOrganization, // Use Zustand store data as initial data
      refetchOnWindowFocus: true, // Refetch when window is refocused
    }
  );


  const { data: organizationUsersData } = useQuery(
    ['organizationUsersData', selectedOrganization?.organizationId],
    async () => {
      const { data } = await axios.get(fetchOganizationUsersurl);
      return data;
    },
    {
      enabled: !!selectedOrganization?.organizationId,
    }
  );

  // Update Zustand store whenever new data is fetched
  useEffect(() => {
    if (organizationData && organizationData.organization_id) {
      const organization = {
        organizationId: organizationData.organization_id,
        organization: organizationData.organization_name,
        assignee: [],
        launchpadStage: organizationData.latest_step_name,
        launchpadStepNumber: organizationData.latest_step_number,
        progress: organizationData.latest_step_progress,
        dueDate: organizationData.due_date ? new Date(organizationData.due_date).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        }) : 'N/A',
        organizationCreatedOn: organizationData.steps[0].organization_created_on,
        steps: organizationData.steps,
        documents: organizationData.steps.flatMap((step: any) =>
          step.document_links.map((doc: any) => ({
            documentId: doc.id,
            documentName: doc.document_name,
            documentType: doc.document_type,
            documentUrl: doc.document_link,
            createdAt: new Date(doc.created_at).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            }),
          }))
        ),
      };

      selectOrganization(organization); // Update Zustand store
    }
  }, [organizationData, selectOrganization]);

  // Update users in Zustand store
  useEffect(() => {
    if (organizationUsersData) {
      setUsers(organizationUsersData?.users);
    }
  }, [organizationUsersData, setUsers]);

  // Pagination logic
  const totalDocuments = selectedOrganization?.documents?.length || 0;
  const totalPages = Math.ceil(totalDocuments / documentsPerPage);
  const paginatedDocuments = selectedOrganization?.documents
    ?.slice()
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()) // Sort by createdAt
    .slice((currentPage - 1) * documentsPerPage, currentPage * documentsPerPage);

  // Check if the organization is selected
  if (!selectedOrganization) {
    return (
      <div className="container w-[400px] flex flex-col mx-auto my-20 justify-center text-center">
        <Card>
          <CardHeader>
            <CardTitle>No Data</CardTitle>
          </CardHeader>
          <CardContent>
            No organization selected. Please go back and select an organization.
            <Button onClick={() => navigate(-1)} variant="outline" className="w-full mt-4">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Extract data from the selected organization
  const { organization, launchpadStage, progress, dueDate, launchpadStepNumber } = selectedOrganization;

  const currentStage = launchpadStepNumber || 1;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-center mb-8">
        <img src={logoSvg} alt="Alvin Logo" className="h-12" />
      </div>
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8 shadow">
        <div className="px-4 py-1 sm:px-0">
          {/* Back Button */}
          <div
            className="flex items-center shadow p-2 rounded-md bg-white w-8 cursor-pointer hover:bg-accent"
            onClick={() => navigate(-1)}
          >
            <ChevronLeft className="h-4 w-4" />
          </div>

          {/* Organization Name and Current Step */}
          <h2 className="text-2xl font-semibold text-gray-900">{organization}</h2>
          <div className="mt-1 text-sm text-gray-600 flex flex-row justify-between">
            <div>Current next step: {launchpadStage || 'N/A'}.</div>
            <div>Due by: {dueDate || 'N/A'}</div>
            <Button variant="link" className="ml-2 text-blue-600" onClick={() => {
              navigate('/organization-users/')
            }}>
              See all users of this organization
            </Button>
          </div>

          <div className="mt-8 flex flex-col md:flex-row gap-8">
            {/* Timeline */}
            <div className="w-full md:w-1/3">
              <Timeline currentStage={currentStage} steps={
                  selectedOrganization.steps?.map((step: any) => ({
                    step_name: step.step_name,
                    created_on: step.created_on
                  })) || []
              } onRefresh={refetch} isLoading={isFetching} organizationCreatedOn={selectedOrganization.organizationCreatedOn} />
            </div>

            <div className="w-full md:w-2/3 space-y-6">
              {/* Change Stage and Upload Document */}
              <div className="flex justify-between">
                {/* <Button variant="outline">Change stage</Button> */}
                <ChangeOrganizationStageForm currentStage={launchpadStage} users={
                  users && users.length > 0 ? users.map((user) => ({
                    name: user.first_name + ' ' + user.last_name,
                    email: user.email,
                  })): []
                } />
                {/* UploadDocumentDialog uses the organizationId from Zustand */}
                <UploadDocumentDialog organizationId={selectedOrganization.organizationId.toString()} />
              </div>

              {/* Documents Table */}
              <Card>
                <CardHeader>
                  <CardTitle>Documents</CardTitle>
                  {totalDocuments > 0 && <p className="text-sm text-gray-500">
                    {totalDocuments} document{totalDocuments > 1 ? 's' : ''}
                  </p>}
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead />
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {paginatedDocuments?.length ? (
                        paginatedDocuments.map((doc, index) => (
                          <motion.tr
                            key={index}
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: index * 0.1 }}
                            className="h-8" // Reduce the height of each row
                          >
                            <TableCell className='py-1'>
                              {/* Truncate long document names */}
                              <span className="block truncate w-64">
                                {doc.documentName}
                              </span>
                            </TableCell>
                            <TableCell className='py-1'>{doc.documentType}</TableCell>
                            <TableCell className='py-1'>{doc.createdAt}</TableCell>
                            <TableCell className='py-1'>
                              <AlertDialogWrapper
                                triggerButton={
                                  <Button variant="ghost" size="sm" className="hover:bg-red-200">
                                    <LucideTrash2 className="h-4 w-4" />
                                  </Button>
                                }
                                title='Delete Document'
                                description='Are you sure you want to delete this document?'
                                confirmButtonText='Yes, Delete'
                                onConfirm={() => {
                                  showToast({
                                    title: "Document deleted",
                                    description: "The document has been deleted successfully.",
                                    type: "success",
                                  })
                                }}
                              />
                            </TableCell>
                          </motion.tr>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={4} className="text-center">
                            No documents available.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                  {/* Pagination Controls */}
                  {totalPages > 0 && <div className="flex justify-between mt-4">
                    <p className="text-sm">
                      Page {currentPage} of {totalPages}
                    </p>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                      >
                        Previous
                      </Button>

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                      >
                        Next
                      </Button>
                    </div>
                  </div>}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
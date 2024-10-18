import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface Document {
    documentId: string;
    documentName: string;
    documentType: string;
    documentUrl: string;
    createdAt: string;
}

interface Steps {
    stepId: string;
    stepName: string;
    stepNumber: number;
    progress: number;
    dueDate: string;
    createdOn: string;
}

interface Organization {
    organizationId: string;
    organization: string;
    launchpadStage: string;
    launchpadStepId?: string;
    launchpadStepNumber: number;
    documents: Document[];
    steps?: Steps[];
    progress: number;
    dueDate: string;
    organizationCreatedOn: string;
}

interface OrganizationStore {
    organizations: Organization[];
    selectedOrganization: Organization | null;
    setOrganizations: (orgs: Organization[]) => void;
    selectOrganization: (org: Organization) => void;
    addOrganization: (org: Organization) => void;
    updateOrganization: (org: Organization) => void;
    deleteOrganization: (orgId: string) => void;
    addDocument: (orgId: string, document: Document) => void;
    editDocument: (orgId: string, documentId: string, updatedDocument: Partial<Document>) => void;
    deleteDocument: (orgId: string, documentId: string) => void;
}


const localStorageWrapper = {
    getItem: (name: string) => {
        const item = localStorage.getItem(name);
        return item ? JSON.parse(item) : null;
    },
    setItem: (name: string, value: any) => {
        localStorage.setItem(name, JSON.stringify(value));
    },
    removeItem: (name: string) => {
        localStorage.removeItem(name);
    },
};

export const useOrganizationStore = create<OrganizationStore>()(
    persist(
        (set, get) => ({
            organizations: [],
            selectedOrganization: null,

            // Set organizations
            setOrganizations: (orgs: Organization[]) => set({ organizations: orgs }),

            // Select an organization
            selectOrganization: (org: Organization) => set({ selectedOrganization: org }),

            // Add a new organization
            addOrganization: (org: Organization) => set((state) => ({
                organizations: [...state.organizations, org],
            })),

            // Update an organization
            updateOrganization: (updatedOrg: Organization) => set((state) => ({
                organizations: state.organizations.map((org) =>
                    org.organizationId === updatedOrg.organizationId ? updatedOrg : org
                ),
            })),

            // Delete an organization
            deleteOrganization: (orgId: string) => set((state) => ({
                organizations: state.organizations.filter((org) => org.organizationId !== orgId),
            })),

            // Add a document to an organization
            addDocument: (orgId: string, document: Document) => set((state) => ({
                organizations: state.organizations.map((org) =>
                    org.organizationId === orgId
                        ? { ...org, documents: [...org.documents, document] }
                        : org
                ),
            })),

            // Edit a document in an organization
            editDocument: (orgId: string, documentId: string, updatedDocument: Partial<Document>) => set((state) => ({
                organizations: state.organizations.map((org) =>
                    org.organizationId === orgId
                        ? {
                            ...org,
                            documents: org.documents.map((doc) =>
                                doc.documentId === documentId ? { ...doc, ...updatedDocument } : doc
                            ),
                        }
                        : org
                ),
            })),

            // Delete a document from an organization
            deleteDocument: (orgId: string, documentId: string) => set((state) => ({
                organizations: state.organizations.map((org) =>
                    org.organizationId === orgId
                        ? {
                            ...org,
                            documents: org.documents.filter((doc) => doc.documentId !== documentId),
                        }
                        : org
                ),
            })),
        }),
        {
            name: 'organization-store',
            storage: localStorageWrapper,
        }
    )
);
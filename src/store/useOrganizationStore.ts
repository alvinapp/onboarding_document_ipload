import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface Document {
    documentId: string;
    documentName: string;
    documentType: string;
    documentUrl: string;
    createdAt: string;
}

interface Organization {
    organizationId: string;
    organization: string;
    launchpadStage: string;
    launchpadStepNumber: number;
    documents: Document[];
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
        (set) => ({
            organizations: [],
            selectedOrganization: null,
            setOrganizations: (orgs: Organization[]) => set({ organizations: orgs }),
            selectOrganization: (org: Organization) => set({ selectedOrganization: org }),
            addOrganization: (org: any) => set((state) => ({ organizations: [...state.organizations, org] })),
            updateOrganization: (updatedOrg: Organization) => set((state) => ({
                organizations: state.organizations.map((org) =>
                    org.organizationId === updatedOrg.organizationId ? updatedOrg : org
                ),
            })),
            deleteOrganization: (orgId: string) => set((state) => ({
                organizations: state.organizations.filter((org) => org.organizationId !== orgId),
            })),
        }),
        {
            name: 'organization-store',
            storage: localStorageWrapper,
        }
    )
);
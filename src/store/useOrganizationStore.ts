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
  assignee: string[];
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
    }),
    {
      name: 'organization-store',
      storage: localStorageWrapper,
    }
  )
);
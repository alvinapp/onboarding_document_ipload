import React from 'react';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import DocUpload from "./pages/DocUpload";
import LoginDetails from "./pages/LoginDetails";
import ResetPassword from "./pages/ResetPassword";
import OrganizationTable from "./pages/OrganizationsTable";
import OrganizationDashboard from "./pages/OrganizationDashboard";
import OrganizationUsersTable from "./components/organization-users/OrganizationUsersTable";
import { ToastProvider } from './components/common/ToastProvider';
import { QueryClient, QueryClientProvider } from "react-query";
import ErrorBoundary from './components/common/ErrorBoundary';
import Microapplications from './pages/Microapplications';

const App: React.FC = () => {
  const queryClient = new QueryClient();

  return (
    <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <ToastProvider>
        <Router>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login-details" element={<LoginDetails />} />
            <Route path="/doc-upload" element={<DocUpload />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/organizations" element={<OrganizationTable />} />
            <Route path="/organization-dashboard" element={<OrganizationDashboard />} />
            <Route path="/organization-users" element={<OrganizationUsersTable />} />
            <Route path="/microapplications" element={<Microapplications />} />
          </Routes>
        </Router>
      </ToastProvider>
    </QueryClientProvider>
    </ErrorBoundary>
  );
};

export default App;
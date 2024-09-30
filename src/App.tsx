import React from 'react'
import { BrowserRouter as Router, Route, Routes } from "react-router-dom"
import HomePage from "./pages/HomePage"
import DocUpload from "./pages/DocUpload"
import LoginDetails from "./pages/LoginDetails"
import ResetPassword from "./pages/ResetPassword"
import OrganizationTable from "./pages/OrganizationsTable"
import { ToastProvider } from "./components/Toast"
import { QueryClient, QueryClientProvider } from "react-query"

const App: React.FC = () => {
  const queryClient = new QueryClient()
  return (
    <QueryClientProvider client={queryClient}>
    <ToastProvider>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login-details" element={<LoginDetails />} />
          <Route path="/doc-upload" element={<DocUpload />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/organizations" element={<OrganizationTable />} />
        </Routes>
      </Router>
    </ToastProvider>
    </QueryClientProvider>
  )
}

export default App
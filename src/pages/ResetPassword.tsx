import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useQuery, useMutation } from 'react-query';
import { Card, CardContent, CardHeader, CardTitle } from "../components/common/Card";
import { Button } from "../components/common/Button";
import { Input } from "../components/common/Input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/common/Select";
import { Loader2, Search, ArrowLeft, Check, X, LucideEye, LucideEyeOff } from "lucide-react";
import { useToast } from "../components/common/ToastProvider";
import logoSvg from '../assets/alvinlogo1.svg';
import { motion, AnimatePresence } from "framer-motion";

const baseUrl = 'http://localhost:5001';

interface Organization {
  value: string;
  label: string;
}

interface OrganizationUser {
  value: string;
  label: string;
}

interface RawOrganizationUser {
  user_id: string;
  email: string;
  first_name: string;
  last_name: string;
}

interface UserDetails {
  email: string;
  first_name: string;
  last_name: string;
}

// Fetch organizations
const fetchOrganizations = async (): Promise<Organization[]> => {
  const response = await axios.get(`${baseUrl}/organizations/all`);
  return response.data.map((org: any) => ({
    value: org.id,
    label: org.name,
  })).sort((a: Organization, b: Organization) => a.label.localeCompare(b.label));
};

// Fetch users based on selected organization
const fetchOrganizationUsers = async (selectedOrg: string): Promise<RawOrganizationUser[]> => {
  const response = await axios.get(`${baseUrl}/users/organization/admin/${selectedOrg}`);
  return response.data?.users || [];
};

const ResetPassword: React.FC = () => {
  const [selectedOrg, setSelectedOrg] = useState<string>('');
  const [selectedOrgUser, setSelectedOrgUser] = useState<string>('');
  const [originalUserDetails, setOriginalUserDetails] = useState<RawOrganizationUser | null>(null);
  const [userDetails, setUserDetails] = useState<UserDetails>({ email: '', first_name: '', last_name: '' });
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState<boolean>(false); // New state for password visibility
  const navigate = useNavigate();
  const { showToast } = useToast();

  // Fetch organizations using react-query
  const { data: organizations = [], isLoading: orgsLoading, isError: orgsError } = useQuery(
    ['organizations'],
    fetchOrganizations,
    {
      onError: () => {
        showToast({
          title: "Error",
          description: "Failed to fetch organizations. Please try again.",
          type: "error",
          duration: 5000,
        });
      },
    }
  );

  // use mutation to edit user pssword post user details baseUrl/users//edit_password/<email>/admin
  const { mutate: editUserPassword, isLoading: editUserPasswordLoading } = useMutation(
    (password: string) => axios.post(`${baseUrl}/users/edit_password/${userDetails.email}/admin`, { "password": password }),
    {
      onError: () => {
        showToast({
          title: "Error",
          description: "Failed to reset password. Please try again.",
          type: "error",
          duration: 5000,
        });
      },
      onSuccess: () => {
        setOriginalUserDetails(null);
        setUserDetails({ email: '', first_name: '', last_name: '' });
        setSelectedOrgUser('');
        setSelectedOrg('');
        showToast({
          title: "Success",
          description: "Password reset successfully.",
          type: "success",
          duration: 5000,
        });
      },
    }
  );

  // use mutation to edit user details post user details baseUrl/users/edit/<email>
  const { mutate: editUserDetails, isLoading: editUserDetailsLoading } = useMutation(
    (userDetails: UserDetails) => axios.post(`${baseUrl}/users/edit/${userDetails.email}`, userDetails),
    {
      onError: () => {
        showToast({
          title: "Error",
          description: "Failed to edit user details. Please try again.",
          type: "error",
          duration: 5000,
        });
      },
      onSuccess: () => {
        setOriginalUserDetails(null);
        setUserDetails({ email: '', first_name: '', last_name: '' });
        setSelectedOrgUser('');
        setSelectedOrg('');
        showToast({
          title: "Success",
          description: "User details updated successfully.",
          type: "success",
          duration: 5000,
        });
      },
    }
  );

  const onUpdateUserDetails = () => {
    editUserDetails(userDetails);
  }

  const onUpdatePassword = () => {
    // ensure password is valid
    if (password.length < 8 || !/[a-z]/.test(password) || !/[A-Z]/.test(password) || !/\d/.test(password) || !/[$@$!%*?&]/.test(password)) {
      showToast({
        title: "Error",
        description: "Password must be at least 8 characters and contain at least one lowercase letter, one uppercase letter, one number, and one special character.",
        type: "error",
        duration: 5000,
      });
      return;
    }
    if (password !== confirmPassword) {
      showToast({
        title: "Error",
        description: "Passwords do not match.",
        type: "error",
        duration: 5000,
      });
      return;
    }
    editUserPassword(password);
  }

  // Fetch organization users when an organization is selected
  const { data: rawOrganizationUsers = [], isLoading: usersLoading, isError: usersError } = useQuery(
    ['organizationUsers', selectedOrg],
    () => fetchOrganizationUsers(selectedOrg),
    {
      enabled: !!selectedOrg, // Only run this query when an organization is selected
      onError: () => {
        showToast({
          title: "Error",
          description: "Failed to fetch organization users. Please try again.",
          type: "error",
          duration: 5000,
        });
      },
    }
  );

  // Map organization users for the Select dropdown
  const organizationUsers: OrganizationUser[] = rawOrganizationUsers.map((user: RawOrganizationUser) => ({
    value: user.user_id,
    label: `${user.first_name} ${user.last_name}`,
  }));

  // Function to fetch and display user details
  const getUserDetails = () => {
    if (selectedOrgUser) {
      const userDetails = rawOrganizationUsers.find((user) => user.user_id === selectedOrgUser);
      if (userDetails) {
        setOriginalUserDetails(userDetails);
        setUserDetails({
          email: userDetails.email,
          first_name: userDetails.first_name,
          last_name: userDetails.last_name,
        });
      }
    }
  };

  const isFormChanged = () => {
    return (
      userDetails.email !== originalUserDetails?.email ||
      userDetails.first_name !== originalUserDetails?.first_name ||
      userDetails.last_name !== originalUserDetails?.last_name
    );
  };

  const PasswordValidation: React.FC<{ password: string }> = ({ password }) => {
    const validations = {
      length: password.length >= 8,
      lowercase: /[a-z]/.test(password),
      uppercase: /[A-Z]/.test(password),
      number: /\d/.test(password),
      specialChar: /[$@$!%*?&]/.test(password),
    };

    return (
      <ul className="list-none p-0 text-xs text-gray-600 mt-2">
        {Object.entries(validations).map(([key, isValid]) => (
          <li key={key} className={`flex items-center ${isValid ? 'text-green-600' : 'text-red-600'}`}>
            {isValid ? <Check className="w-4 h-4 mr-2" /> : <X className="w-4 h-4 mr-2" />}
            {key === 'length'
              ? 'Minimum 8 characters'
              : key === 'lowercase'
              ? 'At least one lowercase letter'
              : key === 'uppercase'
              ? 'At least one uppercase letter'
              : key === 'number'
              ? 'At least one number'
              : 'At least one special character ($@$!%*?&)'}
          </li>
        ))}
      </ul>
    );
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-center mb-8">
        <img src={logoSvg} alt="Alvin Logo" className="h-12" />
      </div>
      <div className="flex flex-col md:flex-row gap-8 justify-center">
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="w-full md:w-96">
              <CardHeader>
                <CardTitle>Select a User</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Select value={selectedOrg} onValueChange={setSelectedOrg}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select an organization" />
                  </SelectTrigger>
                  <SelectContent>
                    {orgsLoading ? (
                      <SelectItem value="loading" disabled>
                        Loading organizations...
                      </SelectItem>
                    ) : (
                      organizations.map((org) => (
                        <SelectItem key={org.value} value={org.value}>
                          {org.label}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>

                <Select
                  value={selectedOrgUser}
                  onValueChange={setSelectedOrgUser}
                  disabled={!selectedOrg || usersLoading}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a user" />
                  </SelectTrigger>
                  <SelectContent>
                    {usersLoading ? (
                      <SelectItem value="loading" disabled>
                        Loading users...
                      </SelectItem>
                    ) : organizationUsers.length > 0 ? (
                      organizationUsers.map((user) => (
                        <SelectItem key={user.value} value={user.value}>
                          {user.label}
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem value="no-users" disabled>
                        No users found
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>

                <Button onClick={getUserDetails} disabled={!selectedOrgUser} className="w-full">
                  {usersLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Search className="mr-2 h-4 w-4" />}
                  Get User Details
                </Button>
                <Button onClick={() => navigate('/')} variant="outline" className="w-full">
                  <ArrowLeft className="mr-2 h-4 w-4" /> Back
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          {originalUserDetails && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.5 }}
            >
              <Card className="w-full md:w-96">
                <CardHeader>
                  <CardTitle>Edit User Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Input
                    type="email"
                    value={userDetails.email}
                    onChange={(e) => setUserDetails({ ...userDetails, email: e.target.value })}
                    placeholder="Email"
                  />
                  <Input
                    type="text"
                    value={userDetails.first_name}
                    onChange={(e) => setUserDetails({ ...userDetails, first_name: e.target.value })}
                    placeholder="First Name"
                  />
                  <Input
                    type="text"
                    value={userDetails.last_name}
                    onChange={(e) => setUserDetails({ ...userDetails, last_name: e.target.value })}
                    placeholder="Last Name"
                  />
                  <Button
                    onClick={onUpdateUserDetails}
                    disabled={!isFormChanged() || !userDetails.email || !userDetails.first_name || !userDetails.last_name}
                    className="w-full"
                  >
                    Edit
                  </Button>
                  <Button onClick={() => setOriginalUserDetails(null)} variant="outline" className="w-full">
                    Cancel
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {originalUserDetails && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.5 }}
            >
              <Card className="w-full md:w-96">
                <CardHeader>
                  <CardTitle>Reset {userDetails.first_name}'s Password</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Input
                    type={showPassword ? "text" : "password"} // Toggle between text and password
                    placeholder="New Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <Button variant="ghost" onClick={() => setShowPassword(!showPassword)} className="absolute right-2 top-0">
                    {showPassword ? <LucideEyeOff className="w-4 h-4" /> : <LucideEye className="w-4 h-4" />}
                  </Button>
                  {password && <PasswordValidation password={password} />}
                  <Input
                    type={showPassword ? "text" : "password"} // Toggle between text and password
                    placeholder="Confirm Password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                  <Button variant="ghost" onClick={() => setShowPassword(!showPassword)} className="absolute right-2 top-0">
                    {showPassword ? <LucideEyeOff className="w-4 h-4" /> : <LucideEye className="w-4 h-4" />}
                  </Button>
                  <Button
                    onClick={onUpdatePassword}
                    disabled={!password || !confirmPassword}
                    className="w-full"
                  >
                    Reset Password
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ResetPassword;
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useQuery } from 'react-query';
import { Card, CardContent, CardHeader, CardTitle } from "../components/common/Card";
import { Button } from "../components/common/Button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/common/Select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/common/Table";
import { Loader2, Search, ArrowLeft } from "lucide-react";
import { useToast } from "../components/common/ToastProvider";
import logoSvg from '../assets/alvinlogo1.svg';
import { motion, AnimatePresence } from "framer-motion";

const baseUrl = process.env.REACT_APP_BASE_URL;

interface Organization {
  value: string;
  label: string;
}

interface UserActivity {
  users: User[];
}

interface User {
  full_name: string;
  email: string;
  first_login: string | null;
  last_login: string | null;
}

const fetchOrganizations = async (): Promise<Organization[]> => {
  const response = await axios.get(`${baseUrl}/organizations/all`);
  return response.data.map((org: any) => ({
    value: org.id,
    label: org.name,
  })).sort((a: Organization, b: Organization) => a.label.localeCompare(b.label));
};

const fetchUserActivity = async (selectedOrg: string): Promise<UserActivity> => {
  const response = await axios.get(`${baseUrl}/users/organization_users/logins/${selectedOrg}`);
  return response.data;
};

const UserActivityTable: React.FC = () => {
  const [selectedOrg, setSelectedOrg] = useState<string>('');
  const navigate = useNavigate();
  const { showToast } = useToast();

  // Fetch organizations using useQuery
  const { data: organizations, isLoading: orgsLoading, isError: orgsError } = useQuery(['organizations'], fetchOrganizations, {
    onError: () => {
      showToast({
        title: "Error",
        description: "Failed to fetch organizations. Please try again.",
        type: "error",
      });
    },
  });

  // Fetch user activity when an organization is selected
  const { data: userActivity, isLoading: activityLoading, isError: activityError } = useQuery(
    ['userActivity', selectedOrg],
    () => fetchUserActivity(selectedOrg),
    {
      enabled: !!selectedOrg, // Only run the query if an organization is selected
      onError: () => {
        showToast({
          title: "Error",
          description: "Failed to fetch user activity. Please try again.",
          type: "error",
        });
      },
    }
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-center mb-8">
        <img src={logoSvg} alt="Alvin Logo" className="h-12" />
      </div>
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="max-w-md mx-auto mb-8">
            <CardHeader>
              <CardTitle className="text-2xl font-semibold text-center">Users Login Activity</CardTitle>
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
                    organizations?.map((org: any) => (
                      <SelectItem key={org.value} value={org.value}>
                        {org.label}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>

              <Button
                onClick={() => {}}
                disabled={!selectedOrg || activityLoading}
                className="w-full"
              >
                {activityLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Search className="mr-2 h-4 w-4" />}
                {activityLoading ? `Getting Activity` : `Get User Activity`}
              </Button>
              <Button onClick={() => navigate('/')} variant="outline" className="w-full">
                <ArrowLeft className="mr-2 h-4 w-4" /> Back
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </AnimatePresence>

      <AnimatePresence>
        {selectedOrg && userActivity && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
          >
            {userActivity.users.length > 0 ? (
              <Card>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[50px]">#</TableHead>
                        <TableHead>Full Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>First Login</TableHead>
                        <TableHead>Last Login</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {userActivity.users
                        .sort((a: any, b: any) => a.full_name.localeCompare(b.full_name))
                        .map((user: any, index: any) => (
                          <TableRow key={index}>
                            <TableCell>{index + 1}</TableCell>
                            <TableCell>{user.full_name}</TableCell>
                            <TableCell>{user.email}</TableCell>
                            <TableCell>
                              {user.first_login
                                ? new Date(user.first_login).toLocaleDateString('en-US', {
                                    weekday: 'long',
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit',
                                  })
                                : "User hasn't logged in yet"}
                            </TableCell>
                            <TableCell>
                              {user.last_login
                                ? new Date(user.last_login).toLocaleDateString('en-US', {
                                    weekday: 'long',
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit',
                                  })
                                : "User hasn't logged in yet"}
                            </TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="flex flex-col text-center py-8">
                  <div className="text-lg text-gray-600">No user activity found for this organization.</div>
                </CardContent>
              </Card>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default UserActivityTable;
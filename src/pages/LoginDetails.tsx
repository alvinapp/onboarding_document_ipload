import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { Card, CardContent, CardHeader, CardTitle } from "../components/Card"
import { Button } from "../components/Button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/Select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/Table"
import { Loader2, Search, ArrowLeft } from "lucide-react"
import { useToast } from "../hooks/use-toast"
import logoSvg from '../assets/alvinlogo1.svg';
import { motion, AnimatePresence } from "framer-motion"

const baseUrl = 'http://localhost:5001'

interface Organization {
  value: string
  label: string
}

interface UserActivity {
  users: User[]
}

interface User {
  full_name: string
  email: string
  first_login: string | null
  last_login: string | null
}

const UserActivityTable: React.FC = () => {
  const [organizations, setOrganizations] = useState<Organization[]>([])
  const [selectedOrg, setSelectedOrg] = useState<string>('')
  const [isLoading, setIsLoading] = useState(false)
  const [userActivity, setUserActivity] = useState<UserActivity | null>(null)
  const navigate = useNavigate()
  const { addToast } = useToast()

  useEffect(() => {
    axios.get(`${baseUrl}/organizations/all`)
      .then(response => {
        setOrganizations(response.data.map((org: any) => ({
          value: org.id,
          label: org.name
        })).sort((a: Organization, b: Organization) => a.label.localeCompare(b.label)))
      })
      .catch(error => {
        console.error('Error fetching organizations:', error)
        addToast({
          title: "Error",
          description: "Failed to fetch organizations. Please try again.",
        })
      })
  }, [])

  const handleFetchUserActivity = () => {
    if (selectedOrg) {
      setIsLoading(true)
      axios.get(`${baseUrl}/users/organization_users/logins/${selectedOrg}`)
        .then(response => {
          setUserActivity(response.data)
          setIsLoading(false)
        })
        .catch(error => {
          console.error('Error fetching user activity:', error)
          addToast({
            title: "Error",
            description: "Failed to fetch user activity. Please try again.",
          })
          setIsLoading(false)
        })
    }
  }

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
                  {organizations.map((org) => (
                    <SelectItem key={org.value} value={org.value}>
                      {org.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Button
                onClick={handleFetchUserActivity}
                disabled={!selectedOrg || isLoading}
                className="w-full"
              >
                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Search className="mr-2 h-4 w-4" />}
                Get User Activity
              </Button>
              <Button
                onClick={() => navigate('/')}
                variant="outline"
                className="w-full"
              >
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
                        .sort((a, b) => a.full_name.localeCompare(b.full_name))
                        .map((user, index) => (
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
                                  minute: '2-digit'
                                })
                                : 'User hasn\'t logged in yet'}
                            </TableCell>
                            <TableCell>
                              {user.last_login
                                ? new Date(user.last_login).toLocaleDateString('en-US', {
                                  weekday: 'long',
                                  year: 'numeric',
                                  month: 'long',
                                  day: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })
                                : 'User hasn\'t logged in yet'}
                            </TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="text-center py-8">
                  <p className="text-lg text-gray-600">No user activity found for this organization.</p>
                </CardContent>
              </Card>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default UserActivityTable
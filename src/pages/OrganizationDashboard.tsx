import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from "../components/Button"
import { Card, CardContent, CardHeader, CardTitle } from "../components/Card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/Table"
import { ChevronLeft, Upload, MoreVertical, LucideTrash2 } from 'lucide-react'
import Timeline from '../components/OrganizationOnboardingTimeline'
import logoSvg from '../assets/alvinlogo1.svg'
import { motion } from 'framer-motion'

const documents = [
  { name: "Alvin x United Capital - Sales Deck 3", type: "Sales presentation", date: "13 September 2024" },
  { name: "Alvin x United Capital - Sales Deck 2", type: "Sales presentation", date: "12 September 2024" },
  { name: "Alvin x United Capital - Sales Deck 1", type: "Sales presentation", date: "2 September 2024" },
]

export default function OrganizationDashboard() {
  const navigate = useNavigate()
  const currentStage = 3 // This would be dynamically set based on the current stage

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-center mb-8">
        <img src={logoSvg} alt="Alvin Logo" className="h-12" />
      </div>
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8 shadow">
        <div className="px-4 py-1 sm:px-0">
          <div className='flex items-center shadow p-2 rounded-md bg-white w-8 cursor-pointer hover:bg-accent' onClick={
            () => navigate(-1)
          }>
              <ChevronLeft className="h-4 w-4" />
          </div>
          <h2 className="text-2xl font-semibold text-gray-900">United Capital</h2>
          <div className="mt-1 text-sm text-gray-600 flex flex-row justify-between">
            <div>Current next step: Pricing Model & Partnership Agreement.</div>
            <div> Due by: Oct 8, 2024</div>
            <Button variant="link" className="ml-2 text-blue-600">
              See all users of this organization
            </Button>
          </div>

          <div className="mt-8 flex flex-col md:flex-row gap-8">
            <div className="w-full md:w-1/3">
              <Timeline currentStage={currentStage} />
            </div>

            <div className="w-full md:w-2/3 space-y-6">
              <div className="flex justify-between">
                <Button variant="outline">Change stage</Button>
                <Button>
                  <Upload className="h-4 w-4 mr-2" />
                  Upload new document
                </Button>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Documents</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {documents.map((doc, index) => (
                        <motion.tr
                          key={index}
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: index * 0.1 }}
                        >
                          <TableCell>{doc.name}</TableCell>
                          <TableCell>{doc.type}</TableCell>
                          <TableCell>{doc.date}</TableCell>
                          <TableCell>
                            <Button variant="ghost" size="sm" className='hover:bg-red-200'>
                              <LucideTrash2 className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </motion.tr>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
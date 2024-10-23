import React, { useEffect } from 'react'
import { useNavigate } from "react-router-dom"
import { Card, CardContent, CardHeader, CardTitle } from "../components/common/Card"
import { Button } from "../components/common/Button"
import { LogIn, FileUp, UserCog, Building2, ChartSpline } from "lucide-react"

import logoSvg from '../assets/alvinlogo1.svg';

const HomePage: React.FC = () => {
  const navigate = useNavigate()

  const actions = [
    { title: 'Login Activity', path: '/login-details', icon: <LogIn className="mr-2 h-4 w-4" /> },
    { title: 'Doc Upload', path: '/doc-upload', icon: <FileUp className="mr-2 h-4 w-4" /> },
    { title: 'Edit User', path: '/reset-password', icon: <UserCog className="mr-2 h-4 w-4" /> },
    { title: 'Organizations', path: '/organizations', icon: <Building2 className="mr-2 h-4 w-4" /> },
    { title: 'Microapplications(P)', path: '/microapplications', icon: <ChartSpline className="mr-2 h-4 w-4" /> },
  ]

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background p-4">
      <div className="mb-8">
        <img src={logoSvg} alt="Alvin Logo" className="h-12 w-auto" />
      </div>
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold text-center">Select an Action</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            {actions.map((action, index) => (
              <Button
                key={index}
                variant="outline"
                className="w-full"
                onClick={() => navigate(action.path)}
              >
                {action.icon}
                {action.title}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default HomePage
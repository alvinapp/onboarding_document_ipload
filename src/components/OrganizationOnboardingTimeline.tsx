import React from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from "../components/Card"
import { Button } from "../components/Button"
import { RefreshCw, UserPlus, PhoneCall, FileText, FileSignature, Cog, CheckSquare, Rocket } from 'lucide-react'

const stages = [
  { name: "Organizational account created", icon: UserPlus, date: "Sep 1, 2024", time: "09:00" },
  { name: "Customer Needs Analysis Call", icon: PhoneCall, date: "Sep 3, 2024", time: "14:00" },
  { name: "Scoping & Product Phasing Plan", icon: FileText, date: "Sep 5, 2024", time: "11:00" },
  { name: "Pricing Model & Partnership Agreement", icon: FileSignature, date: "Sep 8, 2024", time: "10:00" },
  { name: "SLA signing", icon: FileSignature, date: "Sep 10, 2024", time: "15:00" },
  { name: "Integration and deployment", icon: Cog, date: "Sep 15, 2024", time: "09:00" },
  { name: "UAT", icon: CheckSquare, date: "Sep 20, 2024", time: "13:00" },
  { name: "Deployed", icon: Rocket, date: "Sep 25, 2024", time: "11:00" },
]

const Timeline: React.FC<{ currentStage: number }> = ({ currentStage }) => {
  return (
    <Card className="w-full">
      <div className="flex flex-row items-start justify-between space-y-0 p-4">
        <CardTitle className="text-m font-medium">Stage</CardTitle>
        <Button variant="outline" size="sm">
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>
      <CardContent>
        <div className="space-y-2">
          {stages.map((stage, index) => (
            <div key={index} className="flex items-center">
              <div className="flex flex-col items-center mr-4">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className={`rounded-full p-2 ${
                    index <= currentStage ? 'bg-[#101010] text-white' : 'bg-gray-200 text-gray-500'
                  }`}
                >
                  <stage.icon className="h-4 w-4" />
                </motion.div>
                {index < stages.length - 1 && (
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: '100%' }}
                    transition={{ delay: index * 0.1, duration: 0.5 }}
                    className={`w-0.5 h-full mt-2 ${
                      index < currentStage ? 'bg-[#101010]' : 'bg-gray-200'
                    }`}
                  />
                )}
              </div>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex-1"
              >
                <p className={`font-medium ${
                  index <= currentStage ? 'text-[#101010]' : 'text-gray-500'
                }`}>
                  {stage.name}
                </p>
                <p className="text-sm text-gray-500">{stage.date} - {stage.time}</p>
              </motion.div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

export default Timeline
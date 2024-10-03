import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '../common/Card';
import { Button } from '../common/Button';
import { RefreshCw, UserPlus, PhoneCall, FileText, FileSignature, Cog, CheckSquare, Rocket } from 'lucide-react';

// Utility function to format the date and time from the steps data
const formatDateTime = (dateString: string | null) => {
  if (!dateString) return { date: 'pending', time: '' };

  const date = new Date(dateString);
  const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' };
  const formattedDate = date.toLocaleDateString('en-US', options);
  const formattedTime = date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

  return { date: formattedDate, time: formattedTime };
};

interface TimelineProps {
  currentStage: number;
  onRefresh: () => void;
  isLoading: boolean;
  organizationCreatedOn: string; // Date when the organization was created
  steps: Array<{
    step_name: string;
    created_on: string;
  }>;
}

const Timeline: React.FC<TimelineProps> = ({ currentStage, onRefresh, isLoading, organizationCreatedOn, steps }) => {
  const stages = [
    { name: 'Organizational account created', icon: UserPlus },
    { name: 'Customer Needs Analysis Call', icon: PhoneCall },
    { name: 'Scoping & Product Phasing Plan', icon: FileText },
    { name: 'Pricing Model & Partnership Agreement', icon: FileSignature },
    { name: 'SLA signing', icon: FileSignature },
    { name: 'Integration and deployment', icon: Cog },
    { name: 'UAT', icon: CheckSquare },
    { name: 'Deployed', icon: Rocket },
  ];

  // Populate the dates based on the steps array and organizationCreatedOn
  const stagesWithDates = stages.map((stage, index) => {
    if (index === 0) {
      // First stage uses organizationCreatedOn
      const { date, time } = formatDateTime(organizationCreatedOn);
      return {
        ...stage,
        date,
        time,
      };
    } else if (index - 1 < steps.length) {
      // For subsequent stages, use the steps array
      const { date, time } = formatDateTime(steps[index - 1].created_on);
      return {
        ...stage,
        date,
        time,
      };
    } else {
      return {
        ...stage,
        date: 'pending',
        time: '',
      };
    }
  });

  return (
    <Card className="w-full">
      <div className="flex flex-row items-start justify-between space-y-0 p-4">
        <CardTitle className="text-m font-medium">Stage</CardTitle>
        <Button variant="outline" size="sm" onClick={onRefresh} disabled={isLoading} className="gap-1">
          <motion.div
            animate={{
              rotate: isLoading ? 360 : 0,
            }}
            transition={{
              repeat: isLoading ? Infinity : 0,
              duration: 1,
              ease: 'linear',
            }}
            style={{ display: 'inline-block', transformOrigin: 'center' }}
          >
            <RefreshCw className="h-4 w-4" />
          </motion.div>
          Refresh
        </Button>
      </div>
      <CardContent>
        <div className="space-y-2">
          {stagesWithDates.map((stage, index) => (
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
                {index < stagesWithDates.length - 1 && (
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
                <p
                  className={`font-medium ${
                    index <= currentStage ? 'text-[#101010]' : 'text-gray-500'
                  }`}
                >
                  {stage.name}
                </p>
                <p className="text-sm text-gray-500">
                  {stage.date} {stage.time && `- ${stage.time}`}
                </p>
              </motion.div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default Timeline;
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from "../common/Button"
import { Input } from "../common/Input"
import { Check, User, UploadIcon } from 'lucide-react'
import { useToast } from '../common/ToastProvider'
import DialogWrapper from '../common/DialogWrapper'

interface User {
  name: string
  email: string
}

interface ChangeOrganizationStageFormProps {
  currentStage: string
  users: User[]
}

export default function ChangeOrganizationStageForm({
  currentStage,
  users,
}: ChangeOrganizationStageFormProps) {
  const [selectedUsers, setSelectedUsers] = useState<string[]>([])

  const { showToast } = useToast()

  useEffect(() => {
    setSelectedUsers(users.map(user => user.email)) // Pre-select all users by default
  }, [users])

  const toggleUser = (email: string) => {
    setSelectedUsers(prev =>
      prev.includes(email)
        ? prev.filter(e => e !== email)
        : [...prev, email]
    )
  }

  const handlePublish = (onClose: () => void) => {
    // Handle publish logic here
    console.log('Publishing stage change for users:', selectedUsers)
    showToast({
      title: "Stage change published",
      description: "The organization stage has been updated successfully.",
      type: "success",
    })
    onClose() // Close the dialog after publishing
  }

  return (
    <DialogWrapper
      triggerButton={
        <Button variant="outline">Change stage</Button>
      }
      title="Change organization stage"
      description="This action will update organization stage and send an email to the selected users to notify them of the stage change."
    >
      {(onClose) => (
        <div>
          <div className="space-y-4">
            <Input
              value={currentStage}
              disabled
              className="bg-gray-100"
            />

            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">The email will be sent to the following users: </span>
              <Button
                variant="ghost"
                onClick={() => setSelectedUsers(users.map(user => user.email))}
              >
                Select all
              </Button>
            </div>

            <div className="flex flex-wrap gap-2">
              <AnimatePresence>
                {users.map((user) => (
                  <motion.div
                    key={user.email}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Button
                      variant={selectedUsers.includes(user.email) ? "default" : "outline"}
                      size="sm"
                      onClick={() => toggleUser(user.email)}
                      className="flex items-center space-x-1"
                    >
                      <User className="h-3 w-3" />
                      <span>{user.name}</span>
                      {selectedUsers.includes(user.email) && (
                        <Check className="h-3 w-3 ml-1" />
                      )}
                    </Button>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>

          {/* Publish Button */}
          <Button onClick={() => handlePublish(onClose)} className="w-full mt-4" disabled={selectedUsers.length === 0}>
            <UploadIcon className="h-4 w-4 mr-2" />
            Publish
          </Button>
        </div>
      )}
    </DialogWrapper>
  )
}
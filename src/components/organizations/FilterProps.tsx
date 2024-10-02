import React, { useState } from 'react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../common/Select"
import { Button } from "../common/Button"

const stages = [
  "Request a customer needs analysis call",
  "Scoping & Product Phasing Plan",
  "Pricing Model & Partnership Agreement",
  "SLA signing",
  "Integration and deployment",
  "UAT",
  "Deployed"
]

interface FilterDropdownProps {
  onFilter: (filters: { startDate: string; endDate: string; stage: string }) => void
}

export const FilterDropdown: React.FC<FilterDropdownProps> = ({ onFilter }) => {
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [stage, setStage] = useState('')

  const handleFilter = () => {
    onFilter({ startDate, endDate, stage })
  }

  return (
      <div className="p-4 space-y-4">
        <div>
          <Select value={stage} onValueChange={setStage}>
            <SelectTrigger id="stage-select">
              <SelectValue placeholder="Select a stage" />
            </SelectTrigger>
            <SelectContent>
              {stages.map((s) => (
                <SelectItem key={s} value={s}>
                  {s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Button onClick={handleFilter} className="w-full">
          Apply Filters
        </Button>
      </div>
  )
}
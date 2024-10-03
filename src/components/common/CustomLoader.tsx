import React from 'react'
import { motion } from 'framer-motion'

interface CustomLoaderProps {
  isLoading: boolean
}

const CustomLoader: React.FC<CustomLoaderProps> = ({ isLoading }) => {
  if (!isLoading) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
      <div className="bg-white rounded-lg p-8 shadow-xl">
        <div className="flex flex-col items-center">
          <motion.div
            className="w-16 h-16 border-4 border-blue-500 rounded-full"
            animate={{
              rotate: 360,
              borderTopColor: ['#3b82f6', '#10b981', '#6366f1', '#3b82f6'],
              borderRightColor: ['#93c5fd', '#34d399', '#a5b4fc', '#93c5fd'],
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'linear',
            }}
          />
          <motion.div
            className="mt-4 text-lg font-semibold text-gray-700"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            Loading...
          </motion.div>
          <motion.div
            className="mt-2 text-sm text-gray-500"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            Please wait while we fetch your data
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default CustomLoader
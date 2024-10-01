import React, { createContext, useContext, useState } from 'react';
import * as ToastPrimitive from '@radix-ui/react-toast';
import { CheckIcon, Cross1Icon, ExclamationTriangleIcon, InfoCircledIcon } from '@radix-ui/react-icons';
import { motion } from 'framer-motion';
import clsx from 'clsx';

// Define toast types
interface ToastProps {
  type: 'success' | 'error' | 'info' | 'warning';
  title: string;
  description?: string;
  duration?: number;
}

// Create ToastContext
const ToastContext = createContext<{
  showToast: (toast: ToastProps) => void;
} | null>(null);

// Icons for different toast types
const icons = {
  success: <CheckIcon className="text-green-500" />,
  error: <Cross1Icon className="text-red-500" />,
  info: <InfoCircledIcon className="text-blue-500" />,
  warning: <ExclamationTriangleIcon className="text-yellow-500" />,
};

// Tailwind classes for different toast types
const toastClasses = {
  success: 'border-green-500',
  error: 'border-red-500',
  info: 'border-blue-500',
  warning: 'border-yellow-500',
};

// Framer Motion animations for the toast
const toastVariants = {
  hidden: { opacity: 0, y: 50, scale: 0.95 },
  visible: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, y: 50, scale: 0.95 },
};

// ToastProvider component
export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [open, setOpen] = useState(false);
  const [toast, setToast] = useState<ToastProps | null>(null);

  const showToast = (toast: ToastProps) => {
    setToast(toast);
    setOpen(true);
    setTimeout(() => setOpen(false), toast.duration || 5000);
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {toast && (
        <ToastPrimitive.Provider swipeDirection="right">
          <ToastPrimitive.Root
            open={open}
            onOpenChange={setOpen}
            duration={toast.duration || 5000}
            asChild
          >
            <motion.div
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={toastVariants}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              className={clsx(
                'bg-gray-900 text-white border-l-4 p-4 rounded-md shadow-md flex items-start',
                toastClasses[toast.type]
              )}
            >
              <div className="mr-3">{icons[toast.type]}</div>
              <div className="flex-1">
                <ToastPrimitive.Title className="font-semibold text-lg">{toast.title}</ToastPrimitive.Title>
                {toast.description && (
                  <ToastPrimitive.Description className="text-sm mt-1 text-gray-300">
                    {toast.description}
                  </ToastPrimitive.Description>
                )}
              </div>
              <ToastPrimitive.Action asChild altText="Close">
                <button className="ml-4 text-white hover:text-gray-400">
                  <Cross1Icon />
                </button>
              </ToastPrimitive.Action>
            </motion.div>
          </ToastPrimitive.Root>
          <ToastPrimitive.Viewport className="fixed bottom-4 right-4 w-96 max-w-full z-50" />
        </ToastPrimitive.Provider>
      )}
    </ToastContext.Provider>
  );
};

// Custom hook to use the toast
export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
"use client"

import React, { forwardRef, useImperativeHandle, useState } from "react";
import { 
  Drawer, DrawerClose, DrawerContent, DrawerDescription, 
  DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger 
} from "../common/Drawer";
import { Button } from "../common/Button";

interface CustomDrawerProps {
  triggerButton: React.ReactNode;
  title: string;
  description?: string;
  footerDescription?: string;
  onSubmit?: () => void;
  children: React.ReactNode;
}

export interface CustomDrawerRef {
  open: () => void;
  close: () => void;
}

export const CustomDrawer = forwardRef<CustomDrawerRef, CustomDrawerProps>(
  ({ triggerButton, title, description, footerDescription, onSubmit, children }, ref) => {
    const [isOpen, setIsOpen] = useState(false);

    const handleSubmit = () => {
      if (onSubmit) onSubmit();
    };

    // Expose open/close methods via the ref
    useImperativeHandle(ref, () => ({
      open: () => setIsOpen(true),
      close: () => setIsOpen(false),
    }));

    return (
      <Drawer open={isOpen} onOpenChange={setIsOpen}>
        <DrawerTrigger asChild>{triggerButton}</DrawerTrigger>
        <DrawerContent side="bottom">
          <div className="mx-auto w-full">
            <DrawerHeader>
              <DrawerTitle>{title}</DrawerTitle>
              {description && <DrawerDescription>{description}</DrawerDescription>}
            </DrawerHeader>

            <div className="p-4 pb-0">
              <div>{children}</div>
            </div>

            <DrawerFooter>
              {footerDescription && (
                <DrawerDescription>{footerDescription}</DrawerDescription>
              )}
              <DrawerClose asChild>
                <Button onClick={handleSubmit}>Close</Button>
              </DrawerClose>
            </DrawerFooter>
          </div>
        </DrawerContent>
      </Drawer>
    );
  }
);

CustomDrawer.displayName = "CustomDrawer";

'use client';

import * as React from 'react';
import * as SheetPrimitive from '@radix-ui/react-dialog';
import { XIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

export const Sheet = SheetPrimitive.Root;
export const SheetPortal = SheetPrimitive.Portal;
export const SheetClose = SheetPrimitive.Close;
export const SheetTitle = SheetPrimitive.Title;

export const SheetOverlay = React.forwardRef<
  React.ElementRef<typeof SheetPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof SheetPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <SheetPrimitive.Overlay ref={ref} className={cn('fixed inset-0', className)} {...props} />
));
SheetOverlay.displayName = SheetPrimitive.Overlay.displayName;

export interface SheetContentProps
  extends React.ComponentPropsWithoutRef<typeof SheetPrimitive.Content> {
  showClose?: boolean;
  showOverlay?: boolean;
  overlayClassName?: string;
}

export const SheetContent = React.forwardRef<
  React.ElementRef<typeof SheetPrimitive.Content>,
  SheetContentProps
>(({ forceMount, showClose = true, showOverlay = true, overlayClassName, className, children, ...props }, ref) => (
  <SheetPortal forceMount={forceMount}>
    {showOverlay && <SheetOverlay forceMount={forceMount} className={overlayClassName} />}
    <SheetPrimitive.Content ref={ref} className={className} forceMount={forceMount} {...props}>
      {children}
      {showClose &&
        <SheetPrimitive.Close className="absolute right-md top-md focus:outline-none">
          <XIcon className="text-2xl" />
        </SheetPrimitive.Close>
      }
    </SheetPrimitive.Content>
  </SheetPortal>
));
SheetContent.displayName = SheetPrimitive.Content.displayName;

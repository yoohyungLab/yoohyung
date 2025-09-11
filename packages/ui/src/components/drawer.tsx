'use client';

import * as React from 'react';
import { Drawer as DrawerPrimitive } from 'vaul';
import { cn } from '@repo/shared';

const Drawer = ({
    shouldScaleBackground = true,
    direction = 'right',
    ...props
}: React.ComponentProps<typeof DrawerPrimitive.Root> & {
    shouldScaleBackground?: boolean;
    direction?: 'top' | 'right' | 'bottom' | 'left';
}) => <DrawerPrimitive.Root shouldScaleBackground={shouldScaleBackground} direction={direction} {...props} />;
Drawer.displayName = 'Drawer';

const DrawerTrigger = DrawerPrimitive.Trigger as React.ComponentType<React.ComponentProps<typeof DrawerPrimitive.Trigger>>;

const DrawerPortal = DrawerPrimitive.Portal as React.ComponentType<{ children: React.ReactNode }>;

const DrawerClose = DrawerPrimitive.Close as React.ComponentType<React.ComponentProps<typeof DrawerPrimitive.Close>>;

const DrawerOverlay = React.forwardRef<
    React.ElementRef<typeof DrawerPrimitive.Overlay>,
    React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Overlay>
>(({ className, ...props }, ref) => (
    <DrawerPrimitive.Overlay ref={ref} className={cn('fixed inset-0 z-50 bg-black/80', className)} {...props} />
)) as React.ForwardRefExoticComponent<
    React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Overlay> & React.RefAttributes<React.ElementRef<typeof DrawerPrimitive.Overlay>>
>;
DrawerOverlay.displayName = DrawerPrimitive.Overlay.displayName;

const DrawerContent = React.forwardRef<
    React.ElementRef<typeof DrawerPrimitive.Content>,
    React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Content>
>(({ className, children, ...props }, ref) => (
    <DrawerPortal>
        <DrawerOverlay />
        <DrawerPrimitive.Content
            ref={ref}
            className={cn(
                'fixed right-0 top-0 z-50 h-full w-[85vw] max-w-[400px] border-l shadow-xl',
                'transform transition-transform duration-300 ease-in-out',
                'data-[state=open]:translate-x-0 data-[state=closed]:translate-x-full !bg-white',
                className
            )}
            {...props}
        >
            {children}
        </DrawerPrimitive.Content>
    </DrawerPortal>
)) as React.ForwardRefExoticComponent<
    React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Content> & React.RefAttributes<React.ElementRef<typeof DrawerPrimitive.Content>>
>;
DrawerContent.displayName = 'DrawerContent';
const DrawerHeader = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
    <div className={cn('flex flex-col space-y-1.5 p-6 border-b', className)} {...props} />
);
DrawerHeader.displayName = 'DrawerHeader';

const DrawerFooter = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
    <div className={cn('flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 p-6 border-t', className)} {...props} />
);
DrawerFooter.displayName = 'DrawerFooter';

const DrawerTitle = React.forwardRef<
    React.ElementRef<typeof DrawerPrimitive.Title>,
    React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Title>
>(({ className, ...props }, ref) => (
    <DrawerPrimitive.Title ref={ref} className={cn('text-lg font-semibold leading-none tracking-tight', className)} {...props} />
)) as React.ForwardRefExoticComponent<
    React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Title> & React.RefAttributes<React.ElementRef<typeof DrawerPrimitive.Title>>
>;
DrawerTitle.displayName = DrawerPrimitive.Title.displayName;

const DrawerDescription = React.forwardRef<
    React.ElementRef<typeof DrawerPrimitive.Description>,
    React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Description>
>(({ className, ...props }, ref) => (
    <DrawerPrimitive.Description ref={ref} className={cn('text-sm text-muted-foreground', className)} {...props} />
)) as React.ForwardRefExoticComponent<
    React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Description> &
        React.RefAttributes<React.ElementRef<typeof DrawerPrimitive.Description>>
>;
DrawerDescription.displayName = DrawerPrimitive.Description.displayName;

export {
    Drawer,
    DrawerPortal,
    DrawerOverlay,
    DrawerTrigger,
    DrawerClose,
    DrawerContent,
    DrawerHeader,
    DrawerFooter,
    DrawerTitle,
    DrawerDescription,
};

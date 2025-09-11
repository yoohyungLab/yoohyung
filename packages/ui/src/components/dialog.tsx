'use client';

import * as React from 'react';
import { cn } from '../lib/utils';

const DialogContext = React.createContext<{
    open: boolean;
    onOpenChange: (open: boolean) => void;
}>({
    open: false,
    onOpenChange: () => {},
});

const Dialog = ({
    open,
    onOpenChange,
    children,
    ...props
}: {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    children: React.ReactNode;
}) => {
    return (
        <DialogContext.Provider value={{ open, onOpenChange }}>
            <div {...props}>{children}</div>
        </DialogContext.Provider>
    );
};

const DialogTrigger = React.forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement> & { asChild?: boolean }>(
    ({ asChild, children, ...props }, ref) => {
        const { onOpenChange } = React.useContext(DialogContext);

        if (asChild && React.isValidElement(children)) {
            return React.cloneElement(children as React.ReactElement<any>, {
                ...props,
                ref,
                onClick: (e: React.MouseEvent) => {
                    onOpenChange(true);
                    (children as any).props.onClick?.(e);
                },
            });
        }

        return (
            <button ref={ref} onClick={() => onOpenChange(true)} {...props}>
                {children}
            </button>
        );
    }
);

const DialogContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({ className, children, ...props }, ref) => {
    const { open, onOpenChange } = React.useContext(DialogContext);

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4" onClick={() => onOpenChange(false)}>
            <div
                ref={ref}
                className={cn('relative bg-white rounded-lg shadow-lg max-w-lg w-full max-h-[90vh] overflow-auto', className)}
                onClick={(e) => e.stopPropagation()}
                {...props}
            >
                {children}
            </div>
        </div>
    );
});

const DialogHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({ className, ...props }, ref) => (
    <div ref={ref} className={cn('p-6 pb-0', className)} {...props} />
));

const DialogTitle = React.forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>(({ className, ...props }, ref) => (
    <h2 ref={ref} className={cn('text-lg font-semibold leading-none tracking-tight', className)} {...props} />
));

const DialogDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
    ({ className, ...props }, ref) => <p ref={ref} className={cn('text-sm text-muted-foreground', className)} {...props} />
);

const DialogFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({ className, ...props }, ref) => (
    <div ref={ref} className={cn('p-6 pt-0', className)} {...props} />
));

const DialogClose = React.forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement> & { asChild?: boolean }>(
    ({ asChild, children, ...props }, ref) => {
        const { onOpenChange } = React.useContext(DialogContext);

        if (asChild && React.isValidElement(children)) {
            return React.cloneElement(children as React.ReactElement<any>, {
                ...props,
                ref,
                onClick: (e: React.MouseEvent) => {
                    onOpenChange(false);
                    (children as any).props.onClick?.(e);
                },
            });
        }

        return (
            <button ref={ref} onClick={() => onOpenChange(false)} {...props}>
                {children}
            </button>
        );
    }
);

DialogTrigger.displayName = 'DialogTrigger';
DialogContent.displayName = 'DialogContent';
DialogHeader.displayName = 'DialogHeader';
DialogTitle.displayName = 'DialogTitle';
DialogDescription.displayName = 'DialogDescription';
DialogFooter.displayName = 'DialogFooter';
DialogClose.displayName = 'DialogClose';

export { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose };

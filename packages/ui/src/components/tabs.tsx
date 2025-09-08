import * as React from 'react';
import { cn } from '../lib/utils';

interface TabsProps {
    value: string;
    onValueChange: (value: string) => void;
    children: React.ReactNode;
    className?: string;
}

interface TabsListProps {
    children: React.ReactNode;
    className?: string;
}

interface TabsTriggerProps {
    value: string;
    children: React.ReactNode;
    className?: string;
    'data-state'?: string;
}

interface TabsContentProps {
    value: string;
    children: React.ReactNode;
    className?: string;
}

export const Tabs: React.FC<TabsProps> = ({ value, onValueChange, children, className }) => {
    return (
        <div className={cn('w-full', className)}>
            {React.Children.map(children, (child) => {
                if (React.isValidElement(child)) {
                    return React.cloneElement(child, { value, onValueChange } as any);
                }
                return child;
            })}
        </div>
    );
};

export const TabsList: React.FC<TabsListProps> = ({ children, className }) => {
    return <div className={cn('inline-flex h-10 items-center justify-center rounded-md bg-gray-100 p-1', className)}>{children}</div>;
};

export const TabsTrigger: React.FC<TabsTriggerProps> = ({ value, children, className, 'data-state': dataState, ...props }) => {
    return (
        <button
            className={cn(
                'inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:shadow-sm',
                className
            )}
            data-state={dataState}
            {...props}
        >
            {children}
        </button>
    );
};

export const TabsContent: React.FC<TabsContentProps> = ({ value, children, className }) => {
    return <div className={cn('mt-2', className)}>{children}</div>;
};

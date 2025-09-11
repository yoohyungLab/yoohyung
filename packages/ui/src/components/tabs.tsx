'use client';

import * as React from 'react';
import { cn } from '../lib/utils';

const TabsContext = React.createContext<{
    value: string;
    onValueChange: (value: string) => void;
}>({
    value: '',
    onValueChange: () => {},
});

const Tabs = ({
    value,
    onValueChange,
    children,
    ...props
}: {
    value: string;
    onValueChange: (value: string) => void;
    children: React.ReactNode;
} & React.HTMLAttributes<HTMLDivElement>) => {
    return (
        <TabsContext.Provider value={{ value, onValueChange }}>
            <div {...props}>{children}</div>
        </TabsContext.Provider>
    );
};

const TabsList = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({ className, ...props }, ref) => (
    <div
        ref={ref}
        className={cn('inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground', className)}
        {...props}
    />
));

const TabsTrigger = React.forwardRef<
    HTMLButtonElement,
    React.ButtonHTMLAttributes<HTMLButtonElement> & {
        value: string;
    }
>(({ className, value, ...props }, ref) => {
    const { value: selectedValue, onValueChange } = React.useContext(TabsContext);

    return (
        <button
            ref={ref}
            className={cn(
                'inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
                selectedValue === value ? 'bg-background text-foreground shadow-sm' : 'hover:bg-background/50',
                className
            )}
            onClick={() => onValueChange(value)}
            {...props}
        />
    );
});

const TabsContent = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement> & {
        value: string;
    }
>(({ className, value, ...props }, ref) => {
    const { value: selectedValue } = React.useContext(TabsContext);

    if (selectedValue !== value) return null;

    return (
        <div
            ref={ref}
            className={cn(
                'mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
                className
            )}
            {...props}
        />
    );
});

TabsList.displayName = 'TabsList';
TabsTrigger.displayName = 'TabsTrigger';
TabsContent.displayName = 'TabsContent';

export { Tabs, TabsList, TabsTrigger, TabsContent };

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@repo/ui';
import { cn } from '../lib/utils';

interface AdminCardProps {
    children: React.ReactNode;
    className?: string;
    variant?: 'default' | 'outline' | 'elevated' | 'bordered';
    padding?: 'none' | 'sm' | 'md' | 'lg';
}

interface AdminCardHeaderProps {
    children?: React.ReactNode;
    className?: string;
    title?: string;
    subtitle?: string;
    action?: React.ReactNode;
    icon?: React.ReactNode;
}

interface AdminCardContentProps {
    children: React.ReactNode;
    className?: string;
    padding?: 'none' | 'sm' | 'md' | 'lg';
}

interface AdminCardTitleProps {
    children: React.ReactNode;
    className?: string;
    level?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
}

// 메인 Card 컴포넌트
export function AdminCard({ children, className, variant = 'default', padding = 'md' }: AdminCardProps) {
    const variantClasses = {
        default: 'bg-white border border-gray-200',
        outline: 'bg-white border-2 border-gray-300',
        elevated: 'bg-white shadow-lg border border-gray-100',
        bordered: 'bg-white border-l-4 border-l-blue-500 border border-gray-200',
    };

    const paddingClasses = {
        none: '',
        sm: 'p-4',
        md: 'p-6',
        lg: 'p-8',
    };

    return (
        <Card className={cn('rounded-lg transition-all duration-200', variantClasses[variant], paddingClasses[padding], className)}>
            {children}
        </Card>
    );
}

// Card Header 컴포넌트
export function AdminCardHeader({ children, className, title, subtitle, action, icon }: AdminCardHeaderProps) {
    return (
        <CardHeader className={cn('border-b border-gray-100 pb-4', className)}>
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    {icon && <div className="text-gray-600">{icon}</div>}
                    <div>
                        {title && <CardTitle className="text-lg font-semibold text-gray-900">{title}</CardTitle>}
                        {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
                    </div>
                </div>
                {action && <div className="flex-shrink-0">{action}</div>}
            </div>
            {children}
        </CardHeader>
    );
}

// Card Content 컴포넌트
export function AdminCardContent({ children, className, padding = 'md' }: AdminCardContentProps) {
    const paddingClasses = {
        none: '',
        sm: 'p-4',
        md: 'p-6',
        lg: 'p-8',
    };

    return <CardContent className={cn(paddingClasses[padding], className)}>{children}</CardContent>;
}

// Card Title 컴포넌트
export function AdminCardTitle({ children, className, level = 'h3' }: AdminCardTitleProps) {
    const Component = level;

    return (
        <Component
            className={cn(
                'font-semibold text-gray-900',
                {
                    'text-2xl': level === 'h1',
                    'text-xl': level === 'h2',
                    'text-lg': level === 'h3',
                    'text-base': level === 'h4',
                    'text-sm': level === 'h5',
                    'text-xs': level === 'h6',
                },
                className
            )}
        >
            {children}
        </Component>
    );
}

// 통합 컴포넌트 (기존 Card와 호환)
export const AdminCardComponents = {
    Card: AdminCard,
    Header: AdminCardHeader,
    Content: AdminCardContent,
    Title: AdminCardTitle,
};

// 기본 export
export default AdminCardComponents;

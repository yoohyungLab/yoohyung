import React from 'react';
import { Button } from '@repo/ui';
import { cn } from '../lib/utils';

export interface BulkAction {
    id: string;
    label: string;
    variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
    onClick: () => void;
    className?: string;
    disabled?: boolean;
}

export interface BulkActionsProps {
    selectedCount: number;
    actions: BulkAction[];
    className?: string;
    onClear?: () => void;
    showClear?: boolean;
}

export function BulkActions({ selectedCount, actions, className, onClear, showClear = true }: BulkActionsProps) {
    if (selectedCount === 0) return null;

    return (
        <div className={cn('mt-4 pt-4 border-t border-gray-200', className)}>
            <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">{selectedCount}개 선택됨</span>
                <div className="flex items-center gap-2">
                    {actions.map((action) => (
                        <Button
                            key={action.id}
                            size="sm"
                            variant={action.variant || 'outline'}
                            onClick={action.onClick}
                            disabled={action.disabled}
                            className={cn(action.className)}
                        >
                            {action.label}
                        </Button>
                    ))}
                    {showClear && onClear && (
                        <Button size="sm" variant="ghost" onClick={onClear} className="text-gray-500 hover:text-gray-700">
                            선택 해제
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
}

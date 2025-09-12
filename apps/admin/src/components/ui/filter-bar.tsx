import React from 'react';
import { Button, cn } from '@repo/ui';
import { Search, X } from 'lucide-react';

export interface FilterOption {
    value: string;
    label: string;
}

export interface Filter {
    id: string;
    type: 'search' | 'select';
    placeholder?: string;
    options?: FilterOption[];
    value: string;
    onChange: (value: string) => void;
    className?: string;
}

export interface FilterBarProps {
    filters: Filter[];
    actions?: React.ReactNode;
    className?: string;
    onClear?: () => void;
    hasActiveFilters?: boolean;
}

export function FilterBar({ filters, actions, className, onClear, hasActiveFilters }: FilterBarProps) {
    return (
        <div className={cn('space-y-4', className)}>
            {/* Filters Row */}
            <div className="flex flex-wrap items-center gap-3">
                {filters.map((filter) => (
                    <div key={filter.id} className={cn('min-w-0', filter.className)}>
                        {filter.type === 'search' ? (
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <input
                                    type="text"
                                    placeholder={filter.placeholder}
                                    value={filter.value}
                                    onChange={(e) => filter.onChange(e.target.value)}
                                    className="h-9 w-[250px] rounded-md border border-input bg-background px-3 py-1 !pl-9 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                                />
                            </div>
                        ) : (
                            <select
                                value={filter.value}
                                onChange={(e) => filter.onChange(e.target.value)}
                                className="h-9 w-[140px] rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                {filter.options?.map((option) => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                        )}
                    </div>
                ))}

                {/* Clear Filters */}
                {hasActiveFilters && onClear && (
                    <Button variant="ghost" size="sm" onClick={onClear} className="h-9 px-2 text-muted-foreground hover:text-foreground">
                        <X className="h-4 w-4 mr-1" />
                        필터 초기화
                    </Button>
                )}
            </div>

            {/* Actions Row */}
            {actions && (
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">{actions}</div>
                </div>
            )}
        </div>
    );
}

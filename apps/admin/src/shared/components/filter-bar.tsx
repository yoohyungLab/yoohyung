import React from 'react';
import { Button, cn } from '@repo/ui';
import { Search } from 'lucide-react';

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
}

export function FilterBar({ filters, actions, className }: FilterBarProps) {
    return (
        <div className={cn('p-4', className)}>
            <div className="flex flex-col lg:flex-row gap-4">
                {/* Filters */}
                <div className="flex-1 flex flex-col sm:flex-row gap-4">
                    {filters.map((filter) => (
                        <div key={filter.id} className={cn('flex-1', filter.className)}>
                            {filter.type === 'search' ? (
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                    <input
                                        type="text"
                                        placeholder={filter.placeholder}
                                        value={filter.value}
                                        onChange={(e) => filter.onChange(e.target.value)}
                                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                            ) : (
                                <select
                                    value={filter.value}
                                    onChange={(e) => filter.onChange(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                </div>

                {/* Actions */}
                {actions && <div className="flex gap-2">{actions}</div>}
            </div>
        </div>
    );
}

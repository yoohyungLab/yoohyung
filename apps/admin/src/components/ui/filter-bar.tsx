import * as React from 'react';
import { Button, cn, DefaultSelect, DefaultInput, SearchInput, type SelectOption } from '@repo/ui';
import { X } from 'lucide-react';
import {
    FILTER_STATUS_OPTIONS,
    FILTER_PROVIDER_OPTIONS,
    FILTER_FEEDBACK_CATEGORY_OPTIONS,
    SEARCH_PLACEHOLDERS,
} from '../../shared/lib/constants';

interface Filter {
    id: string;
    type: 'search' | 'select' | 'date';
    placeholder?: string;
    options?: readonly SelectOption[];
    value: string;
    onChange: (value: string) => void;
    className?: string;
}

interface CommonFilterConfig {
    search?:
        | boolean
        | {
              placeholder?: string;
          };
    status?:
        | boolean
        | {
              options?: readonly SelectOption[];
          };
    provider?:
        | boolean
        | {
              options?: readonly SelectOption[];
          };
    category?:
        | boolean
        | {
              options?: readonly SelectOption[];
          };
    date?:
        | boolean
        | {
              placeholder?: string;
          };
}

export interface FilterBarProps {
    filters?: Filter[];
    commonFilters?: CommonFilterConfig;
    onFilterChange?: (filters: Record<string, string>) => void;
    actions?: React.ReactNode;
    className?: string;
    onClear?: () => void;
    hasActiveFilters?: boolean;
}

export function FilterBar({ filters, commonFilters, onFilterChange, actions, className, onClear, hasActiveFilters }: FilterBarProps) {
    // 공통 필터용 내부 상태
    const [internalFilters, setInternalFilters] = React.useState({
        search: '',
        status: 'all',
        provider: 'all',
        category: 'all',
        date: '',
    });

    const handleInternalFilterChange = React.useCallback(
        (key: string, value: string) => {
            const newFilters = { ...internalFilters, [key]: value };
            setInternalFilters(newFilters);
            onFilterChange?.(newFilters);
        },
        [internalFilters, onFilterChange]
    );

    const clearInternalFilters = React.useCallback(() => {
        const clearedFilters = {
            search: '',
            status: 'all',
            provider: 'all',
            category: 'all',
            date: '',
        };
        setInternalFilters(clearedFilters);
        onFilterChange?.(clearedFilters);
    }, [onFilterChange]);

    const internalHasActiveFilters =
        internalFilters.search !== '' ||
        internalFilters.status !== 'all' ||
        internalFilters.provider !== 'all' ||
        internalFilters.category !== 'all' ||
        internalFilters.date !== '';

    // 공통 필터 생성
    const generateCommonFilters = (): Filter[] => {
        if (!commonFilters) return [];

        const result: Filter[] = [];

        if (commonFilters.search) {
            const searchConfig = typeof commonFilters.search === 'boolean' ? {} : commonFilters.search;
            result.push({
                id: 'search',
                type: 'search',
                placeholder: searchConfig.placeholder || SEARCH_PLACEHOLDERS.USER,
                value: internalFilters.search,
                onChange: (value) => handleInternalFilterChange('search', value),
            });
        }

        if (commonFilters.status) {
            const statusConfig = typeof commonFilters.status === 'boolean' ? {} : commonFilters.status;
            result.push({
                id: 'status',
                type: 'select',
                options: statusConfig.options || FILTER_STATUS_OPTIONS,
                value: internalFilters.status,
                onChange: (value) => handleInternalFilterChange('status', value),
            });
        }

        if (commonFilters.provider) {
            const providerConfig = typeof commonFilters.provider === 'boolean' ? {} : commonFilters.provider;
            result.push({
                id: 'provider',
                type: 'select',
                options: providerConfig.options || FILTER_PROVIDER_OPTIONS,
                value: internalFilters.provider,
                onChange: (value) => handleInternalFilterChange('provider', value),
            });
        }

        if (commonFilters.category) {
            const categoryConfig = typeof commonFilters.category === 'boolean' ? {} : commonFilters.category;
            result.push({
                id: 'category',
                type: 'select',
                options: categoryConfig.options || FILTER_FEEDBACK_CATEGORY_OPTIONS,
                value: internalFilters.category,
                onChange: (value) => handleInternalFilterChange('category', value),
            });
        }

        if (commonFilters.date) {
            const dateConfig = typeof commonFilters.date === 'boolean' ? {} : commonFilters.date;
            result.push({
                id: 'date',
                type: 'date',
                placeholder: dateConfig.placeholder || '날짜 선택',
                value: internalFilters.date,
                onChange: (value) => handleInternalFilterChange('date', value),
            });
        }

        return result;
    };

    const finalFilters = commonFilters ? generateCommonFilters() : filters || [];
    const finalHasActiveFilters = hasActiveFilters ?? internalHasActiveFilters;
    const finalOnClear = onClear ?? clearInternalFilters;

    return (
        <div className={cn('space-y-4', className)}>
            {/* Filters Row */}
            <div className="flex flex-wrap items-center gap-3">
                {finalFilters.map((filter) => (
                    <div key={filter.id} className={cn('min-w-0', filter.className)}>
                        {filter.type === 'search' ? (
                            <SearchInput
                                placeholder={filter.placeholder}
                                value={filter.value}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => filter.onChange(e.target.value)}
                                onClear={() => filter.onChange('')}
                                showClear={true}
                                className="w-[250px]"
                            />
                        ) : filter.type === 'date' ? (
                            <DefaultInput
                                type="date"
                                placeholder={filter.placeholder}
                                value={filter.value}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => filter.onChange(e.target.value)}
                                className="h-9 w-[140px]"
                            />
                        ) : (
                            <DefaultSelect
                                value={filter.value}
                                onValueChange={filter.onChange}
                                options={filter.options ? [...filter.options] : []}
                                className="w-[140px]"
                            />
                        )}
                    </div>
                ))}

                {/* Clear Filters */}
                {finalHasActiveFilters && finalOnClear && (
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={finalOnClear}
                        className="h-9 px-2 text-muted-foreground hover:text-foreground"
                    >
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

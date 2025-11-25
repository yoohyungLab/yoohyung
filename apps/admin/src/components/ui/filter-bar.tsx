import { Button, cn, DefaultSelect, SearchInput, type SelectOption } from '@pickid/ui';
import { X } from 'lucide-react';
import * as React from 'react';

interface FilterConfig {
	search?: boolean;
	status?: {
		options: SelectOption[];
	};
	provider?: {
		options: SelectOption[];
	};
	category?: {
		options: SelectOption[];
	};
	date?: boolean;
}

export interface FilterBarProps {
	filters: FilterConfig;
	values: Record<string, string>;
	onFilterChange: (filters: Record<string, string>) => void;
	actions?: React.ReactNode;
	className?: string;
}

export function FilterBar({ filters, values, onFilterChange, actions, className }: FilterBarProps) {
	const handleFilterChange = (key: string, value: string) => {
		onFilterChange({ ...values, [key]: value });
	};

	const clearFilters = () => {
		const clearedFilters = Object.keys(values || {}).reduce((acc, key) => {
			acc[key] = key === 'search' ? '' : 'all';
			return acc;
		}, {} as Record<string, string>);
		onFilterChange(clearedFilters);
	};

	const hasActiveFilters = Object.entries(values || {}).some(([key, value]) => {
		return key === 'search' ? value !== '' : value !== 'all';
	});

	return (
		<div className={cn('space-y-4', className)}>
			{/* Filters Card */}
			<div className="border-0 shadow-sm bg-white rounded-lg">
				<div className="p-4">
					<div className="flex gap-3 items-center justify-between">
						<div className="flex gap-3 items-center flex-1">
							{/* Search Filter */}
							{filters?.search && (
								<div className="relative flex-1 max-w-sm">
									<SearchInput
										{...{
											value: values.search || '',
											onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
												handleFilterChange('search', e.target.value),
											onClear: () => handleFilterChange('search', ''),
											showClear: true,
											className: 'w-full',
										}}
									/>
								</div>
							)}

							{/* Status Filter */}
							{filters?.status && (
								<DefaultSelect
									value={values.status || 'all'}
									onValueChange={(value) => handleFilterChange('status', value)}
									options={filters.status.options}
									className="w-[140px]"
								/>
							)}

							{/* Provider Filter */}
							{filters?.provider && (
								<DefaultSelect
									value={values.provider || 'all'}
									onValueChange={(value) => handleFilterChange('provider', value)}
									options={filters.provider.options}
									className="w-[140px]"
								/>
							)}

							{/* Category Filter */}
							{filters?.category && (
								<DefaultSelect
									value={values.category || 'all'}
									onValueChange={(value) => handleFilterChange('category', value)}
									options={filters.category.options}
									className="w-[140px]"
								/>
							)}

							{/* Date Filter */}
							{filters?.date && (
								<input
									type="date"
									placeholder="날짜 선택"
									value={values.date || ''}
									onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleFilterChange('date', e.target.value)}
									className="w-[140px] px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
								/>
							)}

							{/* Clear Filters */}
							{hasActiveFilters && (
								<Button
									variant="ghost"
									size="sm"
									onClick={clearFilters}
									className="h-9 px-2 text-muted-foreground hover:text-foreground"
								>
									<X className="h-4 w-4 mr-1" />
									필터 초기화
								</Button>
							)}
						</div>

						{/* Actions */}
						{actions && <div className="flex items-center gap-2">{actions}</div>}
					</div>
				</div>
			</div>
		</div>
	);
}

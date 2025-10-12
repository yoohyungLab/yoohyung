import React from 'react';
import { FilterBar } from '@/components/ui';

interface ResponseFiltersProps {
	filters: {
		search?: string;
		device?: string;
		dateFrom?: string;
		dateTo?: string;
	};
	onFilterChange: (filters: { search: string; device: string; dateFrom: string; dateTo: string }) => void;
}

export function ResponseFilters({ filters, onFilterChange }: ResponseFiltersProps) {
	return (
		<FilterBar
			filters={{ search: true, date: true }}
			values={{
				search: filters.search || '',
				device: filters.device || 'all',
				dateFrom: filters.dateFrom || '',
				dateTo: filters.dateTo || '',
			}}
			onFilterChange={(newFilters) => {
				onFilterChange({
					search: newFilters.search || '',
					device: (newFilters.device as string) || 'all',
					dateFrom: newFilters.dateFrom || '',
					dateTo: newFilters.dateTo || '',
				});
			}}
		/>
	);
}

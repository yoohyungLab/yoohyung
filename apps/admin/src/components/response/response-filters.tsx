import React from 'react';
import { Button } from '@repo/ui';
import { Download } from 'lucide-react';
import { FilterBar } from '@/components/ui';

interface ResponseFiltersProps {
	filters: {
		search?: string;
		device?: string;
		dateFrom?: string;
		dateTo?: string;
	};
	loading: boolean;
	onFilterChange: (filters: { search: string; device: string; dateFrom: string; dateTo: string }) => void;
	onExport: () => void;
}

export function ResponseFilters({ filters, loading, onFilterChange, onExport }: ResponseFiltersProps) {
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
			actions={
				<div className="flex gap-2">
					<Button onClick={onExport} className="flex items-center gap-2">
						<Download className="w-4 h-4" />
						데이터 내보내기
					</Button>
				</div>
			}
		/>
	);
}

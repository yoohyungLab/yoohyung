import React from 'react';
import { cn } from '@pickid/shared';

export interface Column<T> {
	id: string;
	header: string;
	accessorKey?: keyof T;
	cell?: (props: { row: { original: T } }) => React.ReactNode;
	sortable?: boolean;
	width?: string;
}

export interface DataTableProps<T> {
	data: T[];
	columns: Column<T>[];
	onRowClick?: (row: T) => void;
	// Selection props
	selectable?: boolean;
	selectedItems?: string[];
	onSelectionChange?: (selectedIds: string[]) => void;
	getRowId?: (row: T) => string;
	className?: string;
}

export function DataTable<T>({
	data,
	columns,
	onRowClick,
	selectable = false,
	selectedItems = [],
	onSelectionChange,
	getRowId,
	className,
}: DataTableProps<T>) {
	// Selection logic
	const isAllSelected = selectable && selectedItems.length === data.length && data.length > 0;
	const isIndeterminate = selectable && selectedItems.length > 0 && selectedItems.length < data.length;

	const handleSelectAll = (checked: boolean) => {
		if (selectable && onSelectionChange && getRowId) {
			if (checked) {
				onSelectionChange(data.map(getRowId));
			} else {
				onSelectionChange([]);
			}
		}
	};

	const handleSelectRow = (rowId: string, checked: boolean) => {
		if (selectable && onSelectionChange) {
			if (checked) {
				onSelectionChange([...selectedItems, rowId]);
			} else {
				onSelectionChange(selectedItems.filter((id) => id !== rowId));
			}
		}
	};

	return (
		<div className={cn('bg-white rounded-lg border overflow-hidden', className)}>
			{/* Selection info */}
			{selectable && selectedItems.length > 0 && (
				<div className="px-3 py-2 bg-gray-50 border-b border-gray-200">
					<div className="text-sm text-blue-600 font-medium">{selectedItems.length}개 선택됨</div>
				</div>
			)}
			<div className="overflow-x-auto">
				<table className="w-full">
					<thead className="bg-gray-50 border-b">
						<tr>
							{selectable && (
								<th className="px-3 py-2 text-left w-10">
									<input
										type="checkbox"
										checked={isAllSelected}
										ref={(el) => {
											if (el) el.indeterminate = isIndeterminate;
										}}
										onChange={(e) => handleSelectAll(e.target.checked)}
										className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 h-3 w-3"
									/>
								</th>
							)}
							{columns.map((column) => (
								<th
									key={column.id}
									className="px-3 py-2 text-left text-sm font-medium text-gray-500 uppercase tracking-wider"
									style={{ width: column.width }}
								>
									{column.header}
								</th>
							))}
						</tr>
					</thead>
					<tbody className="divide-y divide-gray-200">
						{data.map((row, index) => (
							<tr
								key={getRowId ? getRowId(row) : index}
								className={cn('hover:bg-gray-50 transition-colors', onRowClick && 'cursor-pointer')}
								onClick={() => onRowClick?.(row)}
							>
								{selectable && getRowId && (
									<td className="px-3 py-2" onClick={(e) => e.stopPropagation()}>
										<input
											type="checkbox"
											checked={selectedItems.includes(getRowId(row))}
											onChange={(e) => {
												e.stopPropagation();
												handleSelectRow(getRowId(row), e.target.checked);
											}}
											className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 h-3 w-3"
										/>
									</td>
								)}
								{columns.map((column) => (
									<td key={column.id} className="px-3 py-2 text-sm text-gray-900">
										{column.cell
											? column.cell({ row: { original: row } })
											: column.accessorKey
											? String(row[column.accessorKey] || '')
											: null}
									</td>
								))}
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</div>
	);
}

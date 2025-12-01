import React, { useMemo } from 'react';
import { DataTable, Badge } from '@pickid/ui';
import { Monitor } from 'lucide-react';
import { ResponseUtils } from '@/services/user-responses.service';
import { useTableColumns } from '@/hooks/useTableColumns';
import type { UserResponse } from '@/services/user-responses.service';

interface ResponseTableProps {
	responses: UserResponse[];
	selectedResponses: string[];
	onSelectionChange: (selected: string[]) => void;
	onRowClick: (response: UserResponse) => void;
	onDelete: (responseId: string) => void;
	onView: (response: UserResponse) => void;
}

export function ResponseTable({
	responses,
	selectedResponses,
	onSelectionChange,
	onRowClick,
	onDelete,
	onView,
}: ResponseTableProps) {
	const columnConfigs = useMemo(
		() => [
			{
				id: 'id',
				header: '응답 ID',
				type: 'text' as const,
				accessor: 'id',
				format: (value: string) => `${value.slice(0, 8)}...`,
				className: 'font-mono text-xs text-gray-500',
			},
			{
				id: 'test',
				header: '테스트',
				type: 'custom' as const,
				customRender: (data: UserResponse) => (
					<div className="min-w-0">
						<div className="font-medium text-gray-900 truncate">{data.test_title}</div>
						<div className="text-xs text-gray-500">{data.test_slug}</div>
					</div>
				),
			},
			{
				id: 'categories',
				header: '카테고리',
				type: 'custom' as const,
				customRender: (data: UserResponse) => (
					<div className="flex flex-wrap gap-1">
						{data.category_names.map((cat: string, index: number) => (
							<Badge key={index} variant="outline" className="whitespace-nowrap">
								{cat}
							</Badge>
						))}
					</div>
				),
			},
			{
				id: 'result',
				header: '결과 유형',
				type: 'badge' as const,
				badge: {
					getValue: (data: UserResponse) => data.result_name || '결과 없음',
					getVariant: () => 'default' as const,
				},
			},
			{
				id: 'score',
				header: '점수',
				type: 'number' as const,
				accessor: 'total_score',
			},
			{
				id: 'completed_at',
				header: '응답일시',
				type: 'date' as const,
				accessor: 'completed_at',
			},
			{
				id: 'duration',
				header: '소요시간',
				type: 'custom' as const,
				customRender: (data: UserResponse) => (
					<span className="text-sm text-gray-900">{ResponseUtils.formatDuration(data.completion_time_seconds)}</span>
				),
			},
			{
				id: 'device',
				header: '디바이스',
				type: 'custom' as const,
				customRender: (data: UserResponse) => (
					<div className="flex items-center gap-1">
						<Monitor className="w-3 h-3 text-gray-400" />
						<span className="text-sm text-gray-900">{ResponseUtils.formatDeviceType(data.device_type)}</span>
					</div>
				),
			},
			{
				id: 'status',
				header: '상태',
				type: 'badge' as const,
				badge: {
					getValue: (data: UserResponse) => ResponseUtils.getResponseStatus(data),
					getVariant: (value: string) => (value === 'completed' ? 'default' : 'secondary') as const,
					getLabel: (value: string) => (value === 'completed' ? '완료' : '미완료'),
				},
			},
			{
				id: 'actions',
				header: '액션',
				type: 'actions' as const,
				actions: [
					{
						type: 'view' as const,
						onClick: (id: string, data?: any) => onView(data as UserResponse),
					},
					{
						type: 'delete' as const,
						onClick: (id: string) => onDelete(id),
					},
				],
			},
		],
		[onView, onDelete]
	);

	const { columns } = useTableColumns<UserResponse>(columnConfigs);

	return (
		<DataTable
			data={responses}
			columns={columns}
			selectable={true}
			selectedItems={selectedResponses}
			onSelectionChange={onSelectionChange}
			getRowId={(response: UserResponse) => response.id}
			onRowClick={onRowClick}
		/>
	);
}

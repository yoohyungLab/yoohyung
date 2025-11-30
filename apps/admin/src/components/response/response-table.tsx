import React, { useMemo } from 'react';
import { DataTable, type Column, Badge } from '@pickid/ui';
import { Monitor } from 'lucide-react';
import { ResponseUtils } from '@/services/user-responses.service';
import { useColumnRenderers } from '@/hooks';
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
	const renderers = useColumnRenderers();

	const columns: Column<UserResponse>[] = useMemo(
		() => [
			{
				id: 'id',
				header: '응답 ID',
				cell: ({ row }) => <div className="font-mono text-xs text-gray-500">{row.original.id.slice(0, 8)}...</div>,
			},
			{
				id: 'test',
				header: '테스트',
				cell: ({ row }) => (
					<div className="min-w-0">
						<div className="font-medium text-gray-900 truncate">{row.original.test_title}</div>
						<div className="text-xs text-gray-500">{row.original.test_slug}</div>
					</div>
				),
			},
			{
				id: 'categories',
				header: '카테고리',
				cell: ({ row }) => (
					<div className="flex flex-wrap gap-1">
						{row.original.category_names.map((cat: string, index: number) => (
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
				cell: ({ row }) => (
					<Badge variant="default" className="whitespace-nowrap">
						{row.original.result_name || '결과 없음'}
					</Badge>
				),
			},
			{
				id: 'score',
				header: '점수',
				cell: ({ row }) => renderers.renderNumber(row.original.total_score),
			},
			{
				id: 'completed_at',
				header: '응답일시',
				cell: ({ row }) => renderers.renderDate(row.original.completed_at || ''),
			},
			{
				id: 'duration',
				header: '소요시간',
				cell: ({ row }) => (
					<span className="text-sm text-gray-900">
						{ResponseUtils.formatDuration(row.original.completion_time_seconds)}
					</span>
				),
			},
			{
				id: 'device',
				header: '디바이스',
				cell: ({ row }) => (
					<div className="flex items-center gap-1">
						<Monitor className="w-3 h-3 text-gray-400" />
						<span className="text-sm text-gray-900">{ResponseUtils.formatDeviceType(row.original.device_type)}</span>
					</div>
				),
			},
			{
				id: 'status',
				header: '상태',
				cell: ({ row }) => {
					const status = ResponseUtils.getResponseStatus(row.original);
					return (
						<Badge variant={status === 'completed' ? 'default' : 'secondary'} className="whitespace-nowrap">
							{status === 'completed' ? '완료' : '미완료'}
						</Badge>
					);
				},
			},
			{
				id: 'actions',
				header: '액션',
				cell: ({ row }) =>
					renderers.renderActions(row.original.id, row.original as unknown as Record<string, unknown>, [
						{
							type: 'view',
							onClick: () => onView(row.original),
						},
						{
							type: 'delete',
							onClick: (id) => onDelete(id),
						},
					]),
			},
		],
		[renderers, onView, onDelete]
	);

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

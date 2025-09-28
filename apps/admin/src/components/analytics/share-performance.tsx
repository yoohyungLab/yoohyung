import React from 'react';
import { AdminCard, AdminCardHeader } from '@/components/ui/admin-card';
import { Share2 } from 'lucide-react';

export function SharePerformance() {
	return (
		<AdminCard className="p-5">
			<AdminCardHeader
				title="📤 공유 채널 성과"
				subtitle="채널별 공유 및 클릭률"
				icon={<Share2 className="w-5 h-5 text-pink-600" />}
			/>
			<div className="overflow-x-auto">
				<table className="w-full">
					<thead>
						<tr className="border-b border-gray-200">
							<th className="text-left py-3 px-4 font-medium text-gray-900">채널</th>
							<th className="text-right py-3 px-4 font-medium text-gray-900">공유수</th>
							<th className="text-right py-3 px-4 font-medium text-gray-900">비율</th>
							<th className="text-right py-3 px-4 font-medium text-gray-900">CTR</th>
						</tr>
					</thead>
					<tbody>
						<tr className="border-b border-gray-100">
							<td className="py-3 px-4 font-medium text-gray-500">데이터 없음</td>
							<td className="py-3 px-4 text-right text-gray-500">-</td>
							<td className="py-3 px-4 text-right text-gray-500">-</td>
							<td className="py-3 px-4 text-right text-gray-500">-</td>
						</tr>
					</tbody>
				</table>
			</div>
		</AdminCard>
	);
}

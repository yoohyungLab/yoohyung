


import React from 'react';
import { AdminCard, AdminCardHeader } from '@/components/ui/admin-card';
import { LineChart } from 'lucide-react';

export function TrendsTab() {
	return (
		<div className="space-y-6">
			<AdminCard className="p-5">
				<AdminCardHeader
					title="📈 시계열 트렌드"
					subtitle="Google Analytics에서 확인하세요"
					icon={<LineChart className="w-5 h-5 text-blue-600" />}
				/>
				<div className="text-center py-12 text-gray-500">
					<LineChart className="w-16 h-16 mx-auto mb-4 text-gray-300" />
					<p className="mb-2 font-medium">이 기능은 Google Analytics로 이전되었습니다</p>
					<p className="text-sm mb-4">더 강력한 시계열 분석과 세그먼트 기능을 제공합니다</p>
					<div className="text-xs text-left max-w-md mx-auto bg-gray-50 p-4 rounded">
						<p className="font-semibold mb-2">GA4에서 확인하기:</p>
						<ul className="list-disc list-inside space-y-1">
							<li>탐색 → 자유 형식 → 날짜별 이벤트</li>
							<li>보고서 → 참여도 → 이벤트</li>
							<li>실시간 → 이벤트 수 (실시간)</li>
						</ul>
					</div>
				</div>
			</AdminCard>
		</div>
	);
}

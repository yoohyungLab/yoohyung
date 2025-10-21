// 이 컴포넌트의 기능은 Google Analytics 4로 이전되었습니다
// GA에서 더 정확하고 상세한 디바이스 정보 (모델명, OS 버전 등) 제공
/*
import React from 'react';
import { AdminCard, AdminCardHeader } from '@/components/ui/admin-card';
import { Smartphone } from 'lucide-react';
import { cn } from '@/shared/lib/utils';
import type { Database } from '@pickid/supabase';

type TestAnalyticsData = Database['public']['Functions']['get_test_analytics_data']['Returns'];

interface DeviceBreakdownProps {
	testData: TestAnalyticsData | null;
}

export function DeviceBreakdown({ testData }: DeviceBreakdownProps) {
	return (
		<AdminCard className="p-5">
			<AdminCardHeader
				title="📱 디바이스 분포"
				subtitle="응답자의 디바이스 유형별 분포"
				icon={<Smartphone className="w-5 h-5 text-blue-600" />}
			/>
			{testData?.device_breakdown ? (
				<div className="space-y-4">
					{Object.entries(testData.device_breakdown).map(([device, count], index) => {
						const total = Object.values(testData.device_breakdown).reduce((sum: number, val: number) => sum + val, 0);
						const percentage = total > 0 ? Math.round((count / total) * 100) : 0;
						const colors = ['bg-blue-500', 'bg-green-500', 'bg-purple-500'];
						const deviceNames = { mobile: 'Mobile', desktop: 'Desktop', tablet: 'Tablet' };

						return (
							<div key={device} className="flex items-center justify-between">
								<div className="flex items-center gap-3">
									<div className={cn('w-4 h-4 rounded', colors[index % colors.length])} />
									<span className="font-medium">{deviceNames[device as keyof typeof deviceNames]}</span>
								</div>
								<div className="flex items-center gap-4">
									<div className="w-32 bg-gray-200 rounded-full h-2">
										<div
											className={cn('h-2 rounded-full', colors[index % colors.length])}
											style={{ width: `${percentage}%` }}
										/>
									</div>
									<span className="text-sm font-medium w-12 text-right">{percentage}%</span>
									<span className="text-sm text-gray-600 w-16 text-right">{count.toLocaleString()}</span>
								</div>
							</div>
						);
					})}
				</div>
			) : (
				<div className="text-center py-8 text-gray-500">
					<Smartphone className="w-12 h-12 mx-auto mb-4 text-gray-300" />
					<p>디바이스 분포 데이터가 없습니다</p>
				</div>
			)}
		</AdminCard>
	);
}
*/

// 임시 컴포넌트 (GA 전환 전까지)
import React from 'react';
import { AdminCard, AdminCardHeader } from '@/components/ui/admin-card';
import { Smartphone } from 'lucide-react';

export function DeviceBreakdown() {
	return (
		<AdminCard className="p-5">
			<AdminCardHeader
				title="📱 디바이스 분포"
				subtitle="Google Analytics에서 확인하세요"
				icon={<Smartphone className="w-5 h-5 text-blue-600" />}
			/>
			<div className="text-center py-8 text-gray-500">
				<Smartphone className="w-12 h-12 mx-auto mb-4 text-gray-300" />
				<p className="mb-2">이 기능은 Google Analytics로 이전되었습니다</p>
				<p className="text-sm">GA4 → 사용자 → 기술 → 기기 카테고리</p>
			</div>
		</AdminCard>
	);
}

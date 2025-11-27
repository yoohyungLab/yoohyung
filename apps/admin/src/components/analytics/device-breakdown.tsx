


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

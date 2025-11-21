import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, Badge } from '@pickid/ui';
import { ResponseUtils } from '@/services/user-responses.service';
import type { UserResponse } from '@/services/user-responses.service';

interface ResponseDetailDialogProps {
	response: UserResponse | null;
	isOpen: boolean;
	onClose: () => void;
}

export function ResponseDetailDialog({ response, isOpen, onClose }: ResponseDetailDialogProps) {
	if (!response) return null;

	return (
		<Dialog open={isOpen} onOpenChange={onClose}>
			<DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
				<DialogHeader>
					<DialogTitle>응답 상세 정보</DialogTitle>
				</DialogHeader>
				<div className="space-y-6">
					{/* 기본 정보 */}
					<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
						<div className="space-y-3">
							<h4 className="font-semibold text-lg border-b pb-2">기본 정보</h4>
							<div className="space-y-2 text-sm">
								<div className="flex justify-between">
									<span className="font-medium text-gray-600">응답 ID:</span>
									<span className="font-mono text-xs">{response.id}</span>
								</div>
								<div className="flex justify-between">
									<span className="font-medium text-gray-600">테스트:</span>
									<span className="text-right max-w-xs truncate">{response.test_title}</span>
								</div>
								<div className="flex justify-between">
									<span className="font-medium text-gray-600">카테고리:</span>
									<div className="flex flex-wrap gap-1 max-w-xs">
										{response.category_names.map((cat: string, index: number) => (
											<Badge key={index} variant="outline" className="text-xs">
												{cat}
											</Badge>
										))}
									</div>
								</div>
								<div className="flex justify-between">
									<span className="font-medium text-gray-600">결과 유형:</span>
									<Badge variant="default" className="text-xs">
										{response.result_name || '없음'}
									</Badge>
								</div>
								<div className="flex justify-between">
									<span className="font-medium text-gray-600">점수:</span>
									<span className="font-semibold">{response.total_score ?? 0}점</span>
								</div>
							</div>
						</div>

						<div className="space-y-3">
							<h4 className="font-semibold text-lg border-b pb-2">환경 정보</h4>
							<div className="space-y-2 text-sm">
								<div className="flex justify-between">
									<span className="font-medium text-gray-600">디바이스:</span>
									<span>{ResponseUtils.formatDeviceType(response.device_type)}</span>
								</div>
								<div className="flex justify-between">
									<span className="font-medium text-gray-600">IP 주소:</span>
									<span className="font-mono text-xs">{String(response.ip_address || '알 수 없음')}</span>
								</div>
								<div className="flex justify-between">
									<span className="font-medium text-gray-600">User Agent:</span>
									<span className="text-xs max-w-xs truncate">
										{response.user_agent ? response.user_agent.slice(0, 30) + '...' : '알 수 없음'}
									</span>
								</div>
								<div className="flex justify-between">
									<span className="font-medium text-gray-600">리퍼러:</span>
									<span className="text-xs max-w-xs truncate">{response.referrer || '직접 방문'}</span>
								</div>
							</div>
						</div>
					</div>

					{/* 시간 정보 */}
					<div className="space-y-3">
						<h4 className="font-semibold text-lg border-b pb-2">시간 정보</h4>
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
							<div className="flex justify-between">
								<span className="font-medium text-gray-600">시작 시간:</span>
								<span>
									{response.started_at ? new Date(response.started_at).toLocaleString('ko-KR') : '알 수 없음'}
								</span>
							</div>
							<div className="flex justify-between">
								<span className="font-medium text-gray-600">완료 시간:</span>
								<span>
									{response.completed_at ? new Date(response.completed_at).toLocaleString('ko-KR') : '미완료'}
								</span>
							</div>
							<div className="flex justify-between">
								<span className="font-medium text-gray-600">소요 시간:</span>
								<span className="font-semibold">{ResponseUtils.formatDuration(response.completion_time_seconds)}</span>
							</div>
							<div className="flex justify-between">
								<span className="font-medium text-gray-600">세션 ID:</span>
								<span className="font-mono text-xs">{response.session_id}</span>
							</div>
						</div>
					</div>

					{/* 질문별 응답 */}
					<div className="space-y-3">
						<h4 className="font-semibold text-lg border-b pb-2">질문별 응답</h4>
						<div className="bg-gray-50 p-4 rounded-lg max-h-60 overflow-y-auto">
							<pre className="text-sm whitespace-pre-wrap font-mono">{JSON.stringify(response.responses, null, 2)}</pre>
						</div>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	);
}

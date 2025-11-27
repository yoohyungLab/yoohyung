

import React from 'react';
import { BarChart3, Activity, ExternalLink } from 'lucide-react';

export function GrowthPage() {
	return (
		<div className="space-y-6">
			{/* 헤더 */}
			<div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
				<div>
					<h1 className="text-3xl font-bold text-gray-900">성장 분석</h1>
					<p className="text-gray-600 mt-1">Google Analytics에서 더 강력한 분석 기능을 확인하세요</p>
				</div>
			</div>

			{/* GA 안내 카드들 */}
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
				{/* 트래픽 획득 */}
				<div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
					<div className="flex items-center mb-4">
						<Activity className="h-8 w-8 text-blue-600 mr-3" />
						<h3 className="text-lg font-semibold text-gray-900">트래픽 획득</h3>
					</div>
					<p className="text-sm text-gray-600 mb-4">사용자 유입 경로와 채널별 성과를 분석하세요</p>
					<div className="text-xs text-gray-500 bg-gray-50 p-3 rounded">
						<p className="font-semibold mb-1">GA4에서 확인하기:</p>
						<p>수명 주기 → 획득 → 트래픽 획득</p>
					</div>
				</div>

				{/* 사용자 획득 */}
				<div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
					<div className="flex items-center mb-4">
						<BarChart3 className="h-8 w-8 text-green-600 mr-3" />
						<h3 className="text-lg font-semibold text-gray-900">사용자 획득</h3>
					</div>
					<p className="text-sm text-gray-600 mb-4">신규 사용자와 재방문 사용자 패턴을 분석하세요</p>
					<div className="text-xs text-gray-500 bg-gray-50 p-3 rounded">
						<p className="font-semibold mb-1">GA4에서 확인하기:</p>
						<p>수명 주기 → 획득 → 사용자 획득</p>
					</div>
				</div>

				{/* 실시간 분석 */}
				<div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
					<div className="flex items-center mb-4">
						<Activity className="h-8 w-8 text-purple-600 mr-3" />
						<h3 className="text-lg font-semibold text-gray-900">실시간 분석</h3>
					</div>
					<p className="text-sm text-gray-600 mb-4">현재 사이트 활동과 사용자 행동을 실시간으로 모니터링하세요</p>
					<div className="text-xs text-gray-500 bg-gray-50 p-3 rounded">
						<p className="font-semibold mb-1">GA4에서 확인하기:</p>
						<p>실시간 → 개요</p>
					</div>
				</div>
			</div>

			{/* 상세 분석 안내 */}
			<div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6">
				<h3 className="text-lg font-semibold text-gray-900 mb-4">📊 추가 분석 기능</h3>
				<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
					<div>
						<h4 className="font-medium text-gray-900 mb-2">기술 분석</h4>
						<ul className="text-sm text-gray-600 space-y-1">
							<li>• 기기 카테고리 (모바일/데스크톱/태블릿)</li>
							<li>• 브라우저 및 OS 정보</li>
							<li>• 화면 해상도 및 색상</li>
						</ul>
						<p className="text-xs text-gray-500 mt-2">GA4 → 사용자 → 기술</p>
					</div>
					<div>
						<h4 className="font-medium text-gray-900 mb-2">인구통계 분석</h4>
						<ul className="text-sm text-gray-600 space-y-1">
							<li>• 지역별 사용자 분포</li>
							<li>• 언어 및 국가 정보</li>
							<li>• 연령 및 성별 데이터</li>
						</ul>
						<p className="text-xs text-gray-500 mt-2">GA4 → 사용자 → 인구통계</p>
					</div>
				</div>
			</div>

			{/* GA 접속 안내 */}
			<div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
				<h3 className="text-lg font-semibold text-gray-900 mb-2">Google Analytics 접속하기</h3>
				<p className="text-gray-600 mb-4">더 상세하고 정확한 분석 데이터를 확인하세요</p>
				<a
					href="https://analytics.google.com"
					target="_blank"
					rel="noopener noreferrer"
					className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
				>
					<ExternalLink className="w-4 h-4" />
					Google Analytics 열기
				</a>
			</div>
		</div>
	);
}

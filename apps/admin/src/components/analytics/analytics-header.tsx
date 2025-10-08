import React from 'react';
import { Button, Select } from '@pickid/ui';
import { ArrowLeft, Download } from 'lucide-react';
import { cn } from '@/shared/lib/utils';
import type { Test } from '@pickid/supabase';

interface AnalyticsHeaderProps {
	test: Test;
	timeRange: '7d' | '30d' | '90d';
	loading: boolean;
	onTimeRangeChange: (value: '7d' | '30d' | '90d') => void;
	onBack: () => void;
}

export function AnalyticsHeader({ test, timeRange, loading, onTimeRangeChange, onBack }: AnalyticsHeaderProps) {
	return (
		<div className="flex items-center justify-between">
			<div className="flex items-center gap-4">
				<Button variant="outline" size="sm" onClick={onBack} className="flex items-center gap-2">
					<ArrowLeft className="w-4 h-4" />
					뒤로가기
				</Button>
				<div>
					<h1 className="text-2xl font-bold text-gray-900">{test.title}</h1>
					<p className="text-gray-600 mt-1">상세 분석 및 인사이트</p>
				</div>
			</div>

			<div className="flex items-center gap-3">
				<Select value={timeRange} onValueChange={onTimeRangeChange}>
					<option value="7d">7일</option>
					<option value="30d">30일</option>
					<option value="90d">90일</option>
				</Select>
				<Button variant="outline" size="sm">
					<Download className="w-4 h-4" />
				</Button>
			</div>
		</div>
	);
}

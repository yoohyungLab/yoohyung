import { useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@repo/ui';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@repo/ui';

interface ChartData {
	label: string;
	value: number;
	color?: string;
}

interface ResponseChartsProps {
	responses: Array<{
		resultType: string;
		category: string;
		completedAt: string;
		deviceInfo: { isMobile: boolean };
		duration: number;
	}>;
}

// 간단한 막대 차트 컴포넌트
function BarChart({ data, title }: { data: ChartData[]; title: string }) {
	const maxValue = Math.max(...data.map((d) => d.value));

	return (
		<div className="space-y-2">
			<h4 className="font-medium text-sm text-gray-700">{title}</h4>
			<div className="space-y-1">
				{data.map((item, index) => (
					<div key={index} className="flex items-center gap-2">
						<div className="w-20 text-xs text-gray-600 truncate">{item.label}</div>
						<div className="flex-1 bg-gray-200 rounded-full h-6 relative">
							<div
								className={`h-6 rounded-full flex items-center justify-end pr-2 text-xs text-white font-medium ${
									item.color || 'bg-blue-500'
								}`}
								style={{ width: `${(item.value / maxValue) * 100}%` }}
							>
								{item.value}
							</div>
						</div>
					</div>
				))}
			</div>
		</div>
	);
}

// 간단한 파이 차트 컴포넌트
function PieChart({ data, title }: { data: ChartData[]; title: string }) {
	const total = data.reduce((sum, item) => sum + item.value, 0);
	let currentAngle = 0;

	const colors = [
		'bg-blue-500',
		'bg-green-500',
		'bg-yellow-500',
		'bg-red-500',
		'bg-purple-500',
		'bg-pink-500',
		'bg-indigo-500',
		'bg-orange-500',
	];

	return (
		<div className="space-y-4">
			<h4 className="font-medium text-sm text-gray-700">{title}</h4>
			<div className="flex items-center gap-4">
				<div className="relative w-32 h-32">
					<svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
						{data.map((item, index) => {
							const percentage = (item.value / total) * 100;
							const angle = (percentage / 100) * 360;
							const startAngle = currentAngle;
							const endAngle = currentAngle + angle;

							const x1 = 50 + 40 * Math.cos((startAngle * Math.PI) / 180);
							const y1 = 50 + 40 * Math.sin((startAngle * Math.PI) / 180);
							const x2 = 50 + 40 * Math.cos((endAngle * Math.PI) / 180);
							const y2 = 50 + 40 * Math.sin((endAngle * Math.PI) / 180);

							const largeArcFlag = angle > 180 ? 1 : 0;
							const pathData = [`M 50 50`, `L ${x1} ${y1}`, `A 40 40 0 ${largeArcFlag} 1 ${x2} ${y2}`, 'Z'].join(' ');

							currentAngle += angle;

							return (
								<path
									key={index}
									d={pathData}
									fill={`hsl(${index * 45}, 70%, 50%)`}
									className="hover:opacity-80 transition-opacity"
								/>
							);
						})}
					</svg>
				</div>
				<div className="space-y-1">
					{data.map((item, index) => (
						<div key={index} className="flex items-center gap-2 text-xs">
							<div className={`w-3 h-3 rounded-full`} style={{ backgroundColor: `hsl(${index * 45}, 70%, 50%)` }} />
							<span className="text-gray-600">{item.label}</span>
							<span className="font-medium">({item.value})</span>
						</div>
					))}
				</div>
			</div>
		</div>
	);
}

// 라인 차트 컴포넌트
function LineChart({ data, title }: { data: ChartData[]; title: string }) {
	const maxValue = Math.max(...data.map((d) => d.value));
	const minValue = Math.min(...data.map((d) => d.value));
	const range = maxValue - minValue;

	return (
		<div className="space-y-2">
			<h4 className="font-medium text-sm text-gray-700">{title}</h4>
			<div className="h-32 relative">
				<svg viewBox="0 0 100 100" className="w-full h-full">
					<polyline
						fill="none"
						stroke="#3b82f6"
						strokeWidth="2"
						points={data
							.map((item, index) => {
								const x = (index / (data.length - 1)) * 100;
								const y = 100 - ((item.value - minValue) / range) * 100;
								return `${x},${y}`;
							})
							.join(' ')}
					/>
					{data.map((item, index) => {
						const x = (index / (data.length - 1)) * 100;
						const y = 100 - ((item.value - minValue) / range) * 100;
						return <circle key={index} cx={x} cy={y} r="2" fill="#3b82f6" className="hover:r-3 transition-all" />;
					})}
				</svg>
			</div>
			<div className="flex justify-between text-xs text-gray-500">
				{data.map((item, index) => (
					<span key={index} className="truncate">
						{item.label}
					</span>
				))}
			</div>
		</div>
	);
}

export function ResponseCharts({ responses }: ResponseChartsProps) {
	const [activeTab, setActiveTab] = useState('results');

	// 결과 유형별 분포
	const resultTypeData = useMemo(() => {
		const counts: Record<string, number> = {};
		responses.forEach((response) => {
			counts[response.resultType] = (counts[response.resultType] || 0) + 1;
		});

		return Object.entries(counts).map(([label, value]) => ({
			label,
			value,
		}));
	}, [responses]);

	// 카테고리별 분포
	const categoryData = useMemo(() => {
		const counts: Record<string, number> = {};
		responses.forEach((response) => {
			counts[response.category] = (counts[response.category] || 0) + 1;
		});

		return Object.entries(counts).map(([label, value]) => ({
			label,
			value,
		}));
	}, [responses]);

	// 디바이스별 분포
	const deviceData = useMemo(() => {
		const counts = { 모바일: 0, 데스크톱: 0 };
		responses.forEach((response) => {
			counts[response.deviceInfo.isMobile ? '모바일' : '데스크톱']++;
		});

		return Object.entries(counts).map(([label, value]) => ({
			label,
			value,
		}));
	}, [responses]);

	// 일별 응답 수 추이 (최근 7일)
	const dailyData = useMemo(() => {
		const last7Days = Array.from({ length: 7 }, (_, i) => {
			const date = new Date();
			date.setDate(date.getDate() - i);
			return date.toISOString().split('T')[0];
		}).reverse();

		const counts: Record<string, number> = {};
		responses.forEach((response) => {
			const date = response.completedAt.split('T')[0];
			if (last7Days.includes(date)) {
				counts[date] = (counts[date] || 0) + 1;
			}
		});

		return last7Days.map((date) => ({
			label: new Date(date).toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' }),
			value: counts[date] || 0,
		}));
	}, [responses]);

	return (
		<Card>
			<CardHeader>
				<CardTitle>응답 분석 차트</CardTitle>
			</CardHeader>
			<CardContent>
				<Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
					<TabsList className="grid w-full grid-cols-4">
						<TabsTrigger value="results">결과 유형</TabsTrigger>
						<TabsTrigger value="categories">카테고리</TabsTrigger>
						<TabsTrigger value="devices">디바이스</TabsTrigger>
						<TabsTrigger value="trends">일별 추이</TabsTrigger>
					</TabsList>

					<TabsContent value="results" className="mt-4">
						<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
							<BarChart data={resultTypeData} title="결과 유형별 응답 수" />
							<PieChart data={resultTypeData} title="결과 유형별 비율" />
						</div>
					</TabsContent>

					<TabsContent value="categories" className="mt-4">
						<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
							<BarChart data={categoryData} title="카테고리별 응답 수" />
							<PieChart data={categoryData} title="카테고리별 비율" />
						</div>
					</TabsContent>

					<TabsContent value="devices" className="mt-4">
						<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
							<BarChart data={deviceData} title="디바이스별 응답 수" />
							<PieChart data={deviceData} title="디바이스별 비율" />
						</div>
					</TabsContent>

					<TabsContent value="trends" className="mt-4">
						<LineChart data={dailyData} title="최근 7일 응답 수 추이" />
					</TabsContent>
				</Tabs>
			</CardContent>
		</Card>
	);
}

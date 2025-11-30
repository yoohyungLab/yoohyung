import { Card, CardContent, CardHeader, CardTitle, IconButton } from '@pickid/ui';
import { Link } from 'react-router-dom';
import { BarChart3, FileText } from 'lucide-react';
import { formatNumber } from '@/utils/utils';
import type { PopularTest } from '@pickid/supabase';

interface PopularTestsCardProps {
	topTests: PopularTest[];
	renderTrendIcon: (trend: string) => React.ReactNode;
}

export function PopularTestsCard({ topTests, renderTrendIcon }: PopularTestsCardProps) {
	return (
		<Card className="bg-white rounded-xl shadow-sm border border-neutral-200">
			<CardHeader className="p-6 border-b border-neutral-200">
				<CardTitle className="flex items-center justify-between text-xl text-neutral-900">
					<span>오늘의 인기 테스트</span>
					<Link to="/tests">
						<IconButton variant="outline" size="sm" icon={<BarChart3 className="w-4 h-4" />} text="전체 보기" />
					</Link>
				</CardTitle>
			</CardHeader>
			<CardContent className="p-6">
				<div className="space-y-4">
					{topTests.length > 0 ? (
						topTests.map((test, index) => (
							<div
								key={test.id}
								className="flex items-center justify-between p-4 border border-neutral-200 rounded-lg hover:bg-neutral-50 transition-colors"
							>
								<div className="flex items-center gap-4">
									<div className="w-8 h-8 bg-neutral-400 rounded-full flex items-center justify-center">
										<span className="text-white text-sm font-semibold">{index + 1}</span>
									</div>
									<div className="flex items-center gap-3">
										<div className="w-12 h-12 bg-neutral-100 rounded-lg flex items-center justify-center">
											<FileText className="w-6 h-6 text-neutral-600" />
										</div>
										<div>
											<p className="font-medium text-neutral-900">{test.title}</p>
											<p className="text-sm text-neutral-500">오늘 {formatNumber(test.response_count)}명 응답</p>
										</div>
									</div>
								</div>
								<div className="flex items-center gap-3">
									<div className="text-right">
										<p className="text-lg font-bold text-neutral-900">{test.start_count}</p>
										<p className="text-xs text-neutral-500">시작 횟수</p>
									</div>
									{renderTrendIcon('stable')}
								</div>
							</div>
						))
					) : (
						<div className="text-center py-8 text-neutral-500">
							<FileText className="w-12 h-12 mx-auto mb-4 text-neutral-300" />
							<p>아직 테스트 데이터가 없습니다.</p>
							<p className="text-sm">새 테스트를 만들어보세요!</p>
						</div>
					)}
				</div>
			</CardContent>
		</Card>
	);
}

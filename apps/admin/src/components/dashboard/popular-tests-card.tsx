import { Card, CardContent, CardHeader, CardTitle, IconButton } from '@pickid/ui';
import { Link } from 'react-router-dom';
import { BarChart3, FileText } from 'lucide-react';
import { formatNumber } from '@/shared/lib/utils';
import type { PopularTest } from '@pickid/supabase';

interface PopularTestsCardProps {
	topTests: PopularTest[];
	renderTrendIcon: (trend: string) => React.ReactNode;
}

export function PopularTestsCard({ topTests, renderTrendIcon }: PopularTestsCardProps) {
	return (
		<Card>
			<CardHeader>
				<CardTitle className="flex items-center justify-between">
					<span>오늘의 인기 테스트</span>
					<Link to="/tests">
						<IconButton variant="outline" size="sm" icon={<BarChart3 className="w-4 h-4" />} label="전체 보기" />
					</Link>
				</CardTitle>
			</CardHeader>
			<CardContent>
				<div className="space-y-4">
					{topTests.length > 0 ? (
						topTests.map((test, index) => (
							<div key={test.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
								<div className="flex items-center gap-4">
									<span className="text-lg font-bold text-gray-600">#{index + 1}</span>
									<div className="flex items-center gap-2">
										<span className="text-lg">📊</span>
										<div>
											<p className="font-medium text-gray-900">{test.title}</p>
											<p className="text-sm text-gray-500">오늘 {formatNumber(test.response_count)}명 응답</p>
										</div>
									</div>
								</div>
								<div className="flex items-center gap-3">
									<div className="text-right">
										<p className="text-lg font-bold text-gray-900">{test.view_count}</p>
										<p className="text-xs text-gray-500">조회수</p>
									</div>
									{renderTrendIcon('stable')}
								</div>
							</div>
						))
					) : (
						<div className="text-center py-8 text-gray-500">
							<FileText className="w-12 h-12 mx-auto mb-4 text-gray-300" />
							<p>아직 테스트 데이터가 없습니다.</p>
							<p className="text-sm">새 테스트를 만들어보세요!</p>
						</div>
					)}
				</div>
			</CardContent>
		</Card>
	);
}

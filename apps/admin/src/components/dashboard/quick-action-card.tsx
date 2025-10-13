import { Card, CardContent, CardHeader, CardTitle } from '@pickid/ui';
import { Link } from 'react-router-dom';
import { ExternalLink, Plus, Users, FileText } from 'lucide-react';
import { BaseCard, CardContent as BaseCardContent } from '../../../../web/src/shared/ui/cards/base-card';

const quickActions = [
	{
		id: 'create-test',
		title: '새 테스트 만들기',
		description: '템플릿으로 빠르게 생성',
		icon: <Plus className="w-6 h-6 text-blue-600" />,
		href: '/tests/create',
		variant: 'gradient' as const,
	},
	{
		id: 'manage-users',
		title: '사용자 관리',
		description: '사용자 현황 및 관리',
		icon: <Users className="w-6 h-6 text-purple-600" />,
		href: '/users',
		variant: 'default' as const,
	},
	{
		id: 'manage-tests',
		title: '테스트 관리',
		description: '편집 및 설정 변경',
		icon: <FileText className="w-6 h-6 text-green-600" />,
		href: '/tests',
		variant: 'default' as const,
	},
];

export function QuickActionCard() {
	return (
		<Card>
			<CardHeader>
				<CardTitle>빠른 액션</CardTitle>
			</CardHeader>
			<CardContent>
				<div className="space-y-3">
					{quickActions.map((action) => (
						<Link key={action.id} to={action.href}>
							<BaseCard
								variant={action.variant}
								size="md"
								className="hover:scale-[1.02] transition-transform"
							>
								<BaseCardContent padding="lg">
									<div className="flex items-center justify-between">
										<div className="flex items-center gap-3">
											{action.icon}
											<div>
												<p className="font-medium text-gray-900">{action.title}</p>
												<p className="text-sm text-gray-500">{action.description}</p>
											</div>
										</div>
										<ExternalLink className="w-4 h-4 text-gray-400" />
									</div>
								</BaseCardContent>
							</BaseCard>
						</Link>
					))}
				</div>
			</CardContent>
		</Card>
	);
}

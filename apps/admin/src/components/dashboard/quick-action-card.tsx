import { Card, CardContent, CardHeader, CardTitle } from '@pickid/ui';
import { Link } from 'react-router-dom';
import { ExternalLink, Plus, Users, FileText } from 'lucide-react';
import { cn } from '@pickid/shared';

const quickActions = [
	{
		id: 'create-test',
		title: '새 테스트 만들기',
		description: '템플릿으로 빠르게 생성',
		icon: <Plus className="w-5 h-5 text-neutral-600" />,
		href: '/tests/create',
		variant: 'gradient' as const,
	},
	{
		id: 'manage-users',
		title: '사용자 관리',
		description: '사용자 현황 및 관리',
		icon: <Users className="w-5 h-5 text-neutral-600" />,
		href: '/users',
		variant: 'default' as const,
	},
	{
		id: 'manage-tests',
		title: '테스트 관리',
		description: '편집 및 설정 변경',
		icon: <FileText className="w-5 h-5 text-neutral-600" />,
		href: '/tests',
		variant: 'default' as const,
	},
];

const getVariantClasses = (variant: 'default' | 'gradient') => {
	return variant === 'gradient'
		? 'bg-neutral-100 border border-neutral-200 hover:bg-neutral-200'
		: 'bg-white border border-neutral-200 hover:bg-neutral-50';
};

export function QuickActionCard() {
	return (
		<Card className="bg-white rounded-xl shadow-sm border border-neutral-200">
			<CardHeader className="p-6 border-b border-neutral-200">
				<CardTitle className="text-xl text-neutral-900">빠른 액션</CardTitle>
			</CardHeader>
			<CardContent className="p-6">
				<div className="space-y-3">
					{quickActions.map((action) => (
						<Link key={action.id} to={action.href}>
							<div
								className={cn(
									'rounded-lg overflow-hidden transition-all duration-200',
									getVariantClasses(action.variant)
								)}
							>
								<div className="p-4">
									<div className="flex items-center justify-between">
										<div className="flex items-center gap-3">
											<div className="w-10 h-10 bg-neutral-100 rounded-lg flex items-center justify-center">
												{action.icon}
											</div>
											<div>
												<p className="font-medium text-neutral-900">{action.title}</p>
												<p className="text-sm text-neutral-500">{action.description}</p>
											</div>
										</div>
										<ExternalLink className="w-4 h-4 text-neutral-400" />
									</div>
								</div>
							</div>
						</Link>
					))}
				</div>
			</CardContent>
		</Card>
	);
}

import { Card, CardContent, CardHeader, CardTitle } from '@repo/ui';
import { Link } from 'react-router-dom';
import { ExternalLink, Plus, Users, FileText } from 'lucide-react';

const quickActions = [
	{
		title: '새 테스트 만들기',
		description: '템플릿으로 빠르게 생성',
		icon: <Plus className="w-6 h-6 text-blue-600" />,
		href: '/tests/create',
		className:
			'border-2 border-dashed border-blue-300 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-colors',
	},
	{
		title: '사용자 관리',
		description: '사용자 현황 및 관리',
		icon: <Users className="w-6 h-6 text-purple-600" />,
		href: '/users',
		className: 'border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors',
	},
	{
		title: '테스트 관리',
		description: '편집 및 설정 변경',
		icon: <FileText className="w-6 h-6 text-green-600" />,
		href: '/tests',
		className: 'border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors',
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
					{quickActions.map((action, index) => (
						<Link key={index} to={action.href}>
							<button className={`w-full text-left p-4 ${action.className}`}>
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
							</button>
						</Link>
					))}
				</div>
			</CardContent>
		</Card>
	);
}

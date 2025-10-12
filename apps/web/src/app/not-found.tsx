'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function NotFound() {
	const pathname = usePathname();

	// 경로에 따른 동적 메시지
	const getContextualMessage = () => {
		if (pathname?.startsWith('/tests/')) {
			return {
				title: '테스트를 찾을 수 없어요',
				description: '요청하신 테스트가 존재하지 않거나 삭제되었습니다',
				icon: '🔍',
			};
		}
		if (pathname?.startsWith('/category/')) {
			return {
				title: '카테고리를 찾을 수 없어요',
				description: '요청하신 카테고리가 존재하지 않거나 비활성화되었습니다',
				icon: '📂',
			};
		}
		return {
			title: '페이지를 찾을 수 없습니다',
			description: '요청하신 페이지가 존재하지 않거나 이동되었을 수 있습니다',
			icon: '❓',
		};
	};

	const { title, description, icon } = getContextualMessage();

	return (
		<div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
			<div className="text-center max-w-md">
				<div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
					<span className="text-2xl">{icon}</span>
				</div>
				<h1 className="text-2xl font-bold text-gray-900 mb-2">404</h1>
				<h2 className="text-xl font-semibold text-gray-700 mb-2">{title}</h2>
				<p className="text-gray-600 mb-6">{description}</p>
				<div className="space-y-3">
					<Link
						href="/"
						className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background bg-primary text-primary-foreground hover:bg-primary/90 h-10 py-2 px-4 w-full"
					>
						홈으로 이동
					</Link>
					<button
						onClick={() => window.history.back()}
						className="w-full px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
					>
						이전 페이지
					</button>
				</div>
			</div>
		</div>
	);
}

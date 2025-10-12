import Link from 'next/link';

export default function NotFound() {
	return (
		<div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
			<div className="text-center max-w-md">
				<div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
					<svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth={2}
							d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.29-1.009-5.824-2.709M15 6.291A7.962 7.962 0 0012 5c-2.34 0-4.29 1.009-5.824 2.709"
						/>
					</svg>
				</div>
				<h1 className="text-2xl font-bold text-gray-900 mb-2">404</h1>
				<h2 className="text-xl font-semibold text-gray-700 mb-2">페이지를 찾을 수 없습니다</h2>
				<p className="text-gray-600 mb-6">요청하신 페이지가 존재하지 않거나 이동되었을 수 있습니다.</p>
				<Link
					href="/"
					className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background bg-primary text-primary-foreground hover:bg-primary/90 h-10 py-2 px-4 w-full"
				>
					홈으로 이동
				</Link>
			</div>
		</div>
	);
}

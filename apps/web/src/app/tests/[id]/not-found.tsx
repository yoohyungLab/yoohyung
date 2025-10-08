'use client';

import { useRouter } from 'next/navigation';

export default function NotFound() {
	const router = useRouter();

	return (
		<main className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
			<section className="text-center">
				<div className="w-16 h-16 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
					<span className="text-2xl">🔍</span>
				</div>
				<h1 className="text-2xl font-bold text-gray-900 mb-3">테스트를 찾을 수 없어요</h1>
				<p className="text-gray-600 mb-8">요청하신 테스트가 존재하지 않거나 삭제되었습니다</p>
				<div className="space-y-3">
					<button
						onClick={() => router.push('/')}
						className="w-full px-6 py-3 bg-gray-900 text-white font-semibold rounded-lg hover:bg-gray-800 transition-colors"
					>
						홈으로 가기
					</button>
					<button
						onClick={() => router.back()}
						className="w-full px-6 py-3 bg-gray-100 text-gray-700 font-semibold rounded-lg hover:bg-gray-200 transition-colors"
					>
						이전 페이지
					</button>
				</div>
			</section>
		</main>
	);
}

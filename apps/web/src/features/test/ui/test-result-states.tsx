'use client';

import { useRouter } from 'next/navigation';

export function TestResultLoading() {
	return (
		<div className="min-h-screen bg-gradient-to-b from-sky-50 via-white to-blue-100 flex items-center justify-center">
			<div className="w-8 h-8 border-2 border-gray-200 border-t-blue-600 rounded-full animate-spin" />
		</div>
	);
}

export function TestResultError({ error }: { error: string }) {
	const router = useRouter();

	return (
		<div className="min-h-screen bg-gradient-to-b from-sky-50 via-white to-blue-100 flex items-center justify-center p-4">
			<div className="text-center">
				<p className="text-lg font-semibold text-gray-900 mb-4">{error}</p>
				<button onClick={() => router.push('/')} className="text-blue-600 hover:text-blue-700 font-medium text-sm">
					홈으로 돌아가기
				</button>
			</div>
		</div>
	);
}

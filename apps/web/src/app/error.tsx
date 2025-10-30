'use client';
import Link from 'next/link';
import { Button } from '@pickid/ui';
import { AlertCircle, RefreshCw, Home } from 'lucide-react';

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
	return (
		<div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-rose-50 via-pink-50 to-amber-50">
			<div className="w-full max-w-md">
				<div className="bg-white rounded-3xl p-8 shadow-xl">
					{/* Icon */}
					<div className="flex justify-center mb-6">
						<div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
							<AlertCircle className="w-8 h-8 text-red-600" />
						</div>
					</div>

					{/* Title */}
					<h1 className="text-2xl font-bold text-gray-900 text-center mb-3">문제가 발생했어요</h1>

					{/* Message */}
					<p className="text-sm text-gray-600 text-center mb-6">잠시 후 다시 시도하거나 홈으로 이동해 주세요.</p>
					{error?.digest && <p className="text-[11px] text-gray-400 mt-2">오류 코드: {error.digest}</p>}

					{/* Actions */}
					<div className="flex gap-3 justify-center mt-4">
						<Button onClick={reset} className="font-bold rounded-xl">
							<RefreshCw className="w-4 h-4 mr-2" />
							다시 시도
						</Button>
						<Link href="/">
							<Button variant="outline" className="w-full font-bold rounded-xl" size="lg">
								<Home className="w-4 h-4 mr-2" />
								홈으로
							</Button>
						</Link>
					</div>
				</div>

				{/* Additional Info */}
				<p className="text-xs text-gray-500 text-center mt-4">문제가 계속되면 고객센터로 문의해주세요.</p>
			</div>
		</div>
	);
}

'use client';

import { Button } from '@pickid/ui';
import Link from 'next/link';

export default function TestDetailError(props: { error: Error & { digest?: string }; reset: () => void }) {
	const { error, reset } = props;
	return (
		<div className="max-w-lg mx-auto p-6 text-center">
			<h2 className="text-xl font-bold text-gray-900">테스트를 불러오는 중 오류가 발생했어요</h2>
			<p className="text-sm text-gray-600 mt-2">잠시 후 다시 시도하거나 홈으로 이동해 주세요.</p>
			{error?.digest && <p className="text-[11px] text-gray-400 mt-2">오류 코드: {error.digest}</p>}
			<div className="flex gap-3 justify-center mt-4">
				<Button onClick={() => reset()} className="font-bold rounded-xl">
					다시 시도
				</Button>
				<Link href="/" className="inline-block">
					<Button variant="outline" className="font-bold rounded-xl">
						홈으로
					</Button>
				</Link>
			</div>
		</div>
	);
}

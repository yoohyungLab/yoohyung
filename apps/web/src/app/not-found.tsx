'use client';
import { ErrorMessage } from '@pickid/ui';
import { useRouter } from 'next/navigation';
import { ROUTES } from '@/constants';

export default function NotFound() {
	const router = useRouter();
	return (
		<ErrorMessage
			variant="page"
			errorType="not_found"
			title="페이지를 찾을 수 없어요"
			message="요청하신 페이지가 존재하지 않거나 이동되었을 수 있습니다."
			actions={[
				{ label: '홈으로', onClick: () => router.push(ROUTES.HOME), variant: 'outline' },
				{ label: '이전 페이지', onClick: () => router.back(), variant: 'outline' },
			]}
		/>
	);
}

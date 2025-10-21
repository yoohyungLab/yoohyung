import { Metadata } from 'next';
import { MyPageContainer } from '@/features/mypage';
import { generatePageMetadata } from '@/shared/lib/metadata';

export const metadata: Metadata = generatePageMetadata({
	title: '마이페이지',
	description: '내가 참여한 테스트 결과를 모아보세요.',
	path: '/mypage',
});

export default function MyPage() {
	return <MyPageContainer />;
}

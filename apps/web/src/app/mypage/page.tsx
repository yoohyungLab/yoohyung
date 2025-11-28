import { Metadata } from 'next';
import { MyPageContainer } from '@/app/mypage/components';

export const metadata: Metadata = {
	title: '마이페이지',
	description: '내가 참여한 테스트 결과를 모아보세요.',
};

export default function MyPage() {
	return <MyPageContainer />;
}

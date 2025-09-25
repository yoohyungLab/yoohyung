import Link from 'next/link';

interface Feedback {
	id: string;
	name: string;
	content: string;
	rating: number;
	testTitle: string;
}

interface FeedbackSectionProps {
	feedbacks?: Feedback[];
}

export function FeedbackSection({ feedbacks = [] }: FeedbackSectionProps) {
	const defaultFeedbacks = [
		{
			id: '1',
			name: '김민지',
			content: '정말 정확했어요! 제 성격을 정확히 파악해주는 것 같아요.',
			rating: 5,
			testTitle: 'MBTI 테스트',
		},
		{
			id: '2',
			name: '박준호',
			content: '재미있게 테스트했는데 결과가 너무 신기했어요. 추천합니다!',
			rating: 5,
			testTitle: '에겐·테토 테스트',
		},
		{
			id: '3',
			name: '이서연',
			content: '친구들과 함께 해봤는데 정말 재밌었어요. 계속 이용할 예정입니다.',
			rating: 4,
			testTitle: '연애스타일 테스트',
		},
	];

	const feedbackData = feedbacks.length > 0 ? feedbacks : defaultFeedbacks;

	return (
		<section className="mb-12">
			<div className="flex items-center justify-between mb-6">
				<h2 className="text-2xl font-bold text-gray-900">💬 사용자 후기</h2>
				<Link href="/feedback" className="text-blue-600 hover:text-blue-700 font-medium">
					전체보기 →
				</Link>
			</div>
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
				{feedbackData.map((feedback) => (
					<div
						key={feedback.id}
						className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow"
					>
						<div className="flex items-center gap-3 mb-3">
							<div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-400 rounded-full flex items-center justify-center text-white font-bold">
								{feedback.name.charAt(0)}
							</div>
							<div>
								<h4 className="font-semibold text-gray-900">{feedback.name}</h4>
								<div className="flex items-center gap-1">
									{[...Array(5)].map((_, i) => (
										<span key={i} className={`text-sm ${i < feedback.rating ? 'text-yellow-400' : 'text-gray-300'}`}>
											⭐
										</span>
									))}
								</div>
							</div>
						</div>
						<p className="text-gray-600 text-sm mb-3 line-clamp-3">{feedback.content}</p>
						<div className="text-xs text-gray-500">{feedback.testTitle} 테스트 후기</div>
					</div>
				))}
			</div>
		</section>
	);
}

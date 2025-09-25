import Link from 'next/link';
import Image from 'next/image';

interface PopularTest {
	id: string;
	title: string;
	description: string;
	participants: number;
	rating: number;
	image: string;
}

interface PopularTestSectionProps {
	tests?: PopularTest[];
}

export function PopularTestSection({ tests = [] }: PopularTestSectionProps) {
	const defaultTests = [
		{
			id: 'personality-color',
			title: '성격 색깔 테스트',
			description: '당신의 성격을 색깔로 표현해보세요',
			participants: 125000,
			rating: 4.8,
			image: '/images/egen-teto/thumbnail.png',
		},
		{
			id: 'love-language',
			title: '사랑의 언어 테스트',
			description: '당신의 사랑 표현 방식을 알아보세요',
			participants: 98000,
			rating: 4.7,
			image: '/images/egen-teto/thumbnail.png',
		},
		{
			id: 'stress-type',
			title: '스트레스 유형 테스트',
			description: '어떤 상황에서 스트레스를 받는지 확인해보세요',
			participants: 87000,
			rating: 4.6,
			image: '/images/egen-teto/thumbnail.png',
		},
	];

	const testData = tests.length > 0 ? tests : defaultTests;

	return (
		<section className="mb-12">
			<div className="flex items-center justify-between mb-6">
				<h2 className="text-2xl font-bold text-gray-900">⭐ 인기 테스트</h2>
				<Link href="/tests/popular" className="text-blue-600 hover:text-blue-700 font-medium">
					전체보기 →
				</Link>
			</div>
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
				{testData.map((test) => (
					<Link
						key={test.id}
						href={`/tests/${test.id}`}
						className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow group block"
					>
						<div className="aspect-[4/3] relative overflow-hidden">
							<Image
								src={test.image}
								alt={test.title}
								fill
								className="object-cover group-hover:scale-105 transition-transform duration-300"
							/>
							<div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
							<div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full">
								<span className="text-xs font-medium text-gray-700">⭐ {test.rating}</span>
							</div>
						</div>
						<div className="p-4">
							<h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
								{test.title}
							</h3>
							<p className="text-sm text-gray-600 mb-3 line-clamp-2">{test.description}</p>
							<div className="flex items-center justify-between text-sm text-gray-500">
								<span>{test.participants.toLocaleString()}명 참여</span>
								<span className="text-blue-600 font-medium">시작하기 →</span>
							</div>
						</div>
					</Link>
				))}
			</div>
		</section>
	);
}

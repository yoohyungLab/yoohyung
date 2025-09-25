import Link from 'next/link';

export function MainBanner() {
	return (
		<section className="text-center space-y-6 animate-fade-in-up pb-10">
			<div className="inline-block px-4 py-1.5 text-xs font-medium bg-pink-100 text-pink-700 rounded-full tracking-widest uppercase">
				self insight
			</div>
			<h1 className="text-4xl font-bold text-gray-900 leading-tight">
				심리로 파헤치는 나의 성향,
				<br />
				지금 바로 테스트해보세요!
			</h1>
			<p className="text-base text-gray-600 leading-relaxed max-w-md mx-auto">
				감성, 성격, 연애까지.
				<br />
				흥미롭고 가벼운 테스트를 통해 나를 재발견해보세요.
			</p>
			<div className="flex justify-center gap-4">
				<Link
					href="/tests"
					className="bg-pink-500 text-white font-semibold px-6 py-3 rounded-full transition-all shadow-lg"
				>
					전체 테스트 보기
				</Link>
			</div>
		</section>
	);
}

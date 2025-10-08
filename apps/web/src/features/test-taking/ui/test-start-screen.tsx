import Image from 'next/image';
import { useCountAnimation } from '@/shared/hooks';
import type { TestWithNestedDetails } from '@pickid/supabase';
import type { ColorTheme } from '../themes';

interface TestStartScreenProps {
	test: TestWithNestedDetails;
	onStart: () => void;
	theme: ColorTheme;
}

export function TestStartScreen({ test, onStart, theme }: TestStartScreenProps) {
	const viewCount = test?.test?.view_count || 34595;
	const { count: animatedCount, isAnimating } = useCountAnimation(viewCount, 2000);

	return (
		<main className={`min-h-screen flex items-center justify-center px-4 bg-gradient-to-br ${theme.gradient}`}>
			<article className="w-full max-w-[420px] bg-white rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden">
				{/* 배경 장식 */}
				<div className={`absolute top-0 right-0 w-32 h-32 bg-${theme.accent}-300 rounded-full blur-3xl opacity-30`} />
				<div
					className={`absolute bottom-0 left-0 w-32 h-32 bg-${theme.primary}-300 rounded-full blur-3xl opacity-30`}
				/>

				{/* 썸네일 */}
				{test?.test?.thumbnail_url && (
					<figure className="relative w-full aspect-square mb-6 rounded-3xl overflow-hidden shadow-xl">
						<Image src={test.test.thumbnail_url} alt={test.test.title || '테스트'} fill className="object-cover" />
					</figure>
				)}

				{/* 제목과 설명 */}
				<header className="text-center mb-6">
					<h1 className="text-2xl font-black mb-4 text-gray-800 leading-tight">{test?.test?.title || '테스트'}</h1>
					{test?.test?.description && <p className="text-sm text-gray-600 leading-relaxed">{test.test.description}</p>}
				</header>

				{/* 참여자 수 표시 */}
				<section
					className={`bg-gradient-to-r ${theme.gradient} rounded-2xl p-5 mb-6 text-center relative overflow-hidden`}
				>
					<div className="flex items-baseline justify-center gap-2 mb-1">
						<span className="text-xs font-bold text-gray-600">지금까지</span>
						<span
							className={`text-3xl font-black ${
								theme.name === 'purple'
									? 'bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent'
									: theme.name === 'blue'
									? 'bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent'
									: theme.name === 'green'
									? 'bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent'
									: theme.name === 'orange'
									? 'bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent'
									: 'bg-gradient-to-r from-red-600 to-rose-600 bg-clip-text text-transparent'
							} ${isAnimating ? 'animate-pulse' : ''}`}
						>
							{animatedCount.toLocaleString()}
						</span>
						<span className="text-xs font-bold text-gray-600">명</span>
					</div>
					<p className="text-xs font-bold text-gray-500">참여 중이에요!</p>
				</section>

				{/* 시작 버튼 */}
				<button
					onClick={onStart}
					className={`w-full bg-gradient-to-r ${theme.button} bg-[length:200%_100%] text-white font-black py-5 rounded-2xl hover:bg-right transition-all duration-500 shadow-xl hover:shadow-2xl active:scale-98 text-lg animate-gradient`}
				>
					시작하기
				</button>

				{/* 소요 시간 */}
				{test?.test?.estimated_time && (
					<p className="text-xs text-center text-gray-400 mt-4">소요 시간: 약 {test.test.estimated_time}분</p>
				)}
			</article>
		</main>
	);
}

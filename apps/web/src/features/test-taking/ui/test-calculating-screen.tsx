import type { ColorTheme } from '../themes';

interface TestCalculatingScreenProps {
	theme: ColorTheme;
}

export function TestCalculatingScreen({ theme }: TestCalculatingScreenProps) {
	return (
		<main className={`min-h-screen flex items-center justify-center px-4 bg-gradient-to-br ${theme.gradient}`}>
			<article className="w-full max-w-[420px] bg-white rounded-[2.5rem] p-8 shadow-2xl text-center">
				{/* 로딩 스피너 */}
				<div className="relative mb-6">
					<div className={`w-20 h-20 mx-auto rounded-full border-4 border-${theme.primary}-200`}>
						<div
							className={`w-full h-full rounded-full border-4 border-${theme.primary}-500 border-t-transparent animate-spin`}
						/>
					</div>
					<div className="absolute inset-0 flex items-center justify-center text-2xl">
						<span className="animate-pulse">🧠</span>
					</div>
				</div>

				{/* 제목과 설명 */}
				<header className="mb-4">
					<h1 className="text-2xl font-black mb-3 text-gray-800">결과를 분석 중이에요</h1>
					<p className="text-sm text-gray-600">잠시만 기다려주세요...</p>
				</header>

				{/* 진행률 바 */}
				<div className="w-full bg-gray-200 rounded-full h-2 mb-4">
					<div
						className={`h-2 bg-gradient-to-r ${theme.progress} rounded-full animate-pulse`}
						style={{ width: '60%' }}
					/>
				</div>

				<p className="text-xs text-gray-500">당신의 답변을 바탕으로 정확한 결과를 계산하고 있어요</p>
			</article>
		</main>
	);
}

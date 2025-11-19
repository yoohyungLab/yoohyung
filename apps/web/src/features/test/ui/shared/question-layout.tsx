import { ChevronLeft } from 'lucide-react';
import type { ReactNode } from 'react';
import type { ColorTheme } from '../../lib/themes';

interface QuestionLayoutProps {
	current: number;
	total: number;
	percentage: number;
	onPrevious?: () => void;
	theme: ColorTheme;
	children: ReactNode;
}

export function QuestionLayout(props: QuestionLayoutProps) {
	const { current, total, percentage, onPrevious, theme, children } = props;

	return (
		<div className={`min-h-screen flex items-center justify-center px-4 py-8 bg-gradient-to-br ${theme.gradient}`}>
			<article className="w-full max-w-[420px] bg-white rounded-[2rem] p-6 shadow-2xl relative overflow-hidden">
				<header className="relative mb-6">
					<div className="flex items-center justify-between mb-3">
						<span className="text-xs font-bold text-gray-700">
							{current} / {total}
						</span>
						{onPrevious && (
							<button
								onClick={onPrevious}
								className="flex items-center gap-1 px-3 py-1.5 bg-gray-100 text-gray-700 rounded-full text-xs font-bold hover:bg-gray-200 active:scale-95 transition-all cursor-pointer"
							>
								<ChevronLeft className="w-3 h-3" />
								이전
							</button>
						)}
					</div>
					<div className="h-3 bg-gray-100 rounded-full overflow-hidden">
						<div
							className={`h-full bg-gradient-to-r ${theme.progress} rounded-full transition-all duration-500`}
							style={{ width: `${percentage}%` }}
						/>
					</div>
				</header>

				{children}
			</article>
		</div>
	);
}

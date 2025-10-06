'use client';

interface LoadingProps {
	message?: string;
	fullScreen?: boolean;
	className?: string;
}

export function Loading({ message = '로딩 중...', fullScreen = false, className = '' }: LoadingProps) {
	const loadingContent = (
		<div className={`text-center ${className}`}>
			<div className="w-8 h-8 border-2 border-purple-200 border-t-purple-600 rounded-full animate-spin mx-auto mb-4"></div>
			<p className="text-gray-600">{message}</p>
		</div>
	);

	if (fullScreen) {
		return (
			<div className="fixed inset-0 z-50 bg-white/80 backdrop-blur-sm flex items-center justify-center">
				{loadingContent}
			</div>
		);
	}

	return loadingContent;
}

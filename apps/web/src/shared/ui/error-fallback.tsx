'use client';

import { Button } from '@pickid/ui';
import { AlertCircle, Home, RefreshCw } from 'lucide-react';

interface IErrorFallbackProps {
	error?: Error & { digest?: string };
	reset?: () => void;
	title?: string;
	message?: string;
	showHomeButton?: boolean;
}

export function ErrorFallback(props: IErrorFallbackProps) {
	const {
		error,
		reset,
		title = '문제가 발생했어요',
		message = '일시적인 오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
		showHomeButton = true,
	} = props;

	const handleGoHome = () => {
		window.location.href = '/';
	};

	return (
		<div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-rose-50 via-pink-50 to-amber-50">
			<div className="w-full max-w-md">
				<div className="bg-white rounded-3xl p-8 shadow-xl">
					{/* Icon */}
					<div className="flex justify-center mb-6">
						<div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
							<AlertCircle className="w-8 h-8 text-red-600" />
						</div>
					</div>

					{/* Title */}
					<h1 className="text-2xl font-bold text-gray-900 text-center mb-3">{title}</h1>

					{/* Message */}
					<p className="text-sm text-gray-600 text-center mb-6">{message}</p>

					{/* Error Details (Development) */}
					{process.env.NODE_ENV === 'development' && error && (
						<details className="mb-6">
							<summary className="text-xs text-gray-500 cursor-pointer hover:text-gray-700 mb-2">
								개발자 정보 보기
							</summary>
							<div className="bg-gray-50 rounded-lg p-4 text-xs font-mono text-gray-700 overflow-auto max-h-40">
								<div className="mb-2">
									<span className="font-bold">Error:</span> {error.message}
								</div>
								{error.digest && (
									<div>
										<span className="font-bold">Digest:</span> {error.digest}
									</div>
								)}
							</div>
						</details>
					)}

					{/* Actions */}
					<div className="flex flex-col gap-2">
						{reset && (
							<Button onClick={reset} className="w-full font-bold rounded-xl" size="lg">
								<RefreshCw className="w-4 h-4 mr-2" />
								다시 시도
							</Button>
						)}
						{showHomeButton && (
							<Button onClick={handleGoHome} variant="outline" className="w-full font-bold rounded-xl" size="lg">
								<Home className="w-4 h-4 mr-2" />
								홈으로 이동
							</Button>
						)}
					</div>
				</div>

				{/* Additional Info */}
				<p className="text-xs text-gray-500 text-center mt-4">
					문제가 계속되면 고객센터로 문의해주세요.
				</p>
			</div>
		</div>
	);
}

import { Loader2 } from 'lucide-react';

interface ITestLoadingProps {
	message?: string;
	description?: string;
}

export function TestLoading({ message = '테스트 준비 중...', description = '금방 시작할게요!' }: ITestLoadingProps) {
	return (
		<main className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-b from-sky-50 via-white to-blue-100">
			<div className="w-full max-w-[420px] text-center">
				<div className="flex justify-center mb-4">
					<Loader2 className="w-12 h-12 text-blue-500 animate-spin" />
				</div>
				<h1 className="text-2xl font-bold text-gray-900 mb-3">{message}</h1>
				<p className="text-base text-gray-600">{description}</p>
			</div>
		</main>
	);
}

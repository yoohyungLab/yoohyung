import { ReactNode } from 'react';
import Image from 'next/image';

interface AuthLayoutProps {
	title: string;
	subtitle: string;
	children: ReactNode;
	showLogo?: boolean;
}

// 공통 인증 레이아웃 컴포넌트 (Server Component)
export function AuthLayout({ title, subtitle, children, showLogo = false }: AuthLayoutProps) {
	return (
		<div className="min-h-screen flex items-center justify-center p-4">
			{/* 배경 장식 */}
			<div className="fixed inset-0 overflow-hidden pointer-events-none">
				<div className="absolute top-20 left-10 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"></div>
				<div className="absolute top-40 right-10 w-72 h-72 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>
				<div className="absolute -bottom-8 left-1/2 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-4000"></div>
			</div>

			<div className="w-full max-w-md relative z-10">
				<div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/20">
					{/* 로고 및 제목 */}
					<div className="text-center mb-8">
						{showLogo && (
							<Image src="/icons/logo.svg" alt="로고" width={80} height={80} className="inline-block mb-4" />
						)}
						<h1 className="text-2xl font-bold text-gray-900">{title}</h1>
						<p className="text-gray-600 mt-2">{subtitle}</p>
					</div>

					{/* 컨텐츠 */}
					{children}
				</div>
			</div>
		</div>
	);
}


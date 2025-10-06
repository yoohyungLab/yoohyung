// src/App.tsx
'use client';

import { ReactNode } from 'react';
import { Footer } from '@/widgets/footer';
import Sidebar from '@/widgets/sidebar';

interface AppProps {
	children: ReactNode;
}

export default function App({ children }: AppProps) {
	return (
		<>
			{/* 메인 컨테이너 */}
			<div className="w-full max-w-mobile mx-auto bg-white/80 backdrop-blur-sm shadow-2xl min-h-screen relative">
				{/* 상단 그라데이션 라인 */}
				<div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500" />

				{/* ✅ Sidebar가 자체적으로 open/close 상태 관리 */}
				<Sidebar />

				{/* 페이지 컨텐츠 */}
				<main className="min-h-screen">{children}</main>

				<Footer />
			</div>
		</>
	);
}

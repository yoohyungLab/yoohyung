'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { Footer } from '@/components/layout/footer';
import { Header } from '@/components/layout/header';
import { SidebarDrawer } from '@/components/layout/sidebar-drawer';
import { ReactNode } from 'react';

interface AppProps {
	children: ReactNode;
}

export default function App({ children }: AppProps) {
	const [isDrawerOpen, setIsDrawerOpen] = useState(false);
	const pathname = usePathname();

	// 메인 페이지에서만 Footer 표시
	const showFooter = pathname === '/';

	const handleMenuOpen = () => {
		setIsDrawerOpen(true);
	};

	const handleDrawerOpenChange = (open: boolean) => {
		setIsDrawerOpen(open);
	};

	return (
		<div className="w-full max-w-mobile mx-auto bg-white/80 backdrop-blur-sm shadow-2xl min-h-screen relative">
			{/* 상단 그라데이션 라인 */}
			<div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-rose-500 via-pink-500 to-rose-500" />

			{/* 헤더 */}
			<Header onMenuOpen={handleMenuOpen} />

			{/* 페이지 컨텐츠 */}
			<main className="min-h-screen">{children}</main>

			{/* 푸터 - 메인 페이지에서만 표시 */}
			{showFooter && <Footer />}

			{/* 사이드바 드로워 */}
			<SidebarDrawer isOpen={isDrawerOpen} onOpenChange={handleDrawerOpenChange} />
		</div>
	);
}

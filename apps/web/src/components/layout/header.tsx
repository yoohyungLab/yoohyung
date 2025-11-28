'use client';

import { Button } from '@pickid/ui';
import { Menu, ChevronLeft } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState, useRef } from 'react';

interface HeaderProps {
	onMenuOpen: () => void;
}

export function Header({ onMenuOpen }: HeaderProps) {
	const router = useRouter();
	const pathname = usePathname();
	const [isVisible, setIsVisible] = useState(true);
	const lastScrollY = useRef(0);

	// 메인 페이지 또는 결과 공유 페이지에서는 로고 표시
	const isMainPage = pathname === '/';
	const isResultSharePage = pathname?.startsWith('/tests/') && pathname?.includes('/result');
	const showLogo = isMainPage || isResultSharePage;

	const handleBackClick = () => {
		router.back();
	};

	useEffect(() => {
		const handleScroll = () => {
			const currentScrollY = window.scrollY;

			// 최상단에서는 항상 표시
			if (currentScrollY < 10) {
				setIsVisible(true);
				lastScrollY.current = currentScrollY;
				return;
			}

			// 스크롤 다운 → 숨김, 스크롤 업 → 표시
			if (currentScrollY > lastScrollY.current) {
				setIsVisible(false);
			} else {
				setIsVisible(true);
			}

			lastScrollY.current = currentScrollY;
		};

		window.addEventListener('scroll', handleScroll, { passive: true });
		return () => window.removeEventListener('scroll', handleScroll);
	}, []);

	return (
		<div
			className="sticky top-0 z-50 bg-white border-b border-gray-200 px-4 py-2 transition-transform duration-300 ease-in-out"
			style={{ transform: isVisible ? 'translateY(0)' : 'translateY(-100%)' }}
		>
			<div className="flex items-center justify-between h-[70px]">
				{showLogo ? (
					<Link href="/" className="flex items-center space-x-2 h-[70px]">
						<Image src="/icons/logo.svg" alt="로고" width={70} height={70} priority unoptimized />
					</Link>
				) : (
					<button className="h-6 w-6 hover:bg-transparent" onClick={handleBackClick}>
						<ChevronLeft className="size-6" />
					</button>
				)}

				<Button variant="ghost" size="sm" className="p-2 -mr-2 hover:bg-transparent" onClick={onMenuOpen}>
					<Menu className="w-5 h-5" />
				</Button>
			</div>
		</div>
	);
}

'use client';

import { Button } from '@pickid/ui';
import { Menu } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

interface HeaderProps {
	onMenuOpen: () => void;
}

export function Header({ onMenuOpen }: HeaderProps) {
	return (
		<div className="sticky top-0 z-50 bg-white border-b border-gray-200 px-4 py-3">
			<div className="flex items-center justify-between">
				<Link href="/" className="flex items-center space-x-2">
					<Image src="/icons/logo.svg" alt="로고" width={70} height={70} priority />
				</Link>

				<Button variant="outline" size="sm" className="p-2" onClick={onMenuOpen}>
					<Menu className="w-4 h-4" />
				</Button>
			</div>
		</div>
	);
}

'use client';

import { Drawer, DrawerClose, DrawerContent, DrawerHeader, DrawerTitle, Button } from '@pickid/ui';
import { X } from 'lucide-react';
import { AuthSection } from './auth-section';
import { MenuContent } from './menu-content';

interface SidebarDrawerProps {
	isOpen: boolean;
	onOpenChange: (open: boolean) => void;
}

export function SidebarDrawer({ isOpen, onOpenChange }: SidebarDrawerProps) {
	const handleMenuClick = () => {
		onOpenChange(false);
		// 라우터 이동은 각 컴포넌트에서 처리
	};

	return (
		<Drawer open={isOpen} onOpenChange={onOpenChange}>
			<DrawerContent className="max-w-mobile mx-auto">
				<DrawerHeader className="text-left">
					<DrawerTitle className="flex items-center justify-between">
						<span>메뉴</span>
						<DrawerClose asChild>
							<Button variant="ghost" size="sm" className="p-2">
								<X className="w-4 h-4" />
							</Button>
						</DrawerClose>
					</DrawerTitle>
				</DrawerHeader>
				<div className="px-6 py-6">
					<AuthSection onMenuClose={() => onOpenChange(false)} />
					<MenuContent onMenuClick={handleMenuClick} />
				</div>
			</DrawerContent>
		</Drawer>
	);
}

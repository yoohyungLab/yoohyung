'use client';

import { Drawer, DrawerContent, DrawerTitle } from '@pickid/ui';
import { AuthSection } from './auth-section';

interface SidebarDrawerProps {
	isOpen: boolean;
	onOpenChange: (open: boolean) => void;
}

export function SidebarDrawer({ isOpen, onOpenChange }: SidebarDrawerProps) {
	return (
		<Drawer open={isOpen} onOpenChange={onOpenChange}>
			<DrawerContent className="max-w-mobile mx-auto flex flex-col h-full">
				<DrawerTitle className="sr-only">메뉴</DrawerTitle>
				<AuthSection onMenuClose={() => onOpenChange(false)} />
			</DrawerContent>
		</Drawer>
	);
}

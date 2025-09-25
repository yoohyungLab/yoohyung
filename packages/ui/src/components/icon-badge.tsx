import React from 'react';
import { Badge, type BadgeProps } from './badge';
import { cn } from '../lib/utils';

interface IconBadgeProps extends Omit<BadgeProps, 'children'> {
	icon: React.ReactNode;
	text: string;
	className?: string;
}

export const IconBadge = ({ icon, text, className, variant = 'outline', ...props }: IconBadgeProps) => {
	return (
		<Badge variant={variant} className={cn('flex items-center gap-1', className)} {...props}>
			{icon}
			<span>{text}</span>
		</Badge>
	);
};

IconBadge.displayName = 'IconBadge';

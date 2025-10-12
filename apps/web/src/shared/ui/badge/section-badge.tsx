import { cn } from '@/shared/lib/utils';

interface SectionBadgeProps {
	children: React.ReactNode;
	variant?: 'default' | 'popular' | 'new' | 'recommended' | 'trending';
	className?: string;
}

const badgeVariants = {
	default: 'bg-gray-100 text-gray-700',
	popular: 'bg-red-100 text-red-700',
	new: 'bg-green-100 text-green-700',
	recommended: 'bg-blue-100 text-blue-700',
	trending: 'bg-purple-100 text-purple-700',
};

export function SectionBadge({ children, variant = 'default', className }: SectionBadgeProps) {
	return (
		<span
			className={cn(
				'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
				badgeVariants[variant],
				className
			)}
		>
			{children}
		</span>
	);
}

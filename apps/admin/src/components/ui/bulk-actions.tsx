import React from 'react';
import { Button } from '@pickid/ui';
import { cn } from '@/shared/lib/utils';
import { X } from 'lucide-react';

export interface BulkAction {
	id: string;
	label: string;
	variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
	onClick: () => void;
	className?: string;
	disabled?: boolean;
}

export interface BulkActionsProps {
	selectedCount: number;
	actions: BulkAction[];
	className?: string;
	onClear?: () => void;
	showClear?: boolean;
}

export function BulkActions({ selectedCount, actions, className, onClear, showClear = true }: BulkActionsProps) {
	if (selectedCount === 0) return null;

	return (
		<div className={cn('flex items-center justify-between rounded-md border bg-muted/50 px-4 py-3', className)}>
			<div className="flex items-center gap-2">
				<span className="text-sm font-medium text-foreground">{selectedCount}개 항목 선택됨</span>
			</div>

			<div className="flex items-center gap-2 bg-white">
				{actions.map((action) => (
					<Button
						key={action.id}
						size="sm"
						variant={action.variant || 'outline'}
						onClick={action.onClick}
						disabled={action.disabled}
						className={cn(action.className)}
					>
						{action.label}
					</Button>
				))}

				{showClear && onClear && (
					<Button
						size="sm"
						variant="ghost"
						onClick={onClear}
						className="h-8 px-2 text-muted-foreground hover:text-foreground"
					>
						<X className="h-4 w-4 mr-1" />
						선택 해제
					</Button>
				)}
			</div>
		</div>
	);
}

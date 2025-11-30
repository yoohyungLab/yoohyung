import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './select';
import { cn } from '@pickid/shared';

export interface SelectOption {
	value: string;
	label: string;
	disabled?: boolean;
}

export interface DefaultSelectProps {
	value?: string;
	onValueChange?: (value: string) => void;
	options: SelectOption[];
	placeholder?: string;
	disabled?: boolean;
	className?: string;
	size?: 'sm' | 'md' | 'lg';
	variant?: 'default' | 'outline' | 'ghost';
	label?: string;
	required?: boolean;
	error?: string;
	helperText?: string;
}

const sizeClasses = {
	sm: 'h-8 text-xs px-2',
	md: 'h-10 text-sm px-3',
	lg: 'h-12 text-base px-4',
};

const variantClasses = {
	default: 'border-slate-200 bg-white hover:bg-slate-50',
	outline: 'border-2 border-slate-300 bg-white hover:border-slate-400',
	ghost: 'border-transparent bg-transparent hover:bg-slate-100',
};

export const DefaultSelect = ({
	value,
	onValueChange,
	options,
	placeholder = '선택하세요',
	disabled,
	className,
	size = 'md',
	variant = 'default',
	label,
	required,
	error,
	helperText,
	...props
}: DefaultSelectProps) => {
	const selectId = `select-${Math.random().toString(36).substr(2, 9)}`;

	return (
		<div className="space-y-2">
			{label && (
				<label htmlFor={selectId} className="text-sm font-medium text-gray-700">
					{label} {required && <span className="text-red-500">*</span>}
				</label>
			)}
			<Select value={value} onValueChange={onValueChange} disabled={disabled}>
				<SelectTrigger
					id={selectId}
					className={cn(
						sizeClasses[size],
						variantClasses[variant],
						'transition-colors duration-200',
						disabled && 'cursor-not-allowed opacity-50',
						error && 'border-red-500 focus:border-red-500 focus:ring-red-500',
						className
					)}
					{...props}
				>
					<SelectValue placeholder={placeholder} />
				</SelectTrigger>
				<SelectContent
					position="popper"
					sideOffset={5}
					className={cn(
						'z-50 w-[var(--radix-select-trigger-width)] min-w-[var(--radix-select-trigger-width)] max-w-[var(--radix-select-trigger-width)] overflow-hidden rounded-md border bg-white text-gray-900 shadow-md'
					)}
				>
					{options.map((option) => (
						<SelectItem key={option.value} value={option.value} disabled={option.disabled} className="cursor-pointer">
							{option.label}
						</SelectItem>
					))}
				</SelectContent>
			</Select>
			{error && <p className="text-sm text-red-500">{error}</p>}
			{helperText && !error && <p className="text-sm text-gray-500">{helperText}</p>}
		</div>
	);
};

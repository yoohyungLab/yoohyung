import * as React from 'react';
import { Input } from './input';
import { cn } from '../../lib/utils';

export interface DefaultInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
	label?: string;
	required?: boolean;
	error?: string;
	helperText?: string;
}

export function DefaultInput({ className, label, required, error, helperText, id, ...props }: DefaultInputProps) {
	const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;

	return (
		<div className="space-y-2">
			{label && (
				<label htmlFor={inputId} className="text-sm font-medium text-gray-700">
					{label} {required && <span className="text-red-500">*</span>}
				</label>
			)}
			<Input
				id={inputId}
				className={cn(error && 'border-red-500 focus:border-red-500 focus:ring-red-500', className)}
				{...props}
			/>
			{error && <p className="text-sm text-red-500">{error}</p>}
			{helperText && !error && <p className="text-xs text-gray-500">{helperText}</p>}
		</div>
	);
}

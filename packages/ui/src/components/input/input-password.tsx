import * as React from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { Input } from './input';
import { cn } from '@pickid/shared';

export interface InputPasswordProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
	label?: string;
	required?: boolean;
	error?: string;
	helperText?: string;
}

export function InputPassword({ className, label, required, error, helperText, id, ...props }: InputPasswordProps) {
	const [showPassword, setShowPassword] = React.useState(false);
	const inputId = id || `input-password-${Math.random().toString(36).substr(2, 9)}`;

	const togglePasswordVisibility = () => {
		setShowPassword(!showPassword);
	};

	return (
		<div className="space-y-2">
			{label && (
				<label htmlFor={inputId} className="text-sm font-medium text-gray-700">
					{label} {required && <span className="text-red-500">*</span>}
				</label>
			)}
			<div className="relative">
				<Input
					id={inputId}
					type={showPassword ? 'text' : 'password'}
					className={cn('pr-10', error && 'border-red-500 focus:border-red-500 focus:ring-red-500', className)}
					{...props}
				/>
				<button
					type="button"
					onClick={togglePasswordVisibility}
					className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 rounded-sm"
					aria-label={showPassword ? '비밀번호 숨기기' : '비밀번호 보기'}
				>
					{showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
				</button>
			</div>
			{error && <p className="text-sm text-red-500">{error}</p>}
			{helperText && !error && <p className="text-xs text-gray-500">{helperText}</p>}
		</div>
	);
}

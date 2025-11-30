import React from 'react';
import { Button, type ButtonProps } from './button';
import { Switch } from './switch';
import { cn } from '@pickid/shared';

interface IconButtonProps extends Omit<ButtonProps, 'children'> {
	icon: React.ReactNode;
	text?: string;
	'aria-label'?: string;
	switch?: boolean;
	switchChecked?: boolean;
	onSwitchChange?: (checked: boolean) => void;
}

export const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
	(
		{
			icon,
			text,
			className,
			'aria-label': ariaLabel,
			switch: isSwitch,
			switchChecked,
			onSwitchChange,
			variant,
			...props
		},
		ref
	) => {
		if (isSwitch) {
			return (
				<div className="flex items-center justify-between">
					<div className="flex items-center space-x-2">
						{icon}
						{text && <span className="text-sm font-medium">{text}</span>}
					</div>
					<Switch checked={switchChecked} onCheckedChange={onSwitchChange} />
				</div>
			);
		}

		return (
			<Button
				ref={ref}
				variant={variant}
				className={cn(variant === 'kakao' ? '' : 'p-2', className)}
				aria-label={ariaLabel || text}
				{...props}
			>
				{variant === 'kakao' ? (
					<div className="flex items-center justify-center space-x-2">
						{icon}
						{text && <span>{text}</span>}
					</div>
				) : (
					<>
						{icon}
						{text && <span className="ml-2">{text}</span>}
					</>
				)}
			</Button>
		);
	}
);

IconButton.displayName = 'IconButton';

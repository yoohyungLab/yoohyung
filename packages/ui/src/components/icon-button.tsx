import React from 'react';
import { Button, type ButtonProps } from './button';
import { Switch } from './switch';
import { cn } from '../lib/utils';

interface IconButtonProps extends Omit<ButtonProps, 'children'> {
	icon: React.ReactNode;
	label?: string;
	'aria-label'?: string;
	switch?: boolean;
	switchChecked?: boolean;
	onSwitchChange?: (checked: boolean) => void;
}

export const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
	(
		{ icon, label, className, 'aria-label': ariaLabel, switch: isSwitch, switchChecked, onSwitchChange, ...props },
		ref
	) => {
		if (isSwitch) {
			return (
				<div className="flex items-center justify-between">
					<div className="flex items-center space-x-2">
						{icon}
						{label && <span className="text-sm font-medium">{label}</span>}
					</div>
					<Switch checked={switchChecked} onCheckedChange={onSwitchChange} />
				</div>
			);
		}

		return (
			<Button ref={ref} className={cn('p-2', className)} aria-label={ariaLabel || label} {...props}>
				{icon}
				{label && <span className="ml-2">{label}</span>}
			</Button>
		);
	}
);

IconButton.displayName = 'IconButton';

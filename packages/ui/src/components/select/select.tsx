'use client';

import * as React from 'react';
import * as SelectPrimitive from '@radix-ui/react-select';
import { Check, ChevronDown, ChevronUp } from 'lucide-react';

import { cn } from '@pickid/shared';

function Select({ ...props }: React.ComponentProps<typeof SelectPrimitive.Root>) {
	return <SelectPrimitive.Root {...props} />;
}

function SelectGroup({ ...props }: React.ComponentProps<typeof SelectPrimitive.Group>) {
	return <SelectPrimitive.Group {...props} />;
}

function SelectValue({ ...props }: React.ComponentProps<typeof SelectPrimitive.Value>) {
	return <SelectPrimitive.Value {...props} />;
}

function SelectTrigger({
	className,
	size = 'default',
	children,
	...props
}: React.ComponentProps<typeof SelectPrimitive.Trigger> & {
	size?: 'sm' | 'default' | 'lg';
}) {
	return (
		<SelectPrimitive.Trigger
			className={cn(
				// 기본 스타일
				'flex items-center justify-between w-full rounded-md border transition-all duration-200',
				'bg-white hover:bg-gray-50 focus:bg-white',
				'border-gray-300 hover:border-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20',
				'text-gray-900 placeholder:text-gray-500',
				'disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-100',
				'outline-none',

				// 크기별 스타일
				{
					'h-8 px-2 text-sm': size === 'sm',
					'h-10 px-3 text-sm': size === 'default',
					'h-12 px-4 text-base': size === 'lg',
				},

				// 다크 모드
				'dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:bg-gray-800',
				'dark:border-gray-600 dark:hover:border-gray-500 dark:focus:border-blue-400',
				'dark:text-gray-100 dark:placeholder:text-gray-400',
				'dark:disabled:bg-gray-900',

				className
			)}
			{...props}
		>
			{children}
			<SelectPrimitive.Icon asChild>
				<ChevronDown className="h-4 w-4 opacity-50 ml-2 flex-shrink-0" />
			</SelectPrimitive.Icon>
		</SelectPrimitive.Trigger>
	);
}

function SelectContent({
	className,
	children,
	position = 'popper',
	...props
}: React.ComponentProps<typeof SelectPrimitive.Content>) {
	return (
		<SelectPrimitive.Portal>
			<SelectPrimitive.Content
				className={cn(
					// 기본 스타일
					'relative z-50 overflow-hidden rounded-md border shadow-lg',
					'bg-white border-gray-200',

					// 애니메이션
					'data-[state=open]:animate-in data-[state=closed]:animate-out',
					'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
					'data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95',
					'data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2',
					'data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2',

					// 위치별 조정 - 트리거 너비와 맞춤
					position === 'popper' && [
						'data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1',
						'data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1',
						// 트리거와 동일한 너비 설정
						'w-[var(--radix-select-trigger-width)] min-w-[var(--radix-select-trigger-width)] max-w-[var(--radix-select-trigger-width)]',
					],

					// 다크 모드
					'dark:bg-gray-800 dark:border-gray-700',

					className
				)}
				position={position}
				{...props}
			>
				<SelectScrollUpButton />
				<SelectPrimitive.Viewport className={cn('p-1', position === 'popper' && 'w-full min-w-full')}>
					{children}
				</SelectPrimitive.Viewport>
				<SelectScrollDownButton />
			</SelectPrimitive.Content>
		</SelectPrimitive.Portal>
	);
}

function SelectLabel({ className, ...props }: React.ComponentProps<typeof SelectPrimitive.Label>) {
	return (
		<SelectPrimitive.Label
			className={cn('px-2 py-1.5 text-xs font-medium text-gray-500 dark:text-gray-400', className)}
			{...props}
		/>
	);
}

function SelectItem({ className, children, ...props }: React.ComponentProps<typeof SelectPrimitive.Item>) {
	return (
		<SelectPrimitive.Item
			className={cn(
				// 기본 스타일
				'w-full relative flex cursor-pointer items-center rounded-md py-2 pl-2 pr-8 text-sm outline-none',
				'transition-colors duration-150',

				// 상태별 스타일
				'hover:bg-gray-100 focus:bg-gray-100',
				'data-[highlighted]:bg-gray-100 data-[highlighted]:text-gray-900',
				'data-[disabled]:pointer-events-none data-[disabled]:opacity-50',

				// 다크 모드
				'dark:hover:bg-gray-700 dark:focus:bg-gray-700',
				'dark:data-[highlighted]:bg-gray-700 dark:data-[highlighted]:text-gray-100',

				className
			)}
			{...props}
		>
			<SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
			<span className="absolute right-2 flex h-4 w-4 items-center justify-center">
				<SelectPrimitive.ItemIndicator>
					<Check className="h-4 w-4 text-blue-600 dark:text-blue-400" />
				</SelectPrimitive.ItemIndicator>
			</span>
		</SelectPrimitive.Item>
	);
}

function SelectSeparator({ className, ...props }: React.ComponentProps<typeof SelectPrimitive.Separator>) {
	return <SelectPrimitive.Separator className={cn('my-1 h-px bg-gray-200 dark:bg-gray-700', className)} {...props} />;
}

function SelectScrollUpButton({ className, ...props }: React.ComponentProps<typeof SelectPrimitive.ScrollUpButton>) {
	return (
		<SelectPrimitive.ScrollUpButton
			className={cn(
				'flex cursor-default items-center justify-center py-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200',
				className
			)}
			{...props}
		>
			<ChevronUp className="h-4 w-4" />
		</SelectPrimitive.ScrollUpButton>
	);
}

function SelectScrollDownButton({
	className,
	...props
}: React.ComponentProps<typeof SelectPrimitive.ScrollDownButton>) {
	return (
		<SelectPrimitive.ScrollDownButton
			className={cn(
				'flex cursor-default items-center justify-center py-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200',
				className
			)}
			{...props}
		>
			<ChevronDown className="h-4 w-4" />
		</SelectPrimitive.ScrollDownButton>
	);
}

export {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectLabel,
	SelectScrollDownButton,
	SelectScrollUpButton,
	SelectSeparator,
	SelectTrigger,
	SelectValue,
};

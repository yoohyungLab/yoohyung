import React from 'react';
import { AlertTriangle, ArrowLeft, Home } from 'lucide-react';
import { Button } from './button';
import { cn } from '../lib/utils';

/**
 * 실제 사용되는 에러 타입만 정의
 */
export type TErrorType = 'not_found' | 'server' | 'unknown';

export interface IErrorAction {
	label: string;
	onClick: () => void;
	variant?: 'default' | 'outline' | 'ghost';
	icon?: React.ReactNode;
}

interface ErrorMessageProps {
	title?: string;
	message?: string;
	actionLabel?: string;
	onAction?: () => void;
	className?: string;
	error?: Error | string | null;
	errorType?: TErrorType;
	actions?: IErrorAction[];
	onRetry?: () => void;
	onGoHome?: () => void;
	onGoBack?: () => void;
	variant?: 'page' | 'inline';
}

const ERROR_CONFIGS: Record<TErrorType, { title: string; message: string; icon: string; bgClass: string }> = {
	not_found: {
		title: '페이지를 찾을 수 없어요',
		message: '요청하신 페이지가 존재하지 않거나 이동되었을 수 있습니다.',
		icon: '❓',
		bgClass: 'bg-purple-100',
	},
	server: {
		title: '서버 오류가 발생했어요',
		message: '서버에서 문제가 발생했습니다. 잠시 후 다시 시도해주세요.',
		icon: '⚠️',
		bgClass: 'bg-red-100',
	},
	unknown: {
		title: '문제가 발생했습니다',
		message: '예상치 못한 오류가 발생했습니다.',
		icon: '💥',
		bgClass: 'bg-gray-100',
	},
};

function detectErrorType(error: unknown): TErrorType {
	if (!error) return 'unknown';
	const message = (error instanceof Error ? error.message : String(error)).toLowerCase();

	if (message.includes('not found') || message.includes('404')) return 'not_found';
	if (message.includes('server') || message.includes('500')) return 'server';

	return 'unknown';
}

export function ErrorMessage({
	title,
	message,
	actionLabel = '다시 시도',
	onAction,
	className,
	error,
	errorType,
	actions,
	onRetry,
	onGoHome,
	onGoBack,
	variant = 'inline',
}: ErrorMessageProps) {
	const detectedType = errorType || detectErrorType(error);
	const config = ERROR_CONFIGS[detectedType];

	const finalTitle = title || config.title;
	const finalMessage = message || config.message;

	// 액션 구성
	const defaultActions: IErrorAction[] = [];
	if (onGoBack)
		defaultActions.push({
			label: '이전 페이지',
			onClick: onGoBack,
			variant: 'outline',
			icon: <ArrowLeft className="w-4 h-4" />,
		});
	if (onGoHome)
		defaultActions.push({ label: '홈으로', onClick: onGoHome, variant: 'outline', icon: <Home className="w-4 h-4" /> });
	if (onAction && !actions) defaultActions.push({ label: actionLabel, onClick: onAction, variant: 'outline' });

	const finalActions = actions || defaultActions;

	if (variant === 'page') {
		return (
			<div className={cn('min-h-screen bg-gray-50 flex items-center justify-center p-4', className)}>
				<div className="text-center max-w-md">
					<div className={`w-16 h-16 ${config.bgClass} rounded-full flex items-center justify-center mx-auto mb-4`}>
						<span className="text-2xl">{config.icon}</span>
					</div>
					<h2 className="text-xl font-semibold text-gray-700 mb-2">{finalTitle}</h2>
					<p className="text-gray-600 mb-6">{finalMessage}</p>
					{finalActions.length > 0 && (
						<div className="space-y-3">
							{finalActions.map((action, index) => (
								<Button key={index} onClick={action.onClick} variant={action.variant || 'outline'} className="w-full">
									{action.icon && <span className="mr-2">{action.icon}</span>}
									{action.label}
								</Button>
							))}
						</div>
					)}
				</div>
			</div>
		);
	}

	// 인라인 에러 (기존 스타일 유지)
	return (
		<div className={cn('text-center py-12', className)}>
			<AlertTriangle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
			<h3 className="text-lg font-semibold text-gray-900 mb-2">{finalTitle}</h3>
			<p className="text-gray-600 mb-4">{finalMessage}</p>
			{finalActions.length > 0 && (
				<div className="space-y-2">
					{finalActions.map((action, index) => (
						<Button key={index} onClick={action.onClick} variant={action.variant || 'outline'}>
							{action.icon && <span className="mr-2">{action.icon}</span>}
							{action.label}
						</Button>
					))}
				</div>
			)}
		</div>
	);
}

// 하위 호환성을 위한 별칭
export const ErrorState = ErrorMessage;

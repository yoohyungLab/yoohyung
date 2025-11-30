import { FEEDBACK_STATUS_OPTIONS, TEST_STATUS_OPTIONS } from '@/constants';
import { getLabelText, getStatusConfig } from '@/utils/utils';
import { formatDate, formatDateLong, formatDuration, formatTime } from '@pickid/shared';
import { Badge, DefaultSelect, IconButton } from '@pickid/ui';
import { Calendar, Eye, FileText, MessageSquare, Pencil, Trash2 } from 'lucide-react';

interface RenderOptions {
	showAvatar?: boolean;
	showIcon?: boolean;
	maxLength?: number;
	dateFormat?: 'short' | 'long' | 'time';
}

export function useColumnRenderers() {
	const renderText = (value: string | null | undefined, options?: RenderOptions) => {
		if (!value) return <span className="text-gray-400">-</span>;

		const { maxLength = 50 } = options || {};
		const displayValue = value.length > maxLength ? `${value.substring(0, maxLength)}...` : value;

		return <span className="text-sm text-gray-900">{displayValue}</span>;
	};

	const renderEmail = (email: string) => {
		return <div className="text-sm text-gray-900">{email}</div>;
	};

	const renderNameWithAvatar = (name: string, avatarUrl?: string | null) => {
		return (
			<div className="flex items-center gap-2">
				{avatarUrl && <img src={avatarUrl} alt={name} className="w-6 h-6 rounded-full" />}
				<span className="text-sm font-medium text-gray-900">{name}</span>
			</div>
		);
	};

	const renderProvider = (provider: string) => {
		return <span className="text-sm text-gray-900">{getLabelText('provider', provider)}</span>;
	};

	const renderStatus = (status: string) => {
		const statusConfig = getStatusConfig('profile', status);
		return (
			<Badge
				variant={
					statusConfig.variant as 'default' | 'secondary' | 'destructive' | 'outline' | 'success' | 'warning' | 'info'
				}
			>
				{statusConfig.text}
			</Badge>
		);
	};

	const renderDate = (dateString: string, options?: RenderOptions) => {
		const { dateFormat = 'short', showIcon = false } = options || {};

		let formattedDate: string;
		switch (dateFormat) {
			case 'long':
				formattedDate = formatDateLong(dateString);
				break;
			case 'time':
				formattedDate = formatTime(dateString);
				break;
			default:
				formattedDate = formatDate(dateString);
		}

		if (showIcon) {
			return (
				<div className="flex items-center gap-2">
					<Calendar className="w-4 h-4 text-gray-400" />
					<span className="text-sm text-gray-900">{formattedDate}</span>
				</div>
			);
		}

		return <div className="text-sm text-gray-900">{formattedDate}</div>;
	};

	const renderNumber = (value: number | null | undefined) => {
		if (value === null || value === undefined) return <span className="text-gray-400">-</span>;
		return <span className="text-sm text-gray-900">{value.toLocaleString()}</span>;
	};

	const renderTitleWithContent = (title: string, content: string, options?: RenderOptions) => {
		const { maxLength = 50 } = options || {};
		return (
			<div>
				<div className="font-medium text-gray-900">
					{title.length > maxLength ? `${title.substring(0, maxLength)}...` : title}
				</div>
				<div className="text-sm text-gray-500">{content.length > 30 ? `${content.substring(0, 30)}...` : content}</div>
			</div>
		);
	};

	const renderAuthor = (authorName: string, showIcon = true) => {
		if (showIcon) {
			return <div className="text-sm text-gray-900">{authorName}</div>;
		}
		return <span className="text-sm text-gray-900">{authorName}</span>;
	};

	const renderFeedbackStatusSelect = (
		id: string,
		data: Record<string, unknown>,
		onStatusChange: (id: string, status: string) => void
	) => {
		return (
			<DefaultSelect
				value={data.status as string}
				onValueChange={(value: string) => onStatusChange(id, value)}
				options={[...FEEDBACK_STATUS_OPTIONS]}
				size="sm"
				className="w-28"
			/>
		);
	};

	const renderActions = (
		id: string,
		data: Record<string, unknown>,
		actions: Array<{
			type: 'view' | 'edit' | 'delete' | 'status' | 'reply';
			onClick: (id: string, data?: Record<string, unknown>) => void;
			condition?: (data: Record<string, unknown>) => boolean;
			statusOptions?: Array<{ value: string; label: string }>;
		}>
	) => {
		return (
			<div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
				{actions.map((action, index) => {
					if (action.condition && !action.condition(data)) {
						return null;
					}

					switch (action.type) {
						case 'view':
							return (
								<IconButton
									key={index}
									size="sm"
									variant="outline"
									icon={<Eye className="w-4 h-4" />}
									aria-label="보기"
									onClick={() => action.onClick(id, data)}
								/>
							);
						case 'edit':
							return (
								<IconButton
									key={index}
									size="sm"
									variant="outline"
									icon={<Pencil className="w-4 h-4" />}
									aria-label="수정"
									onClick={() => action.onClick(id, data)}
								/>
							);
						case 'delete':
							return (
								<IconButton
									key={index}
									size="sm"
									variant="outline"
									icon={<Trash2 className="w-4 h-4" />}
									aria-label="삭제"
									onClick={() => action.onClick(id, data)}
									className="text-red-600 border-red-600 hover:bg-red-50"
								/>
							);
						case 'status': {
							const statusOptions = action.statusOptions || [...TEST_STATUS_OPTIONS];
							return (
								<DefaultSelect
									key={index}
									value={data.status as string}
									onValueChange={(value: string) => action.onClick(id, { ...data, status: value })}
									options={statusOptions}
									size="sm"
									className="w-28 min-w-28 bg-white"
								/>
							);
						}
						case 'reply':
							return (
								<IconButton
									key={index}
									size="sm"
									icon={<MessageSquare className="w-4 h-4" />}
									aria-label="답변"
									onClick={() => action.onClick(id, data)}
									className="bg-purple-600 hover:bg-purple-700 text-white"
								/>
							);
						default:
							return null;
					}
				})}
			</div>
		);
	};

	const renderFileAttachment = (fileUrl?: string | null) => {
		if (!fileUrl) return null;
		return <FileText className="w-4 h-4 text-blue-500" />;
	};

	const renderDuration = (seconds: number) => {
		return <span className="text-sm text-gray-900">{formatDuration(seconds)}</span>;
	};

	return {
		renderText,
		renderEmail,
		renderNameWithAvatar,
		renderProvider,
		renderStatus,
		renderDate,
		renderNumber,
		renderTitleWithContent,
		renderAuthor,
		renderActions,
		renderFeedbackStatusSelect,
		renderFileAttachment,
		renderDuration,
	};
}

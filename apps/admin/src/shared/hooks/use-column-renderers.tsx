import React from 'react';
import { Badge, IconButton, DefaultSelect } from '@repo/ui';
import { Eye, Trash2, MessageSquare, User, Calendar, FileText } from 'lucide-react';
import { getStatusConfig, getProviderText } from '../lib/utils';
import { formatDate, formatDateLong, formatDuration, formatTime } from '@repo/shared';

interface RenderOptions {
    showAvatar?: boolean;
    showIcon?: boolean;
    maxLength?: number;
    dateFormat?: 'short' | 'long' | 'time';
}

export function useColumnRenderers() {
    // 기본 텍스트 렌더링
    const renderText = (value: string | null | undefined, options?: RenderOptions) => {
        if (!value) return <span className="text-gray-400">-</span>;

        const { maxLength = 50 } = options || {};
        const displayValue = value.length > maxLength ? `${value.substring(0, maxLength)}...` : value;

        return <span className="text-sm text-gray-900">{displayValue}</span>;
    };

    // 이메일 렌더링
    const renderEmail = (email: string) => {
        return <div className="text-sm text-gray-900">{email}</div>;
    };

    // 이름 + 아바타 렌더링
    const renderNameWithAvatar = (name: string, avatarUrl?: string | null) => {
        return (
            <div className="flex items-center gap-2">
                {avatarUrl && <img src={avatarUrl} alt={name} className="w-6 h-6 rounded-full" />}
                <span className="text-sm font-medium text-gray-900">{name}</span>
            </div>
        );
    };

    // 가입경로 렌더링
    const renderProvider = (provider: string) => {
        return <Badge variant="outline">{getProviderText(provider)}</Badge>;
    };

    // 상태 렌더링 (Badge)
    const renderStatus = (status: string) => {
        const statusConfig = getStatusConfig(status);
        return (
            <Badge className={`flex items-center gap-1 w-fit ${statusConfig.color}`}>
                {statusConfig.icon}
                {statusConfig.text}
            </Badge>
        );
    };

    // 날짜 렌더링
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

    // 숫자 렌더링
    const renderNumber = (value: number | null | undefined) => {
        if (value === null || value === undefined) return <span className="text-gray-400">-</span>;
        return <span className="text-sm text-gray-900">{value.toLocaleString()}</span>;
    };

    // 카테고리 렌더링
    const renderCategory = (category: string, categoryMap?: Record<string, string>) => {
        const displayName = categoryMap?.[category] || category;
        return (
            <Badge variant="outline" className="text-xs">
                {displayName}
            </Badge>
        );
    };

    // 제목 + 내용 렌더링
    const renderTitleWithContent = (title: string, content: string, options?: RenderOptions) => {
        const { maxLength = 50 } = options || {};
        return (
            <div>
                <div className="font-medium text-gray-900">{title.length > maxLength ? `${title.substring(0, maxLength)}...` : title}</div>
                <div className="text-sm text-gray-500">{content.length > 30 ? `${content.substring(0, 30)}...` : content}</div>
            </div>
        );
    };

    // 작성자 렌더링
    const renderAuthor = (authorName: string, showIcon = true) => {
        if (showIcon) {
            return (
                <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-900">{authorName}</span>
                </div>
            );
        }
        return <span className="text-sm text-gray-900">{authorName}</span>;
    };

    // 피드백 상태 Select 렌더링
    const renderFeedbackStatusSelect = (
        id: string,
        data: Record<string, unknown>,
        onStatusChange: (id: string, status: string) => void
    ) => {
        const feedbackOptions = [
            { value: 'pending', label: '검토중' },
            { value: 'in_progress', label: '진행중' },
            { value: 'completed', label: '완료' },
            { value: 'replied', label: '답변완료' },
            { value: 'rejected', label: '반려' },
        ];

        return (
            <DefaultSelect
                value={data.status as string}
                onValueChange={(value: string) => onStatusChange(id, value)}
                options={feedbackOptions}
                size="sm"
                className="w-28"
            />
        );
    };

    // 액션 버튼들 렌더링
    const renderActions = (
        id: string,
        data: Record<string, unknown>,
        actions: Array<{
            type: 'view' | 'edit' | 'delete' | 'status' | 'reply';
            onClick: (id: string, data?: Record<string, unknown>) => void;
            condition?: (data: Record<string, unknown>) => boolean;
        }>
    ) => {
        return (
            <div className="flex items-center gap-2">
                {actions.map((action, index) => {
                    // 조건이 있고 false면 렌더링하지 않음
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
                                    icon="✏️"
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
                            const profileOptions = [
                                { value: 'active', label: '활성' },
                                { value: 'inactive', label: '비활성' },
                                { value: 'deleted', label: '탈퇴' },
                            ];
                            return (
                                <DefaultSelect
                                    key={index}
                                    value={data.status as string}
                                    onValueChange={(value: string) => action.onClick(id, { ...data, status: value })}
                                    options={profileOptions}
                                    size="sm"
                                    className="w-24"
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

    // 파일 첨부 표시
    const renderFileAttachment = (fileUrl?: string | null) => {
        if (!fileUrl) return null;
        return <FileText className="w-4 h-4 text-blue-500" />;
    };

    // 지속시간 렌더링
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
        renderCategory,
        renderTitleWithContent,
        renderAuthor,
        renderActions,
        renderFeedbackStatusSelect,
        renderFileAttachment,
        renderDuration,
    };
}

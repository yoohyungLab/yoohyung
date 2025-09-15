import React from 'react';
import type { Feedback } from '../../shared/types';
import { getStatusText, getStatusColor, getCategoryText } from '../../shared/lib/utils';
import { formatDateLong } from '@repo/shared';
import { Eye, MessageSquare, User, Calendar, X } from 'lucide-react';
import { Button } from '@repo/ui';

interface FeedbackDetailModalProps {
    feedback: Feedback;
    onClose: () => void;
    onReply: (id: string) => void;
}

export function FeedbackDetailModal({ feedback, onClose, onReply }: FeedbackDetailModalProps) {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6 border-b border-gray-200 flex items-center justify-between">
                    <h2 className="text-xl font-semibold">건의사항 상세보기</h2>
                    <Button variant="ghost" size="sm" onClick={onClose} className="h-8 w-8 p-0">
                        <X className="h-4 w-4" />
                    </Button>
                </div>

                <div className="p-6 space-y-6">
                    {/* 헤더 영역 */}
                    <div className="flex items-start justify-between mb-6">
                        <div className="flex-1">
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">{feedback.title}</h3>
                            <div className="flex items-center gap-3 text-sm text-gray-500">
                                <div className="flex items-center gap-1">
                                    <User className="w-4 h-4" />
                                    <span>{feedback.author_name}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <Calendar className="w-4 h-4" />
                                    <span>{formatDateLong(feedback.created_at)}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <Eye className="w-4 h-4" />
                                    <span>{feedback.views}회</span>
                                </div>
                            </div>
                        </div>

                        {/* 상태 및 액션 */}
                        <div className="flex items-center gap-3 ml-4">
                            <span className="inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-medium bg-gray-50 text-gray-700 border-gray-200 h-6">
                                {getCategoryText(feedback.category)}
                            </span>
                            <span
                                className={`inline-flex items-center rounded-md px-2.5 py-0.5 text-xs font-medium h-6 ${getStatusColor(
                                    feedback.status
                                )}`}
                            >
                                {getStatusText(feedback.status)}
                            </span>

                            {!feedback.admin_reply && (
                                <Button size="sm" onClick={() => onReply(feedback.id)} className="h-6 px-2.5 text-xs">
                                    <MessageSquare className="w-3 h-3 mr-1" />
                                    답변 추가
                                </Button>
                            )}
                        </div>
                    </div>

                    {/* 내용 */}
                    <div className="bg-gray-50 rounded-lg p-4">
                        <p className="text-gray-900 whitespace-pre-wrap">{feedback.content}</p>
                    </div>

                    {/* 관리자 답변 */}
                    {feedback.admin_reply && (
                        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                            <h4 className="font-medium text-purple-900 mb-2">관리자 답변</h4>
                            <p className="text-purple-900">{feedback.admin_reply}</p>
                            {feedback.admin_reply_at && (
                                <p className="text-sm text-purple-600 mt-2">{formatDateLong(feedback.admin_reply_at)}</p>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

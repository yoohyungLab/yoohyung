import React, { useCallback, useEffect, useState } from 'react';
import { usePagination } from '@repo/shared';
import { feedbackService } from '@repo/supabase';
import { DataTable, type Column } from '@repo/ui';
import { AdminCard, BulkActions, DataState, FilterBar } from '../../components/ui';
import { useColumnRenderers } from '../../shared/hooks';
import { PAGINATION } from '../../shared/lib';
import { Eye, MessageSquare, CheckCircle, Clock, AlertCircle, User, Calendar } from 'lucide-react';

interface Feedback {
    id: string;
    title: string;
    content: string;
    category: string;
    status: 'pending' | 'in_progress' | 'completed' | 'replied' | 'rejected';
    author_name: string;
    author_email?: string;
    attached_file_url?: string;
    admin_reply?: string;
    admin_reply_at?: string;
    views: number;
    created_at: string;
    updated_at: string;
}

const CATEGORY_MAP: Record<string, string> = {
    test_idea: '새 테스트 아이디어',
    feature: '기능 개선 건의',
    bug_report: '오류 신고',
    design: '디자인 관련',
    mobile: '모바일 이슈',
    other: '기타 의견',
};

export function FeedbackListPage() {
    const renderers = useColumnRenderers();

    const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [modalFeedback, setModalFeedback] = useState<Feedback | null>(null);
    const [showReplyModal, setShowReplyModal] = useState<string | null>(null);
    const [replyText, setReplyText] = useState('');
    const [selectedFeedbacks, setSelectedFeedbacks] = useState<string[]>([]);
    const [filters, setFilters] = useState({
        search: '',
        status: 'all',
        category: 'all',
    });
    const [totalFeedbacks, setTotalFeedbacks] = useState(0);
    const pagination = usePagination({
        totalItems: totalFeedbacks,
        defaultPageSize: PAGINATION.DEFAULT_PAGE_SIZE,
    });

    // 간단한 통계
    const [stats, setStats] = useState({
        pending: 0,
        in_progress: 0,
        completed: 0,
        replied: 0,
        rejected: 0,
    });

    // API calls
    const loadFeedbacks = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            const data = await feedbackService.getAllFeedbacks();

            if (Array.isArray(data)) {
                // 필터링 로직
                const filtered = data.filter((feedback) => {
                    const matchesStatus = filters.status === 'all' || feedback.status === filters.status;
                    const matchesCategory = filters.category === 'all' || feedback.category === filters.category;
                    const matchesSearch =
                        filters.search === '' ||
                        feedback.title.toLowerCase().includes(filters.search.toLowerCase()) ||
                        feedback.content.toLowerCase().includes(filters.search.toLowerCase()) ||
                        feedback.author_name.toLowerCase().includes(filters.search.toLowerCase());

                    return matchesStatus && matchesCategory && matchesSearch;
                });

                // 페이지네이션
                const startIndex = (pagination.currentPage - 1) * pagination.pageSize;
                const endIndex = startIndex + pagination.pageSize;
                const paginatedData = filtered.slice(startIndex, endIndex);

                setFeedbacks(paginatedData);
                setTotalFeedbacks(filtered.length);
            } else {
                setError('데이터 형식이 올바르지 않습니다.');
            }
        } catch (error) {
            console.error('피드백 목록 로딩 실패:', error);
            setError(error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.');
        } finally {
            setLoading(false);
        }
    }, [filters, pagination.currentPage, pagination.pageSize]);

    const loadStats = useCallback(async () => {
        try {
            const statsData = await feedbackService.getFeedbackStats();
            setStats({
                pending: statsData.pending,
                in_progress: statsData.inProgress,
                completed: statsData.completed,
                replied: statsData.replied,
                rejected: statsData.rejected,
            });
        } catch (error) {
            console.error('통계 로딩 실패:', error);
        }
    }, []);

    // 필터 변경 시 첫 페이지로 이동하고 데이터 로딩
    useEffect(() => {
        if (pagination.currentPage !== 1) {
            pagination.setPage(1);
        } else {
            loadFeedbacks();
            loadStats();
        }
    }, [filters.search, filters.status, filters.category, loadFeedbacks, loadStats, pagination]);

    // 페이지 변경 시에만 피드백 로딩
    useEffect(() => {
        loadFeedbacks();
    }, [pagination.currentPage, pagination.pageSize, loadFeedbacks]);

    // 개별 피드백 상태 변경 - 서버 요청 후 즉시 UI 업데이트
    const handleStatusChange = async (feedbackId: string, newStatus: Feedback['status']) => {
        try {
            await feedbackService.updateFeedbackStatus(feedbackId, newStatus);
            // 상태 변경 후 즉시 UI 업데이트
            setFeedbacks((prev) => prev.map((f) => (f.id === feedbackId ? { ...f, status: newStatus } : f)));
            // 통계도 즉시 업데이트
            setStats((prev) => ({
                ...prev,
                [newStatus]: prev[newStatus] + 1,
                [feedbacks.find((f) => f.id === feedbackId)?.status || 'pending']:
                    prev[feedbacks.find((f) => f.id === feedbackId)?.status || 'pending'] - 1,
            }));
        } catch (error) {
            console.error('상태 변경 실패:', error);
        }
    };

    // 대량 상태 변경 - 선택된 여러 피드백 상태를 한번에 변경
    const handleBulkStatusChange = async (status: Feedback['status']) => {
        if (selectedFeedbacks.length === 0) return;

        try {
            for (const id of selectedFeedbacks) {
                await feedbackService.updateFeedbackStatus(id, status);
            }
            setSelectedFeedbacks([]);
            loadFeedbacks();
            loadStats();
        } catch (error) {
            console.error('대량 상태 변경 실패:', error);
        }
    };

    // 피드백 삭제 처리 - 확인 후 삭제하고 목록 새로고침
    const handleDeleteFeedback = async (feedbackId: string) => {
        if (!confirm('정말로 이 피드백을 삭제하시겠습니까?')) return;

        try {
            await feedbackService.deleteFeedback(feedbackId);
            loadFeedbacks();
            loadStats();
        } catch (error) {
            console.error('삭제 처리 실패:', error);
        }
    };

    // 답변 추가 핸들러
    const handleAddReply = async (id: string) => {
        if (!replyText.trim()) return;

        try {
            await feedbackService.addAdminReply(id, replyText);
            setShowReplyModal(null);
            setReplyText('');
            loadFeedbacks();
            loadStats();
        } catch (error) {
            console.error('답변 추가 실패:', error);
            setError(error instanceof Error ? error.message : '답변 추가에 실패했습니다.');
        }
    };

    // 필터 변경 - 검색어, 상태, 카테고리 필터 업데이트
    const handleFilterChange = (key: keyof typeof filters, value: string) => {
        setFilters((prev: typeof filters) => ({ ...prev, [key]: value }));
    };

    // Table columns definition
    const columns: Column<Feedback>[] = [
        {
            id: 'title',
            header: '제목',
            accessorKey: 'title',
            cell: ({ row }) => (
                <div className="flex items-center gap-2">
                    {renderers.renderTitleWithContent(row.original.title, row.original.content)}
                    {renderers.renderFileAttachment(row.original.attached_file_url)}
                </div>
            ),
        },
        {
            id: 'category',
            header: '카테고리',
            cell: ({ row }) => renderers.renderCategory(row.original.category, CATEGORY_MAP),
        },
        {
            id: 'author',
            header: '작성자',
            cell: ({ row }) => renderers.renderAuthor(row.original.author_name),
        },
        {
            id: 'status',
            header: '상태',
            cell: ({ row }) => renderers.renderStatus(row.original.status),
        },
        {
            id: 'created_at',
            header: '작성일',
            cell: ({ row }) => renderers.renderDate(row.original.created_at),
        },
        {
            id: 'views',
            header: '조회수',
            cell: ({ row }) => renderers.renderNumber(row.original.views),
        },
        {
            id: 'actions',
            header: '액션',
            cell: ({ row }) =>
                renderers.renderActions(row.original.id, row.original as unknown as Record<string, unknown>, [
                    {
                        type: 'reply',
                        onClick: (id) => setShowReplyModal(id),
                        condition: (data) => !data.admin_reply,
                    },
                    {
                        type: 'status',
                        onClick: (id, data) => handleStatusChange(id, (data?.status as Feedback['status']) || 'pending'),
                    },
                    {
                        type: 'delete',
                        onClick: (id) => handleDeleteFeedback(id),
                    },
                ]),
        },
    ];

    return (
        <div className="space-y-6 p-5">
            {/* 간단한 통계 */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                <div className="bg-white p-4 rounded-lg border border-gray-200">
                    <div className="text-sm text-gray-600">검토중</div>
                    <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
                </div>
                <div className="bg-white p-4 rounded-lg border border-gray-200">
                    <div className="text-sm text-gray-600">진행중</div>
                    <div className="text-2xl font-bold text-blue-600">{stats.in_progress}</div>
                </div>
                <div className="bg-white p-4 rounded-lg border border-gray-200">
                    <div className="text-sm text-gray-600">완료</div>
                    <div className="text-2xl font-bold text-green-600">{stats.completed}</div>
                </div>
                <div className="bg-white p-4 rounded-lg border border-gray-200">
                    <div className="text-sm text-gray-600">답변완료</div>
                    <div className="text-2xl font-bold text-purple-600">{stats.replied}</div>
                </div>
                <div className="bg-white p-4 rounded-lg border border-gray-200">
                    <div className="text-sm text-gray-600">반려</div>
                    <div className="text-2xl font-bold text-red-600">{stats.rejected}</div>
                </div>
            </div>

            {/* Search & Filters */}
            <AdminCard>
                <FilterBar
                    filters={[
                        {
                            id: 'search',
                            type: 'search',
                            placeholder: '제목, 내용, 작성자로 검색...',
                            value: filters.search,
                            onChange: (value: string) => handleFilterChange('search', value),
                        },
                        {
                            id: 'status',
                            type: 'select',
                            value: filters.status,
                            onChange: (value: string) => handleFilterChange('status', value),
                            options: [
                                { value: 'all', label: '전체 상태' },
                                { value: 'pending', label: '검토중' },
                                { value: 'in_progress', label: '진행중' },
                                { value: 'completed', label: '완료' },
                                { value: 'replied', label: '답변완료' },
                                { value: 'rejected', label: '반려' },
                            ],
                        },
                        {
                            id: 'category',
                            type: 'select',
                            value: filters.category,
                            onChange: (value: string) => handleFilterChange('category', value),
                            options: [
                                { value: 'all', label: '전체 카테고리' },
                                { value: 'test_idea', label: '새 테스트 아이디어' },
                                { value: 'feature', label: '기능 개선 건의' },
                                { value: 'bug_report', label: '오류 신고' },
                                { value: 'design', label: '디자인 관련' },
                                { value: 'mobile', label: '모바일 이슈' },
                                { value: 'other', label: '기타 의견' },
                            ],
                        },
                    ]}
                    hasActiveFilters={filters.search !== '' || filters.status !== 'all' || filters.category !== 'all'}
                    onClear={() => {
                        setFilters({ search: '', status: 'all', category: 'all' });
                    }}
                />
            </AdminCard>

            {/* Bulk Actions */}
            <BulkActions
                selectedCount={selectedFeedbacks.length}
                actions={[
                    {
                        id: 'in_progress',
                        label: '진행중으로',
                        onClick: () => handleBulkStatusChange('in_progress'),
                    },
                    {
                        id: 'completed',
                        label: '완료로',
                        onClick: () => handleBulkStatusChange('completed'),
                    },
                    {
                        id: 'rejected',
                        label: '반려',
                        variant: 'destructive',
                        onClick: () => handleBulkStatusChange('rejected'),
                    },
                ]}
                onClear={() => setSelectedFeedbacks([])}
            />

            {/* Feedback List */}
            <DataState loading={loading} error={error} data={feedbacks} onRetry={loadFeedbacks}>
                <DataTable
                    data={feedbacks}
                    columns={columns}
                    selectable={true}
                    selectedItems={selectedFeedbacks}
                    onSelectionChange={setSelectedFeedbacks}
                    getRowId={(feedback: Feedback) => feedback.id}
                    totalCount={totalFeedbacks}
                    totalLabel="건의사항"
                    onRowClick={(feedback: Feedback) => {
                        setModalFeedback(feedback);
                    }}
                />
            </DataState>

            {/* Pagination */}
            <div className="flex items-center justify-center space-x-2">
                <button
                    className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-3"
                    onClick={() => pagination.setPage(pagination.currentPage - 1)}
                    disabled={pagination.currentPage <= 1}
                >
                    이전
                </button>
                <span className="text-sm text-muted-foreground">
                    {pagination.currentPage} / {pagination.totalPages}
                </span>
                <button
                    className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-3"
                    onClick={() => pagination.setPage(pagination.currentPage + 1)}
                    disabled={pagination.currentPage >= pagination.totalPages}
                >
                    다음
                </button>
            </div>

            {/* Feedback Detail Modal */}
            {modalFeedback && (
                <FeedbackDetailModal
                    feedback={modalFeedback}
                    onClose={() => setModalFeedback(null)}
                    onReply={(id) => {
                        setModalFeedback(null);
                        setShowReplyModal(id);
                    }}
                />
            )}

            {/* 답변 모달 */}
            {showReplyModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
                        <h3 className="text-lg font-semibold mb-4">관리자 답변 추가</h3>
                        <textarea
                            value={replyText}
                            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setReplyText(e.target.value)}
                            placeholder="답변을 입력하세요..."
                            rows={4}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-4"
                        />
                        <div className="flex gap-2 justify-end">
                            <button
                                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500"
                                onClick={() => {
                                    setShowReplyModal(null);
                                    setReplyText('');
                                }}
                            >
                                취소
                            </button>
                            <button
                                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                                onClick={() => handleAddReply(showReplyModal)}
                                disabled={!replyText.trim()}
                            >
                                답변 추가
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

// 상세보기 모달 컴포넌트
function FeedbackDetailModal({ feedback, onClose, onReply }: { feedback: Feedback; onClose: () => void; onReply: (id: string) => void }) {
    const getStatusIcon = (status: Feedback['status']) => {
        switch (status) {
            case 'pending':
                return <Clock className="w-5 h-5 text-yellow-600" />;
            case 'in_progress':
                return <AlertCircle className="w-5 h-5 text-blue-600" />;
            case 'completed':
                return <CheckCircle className="w-5 h-5 text-green-600" />;
            case 'replied':
                return <MessageSquare className="w-5 h-5 text-purple-600" />;
            case 'rejected':
                return <AlertCircle className="w-5 h-5 text-red-600" />;
            default:
                return <Clock className="w-5 h-5 text-gray-600" />;
        }
    };

    const getStatusColor = (status: Feedback['status']) => {
        switch (status) {
            case 'pending':
                return 'bg-yellow-100 text-yellow-800';
            case 'in_progress':
                return 'bg-blue-100 text-blue-800';
            case 'completed':
                return 'bg-green-100 text-green-800';
            case 'replied':
                return 'bg-purple-100 text-purple-800';
            case 'rejected':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const getStatusText = (status: Feedback['status']) => {
        switch (status) {
            case 'pending':
                return '검토중';
            case 'in_progress':
                return '진행중';
            case 'completed':
                return '완료';
            case 'replied':
                return '답변완료';
            case 'rejected':
                return '반려';
            default:
                return status;
        }
    };

    const getCategoryLabel = (category: string) => {
        const categoryMap: Record<string, string> = {
            test_idea: '새 테스트 아이디어',
            feature: '기능 개선 건의',
            bug_report: '오류 신고',
            design: '디자인 관련',
            mobile: '모바일 이슈',
            other: '기타 의견',
        };
        return categoryMap[category] || category;
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('ko-KR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6 border-b border-gray-200 flex items-center justify-between">
                    <h2 className="text-xl font-semibold">건의사항 상세보기</h2>
                    <button className="text-gray-400 hover:text-gray-600 text-xl" onClick={onClose}>
                        ✕
                    </button>
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
                                    <span>{formatDate(feedback.created_at)}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <Eye className="w-4 h-4" />
                                    <span>{feedback.views}회</span>
                                </div>
                            </div>
                        </div>

                        {/* 상태 및 액션 */}
                        <div className="flex items-center gap-3 ml-4">
                            <span className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded">
                                {getCategoryLabel(feedback.category)}
                            </span>
                            <span className={`px-2 py-1 text-xs rounded flex items-center gap-1 ${getStatusColor(feedback.status)}`}>
                                {getStatusIcon(feedback.status)}
                                {getStatusText(feedback.status)}
                            </span>

                            {!feedback.admin_reply && (
                                <button
                                    className="px-3 py-1 text-sm font-medium text-white bg-purple-600 rounded hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
                                    onClick={() => onReply(feedback.id)}
                                >
                                    <MessageSquare className="w-4 h-4 mr-1 inline" />
                                    답변 추가
                                </button>
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
                                <p className="text-sm text-purple-600 mt-2">{formatDate(feedback.admin_reply_at)}</p>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

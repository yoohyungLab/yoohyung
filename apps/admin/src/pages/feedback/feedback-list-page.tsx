import { useState, useEffect, useCallback } from 'react';
import { Button, Badge, DataTable, Pagination, type Column } from '@repo/ui';
import { FilterBar, AdminCard, AdminCardHeader, AdminCardContent, DataState, StatsCards, BulkActions } from '../../shared/components';
import { feedbackService } from '@repo/supabase';
import { useColumnRenderers } from '../../shared/hooks';
import { Eye, MessageSquare, CheckCircle, Clock, AlertCircle, Download, FileText, User, Calendar } from 'lucide-react';

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
    const [selectedFeedback, setSelectedFeedback] = useState<Feedback | null>(null);
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [showReplyModal, setShowReplyModal] = useState<string | null>(null);
    const [replyText, setReplyText] = useState('');
    const [selectedFeedbacks, setSelectedFeedbacks] = useState<string[]>([]);

    // Filters and pagination
    const [filters, setFilters] = useState({
        search: '',
        status: 'all',
        category: 'all',
        page: 1,
    });
    const [pagination, setPagination] = useState({
        totalPages: 1,
        totalFeedbacks: 0,
    });
    const pageSize = 20;

    useEffect(() => {
        const timer = setTimeout(() => {
            setFilters((prev: typeof filters) => ({ ...prev, page: 1 }));
        }, 300);

        return () => clearTimeout(timer);
    }, [filters.search, filters.status, filters.category]);

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
                const startIndex = (filters.page - 1) * pageSize;
                const endIndex = startIndex + pageSize;
                const paginatedData = filtered.slice(startIndex, endIndex);

                setFeedbacks(paginatedData);
                setPagination({
                    totalFeedbacks: filtered.length,
                    totalPages: Math.ceil(filtered.length / pageSize),
                });
            } else {
                setError('데이터 형식이 올바르지 않습니다.');
            }
        } catch (error) {
            console.error('피드백 불러오기 실패:', error);
            setError(error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.');
        } finally {
            setLoading(false);
        }
    }, [filters]);

    const handleStatusToggle = async (id: string, currentStatus: Feedback['status']) => {
        let newStatus: Feedback['status'] = 'pending';

        switch (currentStatus) {
            case 'pending':
                newStatus = 'in_progress';
                break;
            case 'in_progress':
                newStatus = 'completed';
                break;
            case 'completed':
                newStatus = 'pending';
                break;
            default:
                newStatus = 'pending';
        }

        try {
            await feedbackService.updateFeedbackStatus(id, newStatus);
            loadFeedbacks();
        } catch (error) {
            console.error('상태 업데이트 실패:', error);
            setError(error instanceof Error ? error.message : '상태 업데이트에 실패했습니다.');
        }
    };

    const handleAddReply = async (id: string) => {
        if (!replyText.trim()) return;

        try {
            await feedbackService.addAdminReply(id, replyText);
            setShowReplyModal(null);
            setReplyText('');
            loadFeedbacks();
        } catch (error) {
            console.error('답변 추가 실패:', error);
            setError(error instanceof Error ? error.message : '답변 추가에 실패했습니다.');
        }
    };

    const handleBulkStatusChange = async (status: Feedback['status']) => {
        if (selectedFeedbacks.length === 0) return;

        try {
            for (const id of selectedFeedbacks) {
                await feedbackService.updateFeedbackStatus(id, status);
            }
            setSelectedFeedbacks([]);
            loadFeedbacks();
        } catch (error) {
            console.error('대량 상태 변경 실패:', error);
            setError(error instanceof Error ? error.message : '대량 상태 변경에 실패했습니다.');
        }
    };

    const handleFilterChange = (key: keyof typeof filters, value: string) => {
        setFilters((prev: typeof filters) => ({ ...prev, [key]: value }));
    };

    const handlePageChange = (page: number) => {
        setFilters((prev: typeof filters) => ({ ...prev, page }));
    };

    const handleExportFeedbacks = async () => {
        try {
            // 현재 필터된 모든 데이터를 가져와서 CSV로 변환
            const allData = await feedbackService.getAllFeedbacks();
            const csvContent = convertToCSV(allData);
            downloadCSV(csvContent, 'feedbacks_export.csv');
        } catch (error) {
            console.error('내보내기 실패:', error);
        }
    };

    const convertToCSV = (data: Feedback[]) => {
        const headers = ['ID', '제목', '카테고리', '상태', '작성자', '작성일', '조회수', '내용'];
        const rows = data.map((feedback) => [
            feedback.id,
            feedback.title,
            CATEGORY_MAP[feedback.category] || feedback.category,
            feedback.status,
            feedback.author_name,
            new Date(feedback.created_at).toLocaleDateString('ko-KR'),
            feedback.views,
            feedback.content.replace(/\n/g, ' ').substring(0, 100),
        ]);

        return [headers, ...rows].map((row) => row.map((field) => `"${field}"`).join(',')).join('\n');
    };

    const downloadCSV = (content: string, filename: string) => {
        const blob = new Blob(['\uFEFF' + content], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = filename;
        link.click();
    };

    useEffect(() => {
        loadFeedbacks();
    }, [loadFeedbacks]);

    // Table columns definition
    const columns: Column<Feedback>[] = [
        {
            id: 'title',
            header: '제목',
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
            cell: ({ row }) => renderers.renderDate(row.original.created_at, { showIcon: true }),
        },
        {
            id: 'views',
            header: '조회수',
            cell: ({ row }) => renderers.renderNumber(row.original.views),
        },
        {
            id: 'actions',
            header: '액션',
            cell: ({ row }) => (
                <div className="flex items-center gap-2">
                    {renderers.renderActions(row.original.id, row.original, [
                        {
                            type: 'view',
                            onClick: (id, data) => {
                                setSelectedFeedback(data);
                                setShowDetailModal(true);
                            },
                        },
                        {
                            type: 'reply',
                            onClick: (id) => setShowReplyModal(id),
                            condition: (data) => !data.admin_reply,
                        },
                    ])}
                    {renderers.renderFeedbackStatusSelect(row.original.id, row.original, (id, status) =>
                        handleStatusToggle(id, status as Feedback['status'])
                    )}
                </div>
            ),
        },
    ];

    return (
        <div className="space-y-6 p-5">
            {/* 헤더 */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">💌 건의사항 관리</h1>
                    <p className="text-gray-600 mt-1">사용자들의 건의사항을 확인하고 관리하세요</p>
                </div>
                <div className="text-right">
                    <div className="text-2xl font-bold text-blue-600">{pagination.totalFeedbacks.toLocaleString()}</div>
                    <div className="text-sm text-gray-500">전체 건의사항</div>
                </div>
            </div>

            {/* 통계 카드 */}
            <StatsCards
                stats={[
                    {
                        id: 'pending',
                        label: '검토중',
                        value: feedbacks.filter((f: Feedback) => f.status === 'pending').length,
                        color: 'yellow',
                    },
                    {
                        id: 'in_progress',
                        label: '진행중',
                        value: feedbacks.filter((f: Feedback) => f.status === 'in_progress').length,
                        color: 'blue',
                    },
                    {
                        id: 'completed',
                        label: '완료',
                        value: feedbacks.filter((f: Feedback) => f.status === 'completed').length,
                        color: 'green',
                    },
                    {
                        id: 'replied',
                        label: '답변완료',
                        value: feedbacks.filter((f: Feedback) => f.status === 'replied').length,
                        color: 'purple',
                    },
                    {
                        id: 'rejected',
                        label: '반려',
                        value: feedbacks.filter((f: Feedback) => f.status === 'rejected').length,
                        color: 'red',
                    },
                ]}
                columns={5}
            />

            {/* 검색 및 필터 */}
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
                    actions={
                        <Button onClick={handleExportFeedbacks} variant="outline">
                            <Download className="w-4 h-4 mr-2" />
                            내보내기
                        </Button>
                    }
                />

                {/* 대량 작업 */}
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
                            className: 'text-red-600 border-red-600 hover:bg-red-50',
                        },
                    ]}
                    onClear={() => setSelectedFeedbacks([])}
                />
            </AdminCard>

            {/* 테이블 */}
            <DataState loading={loading} error={error} data={feedbacks} onRetry={loadFeedbacks}>
                <DataTable
                    data={feedbacks}
                    columns={columns}
                    selectable={true}
                    selectedItems={selectedFeedbacks}
                    onSelectionChange={setSelectedFeedbacks}
                    getRowId={(feedback: Feedback) => feedback.id}
                    totalCount={pagination.totalFeedbacks}
                    totalLabel="건의사항"
                    onRowClick={(feedback: Feedback) => {
                        setSelectedFeedback(feedback);
                        setShowDetailModal(true);
                    }}
                />
            </DataState>

            {/* 페이지네이션 */}
            <Pagination
                currentPage={filters.page}
                totalPages={pagination.totalPages}
                totalItems={pagination.totalFeedbacks}
                pageSize={pageSize}
                onPageChange={handlePageChange}
            />

            {/* 상세보기 모달 */}
            {showDetailModal && selectedFeedback && (
                <FeedbackDetailModal
                    feedback={selectedFeedback}
                    onClose={() => {
                        setShowDetailModal(false);
                        setSelectedFeedback(null);
                    }}
                    onReply={(id) => {
                        setShowDetailModal(false);
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
                            <Button
                                variant="outline"
                                onClick={() => {
                                    setShowReplyModal(null);
                                    setReplyText('');
                                }}
                            >
                                취소
                            </Button>
                            <Button onClick={() => handleAddReply(showReplyModal)} disabled={!replyText.trim()}>
                                답변 추가
                            </Button>
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
                    <Button variant="outline" onClick={onClose}>
                        ✕
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
                            <Badge variant="outline" className="whitespace-nowrap">
                                {getCategoryLabel(feedback.category)}
                            </Badge>
                            <Badge className={`flex items-center gap-1 whitespace-nowrap ${getStatusColor(feedback.status)}`}>
                                {getStatusIcon(feedback.status)}
                                {getStatusText(feedback.status)}
                            </Badge>

                            {!feedback.admin_reply && (
                                <Button
                                    size="sm"
                                    onClick={() => onReply(feedback.id)}
                                    className="bg-purple-600 hover:bg-purple-700 whitespace-nowrap"
                                >
                                    <MessageSquare className="w-4 h-4 mr-1" />
                                    답변 추가
                                </Button>
                            )}

                            {feedback.attached_file_url && (
                                <Button size="sm" variant="outline" className="whitespace-nowrap">
                                    <Download className="w-4 h-4 mr-1" />
                                    첨부파일
                                </Button>
                            )}
                        </div>
                    </div>

                    {/* 상태 변경 툴바 */}
                    <div className="bg-gray-50 rounded-lg p-4 mb-6">
                        <div className="flex items-center">
                            <span className="text-sm font-medium text-gray-700 mr-5">상태 변경:</span>
                            <div className="flex gap-2">
                                <Button size="sm" variant="outline" className="text-yellow-600 border-yellow-600 hover:bg-yellow-50">
                                    검토중
                                </Button>
                                <Button size="sm" variant="outline" className="text-blue-600 border-blue-600 hover:bg-blue-50">
                                    진행중
                                </Button>
                                <Button size="sm" variant="outline" className="text-green-600 border-green-600 hover:bg-green-50">
                                    완료
                                </Button>
                                <Button size="sm" variant="outline" className="text-red-600 border-red-600 hover:bg-red-50">
                                    반려
                                </Button>
                            </div>
                        </div>
                    </div>

                    {/* 내용 */}
                    <AdminCard>
                        <AdminCardHeader title="내용" />
                        <AdminCardContent>
                            <div className="bg-gray-50 rounded-lg p-4">
                                <p className="text-gray-900 whitespace-pre-wrap">{feedback.content}</p>
                            </div>
                        </AdminCardContent>
                    </AdminCard>

                    {/* 관리자 답변 */}
                    {feedback.admin_reply && (
                        <AdminCard variant="bordered">
                            <AdminCardHeader title="관리자 답변" icon={<MessageSquare className="w-5 h-5 text-purple-600" />} />
                            <AdminCardContent>
                                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                                    <p className="text-purple-900">{feedback.admin_reply}</p>
                                    {feedback.admin_reply_at && (
                                        <p className="text-sm text-purple-600 mt-2">{formatDate(feedback.admin_reply_at)}</p>
                                    )}
                                </div>
                            </AdminCardContent>
                        </AdminCard>
                    )}
                </div>
            </div>
        </div>
    );
}

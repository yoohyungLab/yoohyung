import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, Button, Badge } from '@/components/ui';
import { feedbackApi } from '../../lib/supabase';
import { Search, Eye, MessageSquare, CheckCircle, Clock, AlertCircle, Download, FileText, User, Calendar } from 'lucide-react';

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

export function FeedbackListPage() {
    const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedStatus, setSelectedStatus] = useState<string>('all');
    const [selectedCategory, setSelectedCategory] = useState<string>('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedFeedback, setSelectedFeedback] = useState<Feedback | null>(null);
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [showReplyModal, setShowReplyModal] = useState<string | null>(null);
    const [replyText, setReplyText] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [selectedFeedbacks, setSelectedFeedbacks] = useState<string[]>([]);

    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalFeedbacks, setTotalFeedbacks] = useState(0);
    const pageSize = 20;

    useEffect(() => {
        loadFeedbacks();
    }, [currentPage, selectedStatus, selectedCategory]);

    useEffect(() => {
        const timer = setTimeout(() => {
            setCurrentPage(1);
            loadFeedbacks();
        }, 300);

        return () => clearTimeout(timer);
    }, [searchTerm]);

    const loadFeedbacks = async () => {
        setLoading(true);
        setError(null);

        try {
            console.log('=== 건의사항 로딩 시작 ===');
            const data = await feedbackApi.getAllFeedbacks();
            console.log('조회된 건의사항:', data);

            if (Array.isArray(data)) {
                // 필터링 로직
                const filtered = data.filter((feedback) => {
                    const matchesStatus = selectedStatus === 'all' || feedback.status === selectedStatus;
                    const matchesCategory = selectedCategory === 'all' || feedback.category === selectedCategory;
                    const matchesSearch =
                        searchTerm === '' ||
                        feedback.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        feedback.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        feedback.author_name.toLowerCase().includes(searchTerm.toLowerCase());

                    return matchesStatus && matchesCategory && matchesSearch;
                });

                // 페이지네이션
                const startIndex = (currentPage - 1) * pageSize;
                const endIndex = startIndex + pageSize;
                const paginatedData = filtered.slice(startIndex, endIndex);

                setFeedbacks(paginatedData);
                setTotalFeedbacks(filtered.length);
                setTotalPages(Math.ceil(filtered.length / pageSize));

                console.log('상태에 저장된 데이터:', paginatedData.length, '개');
                console.log('전체 필터링된 데이터:', filtered.length, '개');
            } else {
                console.error('데이터가 배열이 아님:', data);
                setError('데이터 형식이 올바르지 않습니다.');
            }
        } catch (error) {
            console.error('=== 피드백 불러오기 실패 ===');
            console.error('에러:', error);
            setError(error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.');
        } finally {
            setLoading(false);
            console.log('로딩 완료');
        }
    };

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
            await feedbackApi.updateFeedbackStatus(id, newStatus);
            loadFeedbacks();
        } catch (error) {
            console.error('상태 업데이트 실패:', error);
            setError(error instanceof Error ? error.message : '상태 업데이트에 실패했습니다.');
        }
    };

    const handleAddReply = async (id: string) => {
        if (!replyText.trim()) return;

        try {
            await feedbackApi.addAdminReply(id, replyText);
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
                await feedbackApi.updateFeedbackStatus(id, status);
            }
            setSelectedFeedbacks([]);
            loadFeedbacks();
        } catch (error) {
            console.error('대량 상태 변경 실패:', error);
            setError(error instanceof Error ? error.message : '대량 상태 변경에 실패했습니다.');
        }
    };

    const handleExportFeedbacks = async () => {
        try {
            // 현재 필터된 모든 데이터를 가져와서 CSV로 변환
            const allData = await feedbackApi.getAllFeedbacks();
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
            getCategoryLabel(feedback.category),
            getStatusText(feedback.status),
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

    const getStatusIcon = (status: Feedback['status']) => {
        switch (status) {
            case 'pending':
                return <Clock className="w-4 h-4 text-yellow-600" />;
            case 'in_progress':
                return <AlertCircle className="w-4 h-4 text-blue-600" />;
            case 'completed':
                return <CheckCircle className="w-4 h-4 text-green-600" />;
            case 'replied':
                return <MessageSquare className="w-4 h-4 text-purple-600" />;
            case 'rejected':
                return <AlertCircle className="w-4 h-4 text-red-600" />;
            default:
                return <Clock className="w-4 h-4 text-gray-600" />;
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
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const truncateText = (text: string, maxLength: number = 50) => {
        return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
    };

    // 데이터 로딩 중인 경우
    if (loading && feedbacks.length === 0) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <span className="ml-2">건의사항을 불러오는 중...</span>
            </div>
        );
    }

    // 에러가 있는 경우
    if (error) {
        return (
            <div className="flex flex-col items-center justify-center h-64 space-y-4">
                <AlertCircle className="w-16 h-16 text-red-500" />
                <div className="text-center">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">오류가 발생했습니다</h3>
                    <p className="text-gray-600">{error}</p>
                </div>
                <Button onClick={loadFeedbacks} variant="outline">
                    다시 시도
                </Button>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* 헤더 */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">💌 건의사항 관리</h1>
                    <p className="text-gray-600 mt-1">사용자들의 건의사항을 확인하고 관리하세요</p>
                </div>
                <div className="text-right">
                    <div className="text-2xl font-bold text-blue-600">{totalFeedbacks.toLocaleString()}</div>
                    <div className="text-sm text-gray-500">전체 건의사항</div>
                </div>
            </div>

            {/* 통계 카드 */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <Card className="p-4">
                    <div className="text-center">
                        <div className="text-lg font-semibold text-yellow-600">
                            {feedbacks.filter((f) => f.status === 'pending').length}
                        </div>
                        <div className="text-sm text-gray-500">검토중</div>
                    </div>
                </Card>
                <Card className="p-4">
                    <div className="text-center">
                        <div className="text-lg font-semibold text-blue-600">
                            {feedbacks.filter((f) => f.status === 'in_progress').length}
                        </div>
                        <div className="text-sm text-gray-500">진행중</div>
                    </div>
                </Card>
                <Card className="p-4">
                    <div className="text-center">
                        <div className="text-lg font-semibold text-green-600">
                            {feedbacks.filter((f) => f.status === 'completed').length}
                        </div>
                        <div className="text-sm text-gray-500">완료</div>
                    </div>
                </Card>
                <Card className="p-4">
                    <div className="text-center">
                        <div className="text-lg font-semibold text-purple-600">
                            {feedbacks.filter((f) => f.status === 'replied').length}
                        </div>
                        <div className="text-sm text-gray-500">답변완료</div>
                    </div>
                </Card>
                <Card className="p-4">
                    <div className="text-center">
                        <div className="text-lg font-semibold text-red-600">{feedbacks.filter((f) => f.status === 'rejected').length}</div>
                        <div className="text-sm text-gray-500">반려</div>
                    </div>
                </Card>
            </div>

            {/* 검색 및 필터 */}
            <Card className="p-4">
                <div className="flex flex-col lg:flex-row gap-4">
                    {/* 검색 */}
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <input
                            type="text"
                            placeholder="제목, 내용, 작성자로 검색..."
                            value={searchTerm}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>

                    {/* 필터 */}
                    <div className="flex gap-2">
                        <select
                            value={selectedStatus}
                            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSelectedStatus(e.target.value)}
                            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="all">전체 상태</option>
                            <option value="pending">검토중</option>
                            <option value="in_progress">진행중</option>
                            <option value="completed">완료</option>
                            <option value="replied">답변완료</option>
                            <option value="rejected">반려</option>
                        </select>

                        <select
                            value={selectedCategory}
                            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSelectedCategory(e.target.value)}
                            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="all">전체 카테고리</option>
                            <option value="test_idea">새 테스트 아이디어</option>
                            <option value="feature">기능 개선 건의</option>
                            <option value="bug_report">오류 신고</option>
                            <option value="design">디자인 관련</option>
                            <option value="mobile">모바일 이슈</option>
                            <option value="other">기타 의견</option>
                        </select>

                        <Button onClick={handleExportFeedbacks} variant="outline">
                            <Download className="w-4 h-4 mr-2" />
                            내보내기
                        </Button>
                    </div>
                </div>

                {/* 대량 작업 */}
                {selectedFeedbacks.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600">{selectedFeedbacks.length}개 선택됨</span>
                            <div className="flex gap-2">
                                <Button size="sm" variant="outline" onClick={() => handleBulkStatusChange('in_progress')}>
                                    진행중으로
                                </Button>
                                <Button size="sm" variant="outline" onClick={() => handleBulkStatusChange('completed')}>
                                    완료로
                                </Button>
                                <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => handleBulkStatusChange('rejected')}
                                    className="text-red-600 border-red-600 hover:bg-red-50"
                                >
                                    반려
                                </Button>
                            </div>
                        </div>
                    </div>
                )}
            </Card>

            {/* 테이블 */}
            <div className="bg-white rounded-lg border overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b">
                            <tr>
                                <th className="px-4 py-3 text-left">
                                    <input
                                        type="checkbox"
                                        checked={selectedFeedbacks.length === feedbacks.length && feedbacks.length > 0}
                                        onChange={(e) => {
                                            if (e.target.checked) {
                                                setSelectedFeedbacks(feedbacks.map((f) => f.id));
                                            } else {
                                                setSelectedFeedbacks([]);
                                            }
                                        }}
                                        className="rounded border-gray-300"
                                    />
                                </th>
                                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">제목</th>
                                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">카테고리</th>
                                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">작성자</th>
                                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">상태</th>
                                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">작성일</th>
                                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">조회수</th>
                                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">액션</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {feedbacks.map((feedback) => (
                                <tr key={feedback.id} className="hover:bg-gray-50 cursor-pointer">
                                    <td className="px-4 py-3">
                                        <input
                                            type="checkbox"
                                            checked={selectedFeedbacks.includes(feedback.id)}
                                            onChange={(e) => {
                                                if (e.target.checked) {
                                                    setSelectedFeedbacks((prev) => [...prev, feedback.id]);
                                                } else {
                                                    setSelectedFeedbacks((prev) => prev.filter((id) => id !== feedback.id));
                                                }
                                            }}
                                            className="rounded border-gray-300"
                                        />
                                    </td>
                                    <td
                                        className="px-4 py-3"
                                        onClick={() => {
                                            setSelectedFeedback(feedback);
                                            setShowDetailModal(true);
                                        }}
                                    >
                                        <div className="flex items-center gap-2">
                                            <div>
                                                <div className="font-medium text-gray-900">{truncateText(feedback.title)}</div>
                                                <div className="text-sm text-gray-500">{truncateText(feedback.content, 30)}</div>
                                            </div>
                                            {feedback.attached_file_url && <FileText className="w-4 h-4 text-blue-500" />}
                                        </div>
                                    </td>
                                    <td className="px-4 py-3">
                                        <Badge variant="outline" className="text-xs">
                                            {getCategoryLabel(feedback.category)}
                                        </Badge>
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-2">
                                            <User className="w-4 h-4 text-gray-400" />
                                            <span className="text-sm text-gray-900">{feedback.author_name}</span>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3">
                                        <Badge className={`flex items-center gap-1 w-fit ${getStatusColor(feedback.status)}`}>
                                            {getStatusIcon(feedback.status)}
                                            {getStatusText(feedback.status)}
                                        </Badge>
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-2">
                                            <Calendar className="w-4 h-4 text-gray-400" />
                                            <span className="text-sm text-gray-900">{formatDate(feedback.created_at)}</span>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3">
                                        <span className="text-sm text-gray-900">{feedback.views}</span>
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-2">
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setSelectedFeedback(feedback);
                                                    setShowDetailModal(true);
                                                }}
                                            >
                                                <Eye className="w-4 h-4" />
                                            </Button>

                                            <select
                                                value={feedback.status}
                                                onChange={(e) => {
                                                    e.stopPropagation();
                                                    handleStatusToggle(feedback.id, feedback.status);
                                                }}
                                                className="text-xs px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                                            >
                                                <option value="pending">검토중</option>
                                                <option value="in_progress">진행중</option>
                                                <option value="completed">완료</option>
                                                <option value="replied">답변완료</option>
                                                <option value="rejected">반려</option>
                                            </select>

                                            {!feedback.admin_reply && (
                                                <Button
                                                    size="sm"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setShowReplyModal(feedback.id);
                                                    }}
                                                    className="bg-purple-600 hover:bg-purple-700"
                                                >
                                                    <MessageSquare className="w-4 h-4" />
                                                </Button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* 페이지네이션 */}
                {totalPages > 1 && (
                    <div className="px-4 py-3 border-t border-gray-200 flex items-center justify-between">
                        <div className="text-sm text-gray-500">
                            전체 {totalFeedbacks.toLocaleString()}개 중 {(currentPage - 1) * pageSize + 1}-
                            {Math.min(currentPage * pageSize, totalFeedbacks)}개 표시
                        </div>
                        <div className="flex gap-2">
                            <Button
                                size="sm"
                                variant="outline"
                                disabled={currentPage === 1}
                                onClick={() => setCurrentPage((prev) => prev - 1)}
                            >
                                이전
                            </Button>
                            <span className="px-3 py-1 text-sm">
                                {currentPage} / {totalPages}
                            </span>
                            <Button
                                size="sm"
                                variant="outline"
                                disabled={currentPage === totalPages}
                                onClick={() => setCurrentPage((prev) => prev + 1)}
                            >
                                다음
                            </Button>
                        </div>
                    </div>
                )}
            </div>

            {/* 빈 상태 */}
            {feedbacks.length === 0 && !loading && (
                <Card className="p-12 text-center">
                    <MessageSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">건의사항이 없습니다</h3>
                    <p className="text-gray-500">
                        {searchTerm || selectedStatus !== 'all' || selectedCategory !== 'all'
                            ? '검색 조건을 변경하거나 필터를 초기화해보세요.'
                            : '새로운 건의사항이 등록되면 여기에 표시됩니다.'}
                    </p>
                </Card>
            )}

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
function FeedbackDetailModal({
    feedback,
    onClose,
    onUpdate,
    onReply,
}: {
    feedback: Feedback;
    onClose: () => void;
    onReply: (id: string) => void;
}) {
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
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">내용</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="bg-gray-50 rounded-lg p-4">
                                <p className="text-gray-900 whitespace-pre-wrap">{feedback.content}</p>
                            </div>
                        </CardContent>
                    </Card>

                    {/* 관리자 답변 */}
                    {feedback.admin_reply && (
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg flex items-center gap-2">
                                    <MessageSquare className="w-5 h-5 text-purple-600" />
                                    관리자 답변
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                                    <p className="text-purple-900">{feedback.admin_reply}</p>
                                    {feedback.admin_reply_at && (
                                        <p className="text-sm text-purple-600 mt-2">{formatDate(feedback.admin_reply_at)}</p>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>
        </div>
    );
}

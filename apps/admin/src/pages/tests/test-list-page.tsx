import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, Button, Badge } from '@repo/ui';
import { testApi } from '@repo/supabase';
import type { Test } from '../../types/test';
import { Search, Eye, Edit, Trash2, Globe, Lock, Plus, Calendar, MessageSquare, BarChart3, Download, Copy } from 'lucide-react';

export function TestListPage() {
    const [tests, setTests] = useState<Test[]>([]);
    const [filteredTests, setFilteredTests] = useState<Test[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<'all' | 'published' | 'draft'>('all');
    const [categoryFilter, setCategoryFilter] = useState<string>('all');
    const [sortBy, setSortBy] = useState<'createdAt' | 'title' | 'responseCount'>('createdAt');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
    const [selectedTests, setSelectedTests] = useState<string[]>([]);
    const [selectedTest, setSelectedTest] = useState<Test | null>(null);
    const [showDetailModal, setShowDetailModal] = useState(false);

    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const pageSize = 20;

    useEffect(() => {
        loadTests();
    }, []);

    useEffect(() => {
        filterAndSortTests();
    }, [filterAndSortTests]);

    const loadTests = async () => {
        try {
            const data = await testApi.getAllTests();
            setTests(data);
        } catch (error) {
            console.error('테스트 목록을 불러오는데 실패했습니다:', error);
        } finally {
            setLoading(false);
        }
    };

    const filterAndSortTests = useCallback(() => {
        const filtered = tests.filter((test) => {
            const matchesSearch =
                test.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                test.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                test.category.toLowerCase().includes(searchTerm.toLowerCase());

            const matchesStatus =
                statusFilter === 'all' ||
                (statusFilter === 'published' && test.isPublished) ||
                (statusFilter === 'draft' && !test.isPublished);

            const matchesCategory = categoryFilter === 'all' || test.category === categoryFilter;

            return matchesSearch && matchesStatus && matchesCategory;
        });

        // 정렬
        filtered.sort((a, b) => {
            let aValue: string | number, bValue: string | number;

            switch (sortBy) {
                case 'title':
                    aValue = a.title.toLowerCase();
                    bValue = b.title.toLowerCase();
                    break;
                case 'responseCount':
                    aValue = 0; // responseCount는 아직 구현되지 않음
                    bValue = 0;
                    break;
                case 'createdAt':
                default:
                    aValue = new Date(a.createdAt).getTime();
                    bValue = new Date(b.createdAt).getTime();
                    break;
            }

            if (sortOrder === 'asc') {
                return aValue > bValue ? 1 : -1;
            } else {
                return aValue < bValue ? 1 : -1;
            }
        });

        // 페이지네이션
        const startIndex = (currentPage - 1) * pageSize;
        const endIndex = startIndex + pageSize;
        const paginatedData = filtered.slice(startIndex, endIndex);

        setFilteredTests(paginatedData);
        setTotalPages(Math.ceil(filtered.length / pageSize));
    }, [tests, searchTerm, statusFilter, categoryFilter, sortBy, sortOrder, currentPage]);

    const handleTogglePublish = async (testId: string, currentStatus: boolean) => {
        try {
            await testApi.togglePublishStatus(testId, !currentStatus);
            await loadTests();
        } catch (error) {
            console.error('상태 변경에 실패했습니다:', error);
        }
    };

    const handleDelete = async (testId: string) => {
        if (window.confirm('정말로 이 테스트를 삭제하시겠습니까?')) {
            try {
                await testApi.deleteTest(testId);
                await loadTests();
            } catch (error) {
                console.error('테스트 삭제에 실패했습니다:', error);
            }
        }
    };

    const handleBulkPublish = async (isPublished: boolean) => {
        if (selectedTests.length === 0) return;

        try {
            for (const testId of selectedTests) {
                await testApi.togglePublishStatus(testId, isPublished);
            }
            setSelectedTests([]);
            loadTests();
        } catch (error) {
            console.error('대량 상태 변경 실패:', error);
        }
    };

    const handleBulkDelete = async () => {
        if (selectedTests.length === 0) return;
        if (!window.confirm(`선택한 ${selectedTests.length}개의 테스트를 삭제하시겠습니까?`)) return;

        try {
            for (const testId of selectedTests) {
                await testApi.deleteTest(testId);
            }
            setSelectedTests([]);
            loadTests();
        } catch (error) {
            console.error('대량 삭제 실패:', error);
        }
    };

    const getStatusIcon = (isPublished: boolean) => {
        return isPublished ? <Globe className="w-4 h-4 text-green-600" /> : <Lock className="w-4 h-4 text-yellow-600" />;
    };

    const getStatusColor = (isPublished: boolean) => {
        return isPublished ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800';
    };

    const getStatusText = (isPublished: boolean) => {
        return isPublished ? '공개' : '비공개';
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

    const truncateText = (text: string, maxLength: number = 40) => {
        return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
    };

    const getUniqueCategories = () => {
        const categories = [...new Set(tests.map((test) => test.category))];
        return categories.filter(Boolean);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <span className="ml-2">테스트 목록을 불러오는 중...</span>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* 헤더 */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">🧪 테스트 관리</h1>
                    <p className="text-gray-600 mt-1">모든 테스트를 관리하고 모니터링할 수 있습니다</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="text-right">
                        <div className="text-2xl font-bold text-blue-600">{tests.length}</div>
                        <div className="text-sm text-gray-500">전체 테스트</div>
                    </div>
                    <Link to="/tests/create">
                        <Button className="bg-blue-600 hover:bg-blue-700">
                            <Plus className="w-4 h-4 mr-2" />새 테스트 생성
                        </Button>
                    </Link>
                </div>
            </div>

            {/* 통계 카드 */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card className="p-4">
                    <div className="text-center">
                        <div className="text-lg font-semibold text-blue-600">{tests.length}</div>
                        <div className="text-sm text-gray-500">전체 테스트</div>
                    </div>
                </Card>
                <Card className="p-4">
                    <div className="text-center">
                        <div className="text-lg font-semibold text-green-600">{tests.filter((t) => t.isPublished).length}</div>
                        <div className="text-sm text-gray-500">공개</div>
                    </div>
                </Card>
                <Card className="p-4">
                    <div className="text-center">
                        <div className="text-lg font-semibold text-yellow-600">{tests.filter((t) => !t.isPublished).length}</div>
                        <div className="text-sm text-gray-500">비공개</div>
                    </div>
                </Card>
                <Card className="p-4">
                    <div className="text-center">
                        <div className="text-lg font-semibold text-purple-600">0</div>
                        <div className="text-sm text-gray-500">총 응답</div>
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
                            placeholder="테스트 제목, 설명, 카테고리로 검색..."
                            value={searchTerm}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>

                    {/* 필터 */}
                    <div className="flex gap-2">
                        <select
                            value={statusFilter}
                            onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                                setStatusFilter(e.target.value as 'all' | 'published' | 'draft')
                            }
                            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="all">전체 상태</option>
                            <option value="published">공개</option>
                            <option value="draft">비공개</option>
                        </select>

                        <select
                            value={categoryFilter}
                            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setCategoryFilter(e.target.value)}
                            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="all">전체 카테고리</option>
                            {getUniqueCategories().map((category) => (
                                <option key={category} value={category}>
                                    {category}
                                </option>
                            ))}
                        </select>

                        <select
                            value={`${sortBy}-${sortOrder}`}
                            onChange={(e) => {
                                const [sort, order] = e.target.value.split('-');
                                setSortBy(sort as 'createdAt' | 'title' | 'responseCount');
                                setSortOrder(order as 'asc' | 'desc');
                            }}
                            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="createdAt-desc">최신순</option>
                            <option value="createdAt-asc">오래된순</option>
                            <option value="title-asc">제목순</option>
                            <option value="responseCount-desc">응답순</option>
                        </select>

                        <Button variant="outline">
                            <Download className="w-4 h-4 mr-2" />
                            내보내기
                        </Button>
                    </div>
                </div>

                {/* 대량 작업 */}
                {selectedTests.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600">{selectedTests.length}개 선택됨</span>
                            <div className="flex gap-2">
                                <Button size="sm" variant="outline" onClick={() => handleBulkPublish(true)}>
                                    <Globe className="w-4 h-4 mr-1" />
                                    공개
                                </Button>
                                <Button size="sm" variant="outline" onClick={() => handleBulkPublish(false)}>
                                    <Lock className="w-4 h-4 mr-1" />
                                    비공개
                                </Button>
                                <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={handleBulkDelete}
                                    className="text-red-600 border-red-600 hover:bg-red-50"
                                >
                                    <Trash2 className="w-4 h-4 mr-1" />
                                    삭제
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
                                        checked={selectedTests.length === filteredTests.length && filteredTests.length > 0}
                                        onChange={(e) => {
                                            if (e.target.checked) {
                                                setSelectedTests(filteredTests.map((t) => t.id));
                                            } else {
                                                setSelectedTests([]);
                                            }
                                        }}
                                        className="rounded border-gray-300"
                                    />
                                </th>
                                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">테스트</th>
                                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">카테고리</th>
                                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">상태</th>
                                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">구성</th>
                                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">응답수</th>
                                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">생성일</th>
                                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">액션</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {filteredTests.map((test) => (
                                <tr key={test.id} className="hover:bg-gray-50 cursor-pointer">
                                    <td className="px-4 py-3">
                                        <input
                                            type="checkbox"
                                            checked={selectedTests.includes(test.id)}
                                            onChange={(e) => {
                                                if (e.target.checked) {
                                                    setSelectedTests((prev) => [...prev, test.id]);
                                                } else {
                                                    setSelectedTests((prev) => prev.filter((id) => id !== test.id));
                                                }
                                            }}
                                            className="rounded border-gray-300"
                                        />
                                    </td>
                                    <td
                                        className="px-4 py-3"
                                        onClick={() => {
                                            setSelectedTest(test);
                                            setShowDetailModal(true);
                                        }}
                                    >
                                        <div className="flex items-center gap-3">
                                            <span className="text-2xl">{test.emoji}</span>
                                            <div>
                                                <div className="font-medium text-gray-900">{truncateText(test.title)}</div>
                                                <div className="text-sm text-gray-500">{truncateText(test.description, 50)}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3">
                                        <Badge variant="outline" className="text-xs">
                                            {test.category}
                                        </Badge>
                                    </td>
                                    <td className="px-4 py-3">
                                        <Badge className={`flex items-center gap-1 w-fit ${getStatusColor(test.isPublished)}`}>
                                            {getStatusIcon(test.isPublished)}
                                            {getStatusText(test.isPublished)}
                                        </Badge>
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="text-sm text-gray-900">
                                            <div>질문 {test.questions.length}개</div>
                                            <div className="text-xs text-gray-500">결과 {test.results.length}개</div>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-1">
                                            <MessageSquare className="w-4 h-4 text-gray-400" />
                                            <span className="text-sm text-gray-900">0</span>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-2">
                                            <Calendar className="w-4 h-4 text-gray-400" />
                                            <span className="text-sm text-gray-900">{formatDate(test.createdAt)}</span>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-2">
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setSelectedTest(test);
                                                    setShowDetailModal(true);
                                                }}
                                            >
                                                <Eye className="w-4 h-4" />
                                            </Button>

                                            <Link to={`/tests/${test.id}/edit`}>
                                                <Button size="sm" variant="outline">
                                                    <Edit className="w-4 h-4" />
                                                </Button>
                                            </Link>

                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleTogglePublish(test.id, test.isPublished);
                                                }}
                                                className={test.isPublished ? 'text-yellow-600' : 'text-green-600'}
                                            >
                                                {test.isPublished ? <Lock className="w-4 h-4" /> : <Globe className="w-4 h-4" />}
                                            </Button>

                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleDelete(test.id);
                                                }}
                                                className="text-red-600 border-red-600 hover:bg-red-50"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
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
                            전체 {tests.length}개 중 {(currentPage - 1) * pageSize + 1}-{Math.min(currentPage * pageSize, tests.length)}개
                            표시
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
            {filteredTests.length === 0 && !loading && (
                <Card className="p-12 text-center">
                    <div className="text-6xl mb-4">🧪</div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                        {searchTerm || statusFilter !== 'all' || categoryFilter !== 'all'
                            ? '검색 결과가 없습니다'
                            : '아직 생성된 테스트가 없습니다'}
                    </h3>
                    <p className="text-gray-500 mb-6">
                        {searchTerm || statusFilter !== 'all' || categoryFilter !== 'all'
                            ? '다른 검색어나 필터를 시도해보세요'
                            : '첫 번째 테스트를 생성하고 시작해보세요'}
                    </p>
                    <Link to="/tests/create">
                        <Button className="bg-blue-600 hover:bg-blue-700">
                            <Plus className="w-4 h-4 mr-2" />첫 번째 테스트 생성하기
                        </Button>
                    </Link>
                </Card>
            )}

            {/* 상세보기 모달 */}
            {showDetailModal && selectedTest && (
                <TestDetailModal
                    test={selectedTest}
                    onClose={() => {
                        setShowDetailModal(false);
                        setSelectedTest(null);
                    }}
                />
            )}
        </div>
    );
}

// 테스트 상세보기 모달 컴포넌트
function TestDetailModal({ test, onClose }: { test: Test; onClose: () => void }) {
    const getStatusIcon = (isPublished: boolean) => {
        return isPublished ? <Globe className="w-5 h-5 text-green-600" /> : <Lock className="w-5 h-5 text-yellow-600" />;
    };

    const getStatusColor = (isPublished: boolean) => {
        return isPublished ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800';
    };

    const getStatusText = (isPublished: boolean) => {
        return isPublished ? '공개' : '비공개';
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
            <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6 border-b border-gray-200 flex items-center justify-between">
                    <h2 className="text-xl font-semibold">테스트 상세보기</h2>
                    <Button variant="outline" onClick={onClose}>
                        ✕
                    </Button>
                </div>

                <div className="p-6 space-y-6">
                    {/* 헤더 영역 */}
                    <div className="flex items-start justify-between">
                        <div className="flex-1">
                            <div className="flex items-center gap-3 mb-3">
                                <span className="text-3xl">{test.emoji}</span>
                                <h3 className="text-2xl font-semibold text-gray-900">{test.title}</h3>
                            </div>
                            <p className="text-gray-600 mb-4">{test.description}</p>
                            <div className="flex items-center gap-4 text-sm text-gray-500">
                                <div className="flex items-center gap-1">
                                    <Calendar className="w-4 h-4" />
                                    <span>{formatDate(test.createdAt)}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <MessageSquare className="w-4 h-4" />
                                    <span>0개 응답</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <BarChart3 className="w-4 h-4" />
                                    <span>0% 완료율</span>
                                </div>
                            </div>
                        </div>

                        {/* 상태 및 액션 */}
                        <div className="flex items-center gap-3 ml-4">
                            <Badge variant="outline" className="whitespace-nowrap">
                                {test.category}
                            </Badge>
                            <Badge className={`flex items-center gap-1 whitespace-nowrap ${getStatusColor(test.isPublished)}`}>
                                {getStatusIcon(test.isPublished)}
                                {getStatusText(test.isPublished)}
                            </Badge>

                            <Link to={`/tests/${test.id}/edit`}>
                                <Button size="sm" variant="outline" className="whitespace-nowrap">
                                    <Edit className="w-4 h-4 mr-1" />
                                    수정
                                </Button>
                            </Link>

                            <Button size="sm" variant="outline" className="whitespace-nowrap">
                                <Copy className="w-4 h-4 mr-1" />
                                복제
                            </Button>
                        </div>
                    </div>

                    {/* 구성 정보 */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">테스트 구성</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                                        <div className="text-2xl font-bold text-blue-600">{test.questions.length}</div>
                                        <div className="text-sm text-gray-600">질문 수</div>
                                    </div>
                                    <div className="text-center p-4 bg-green-50 rounded-lg">
                                        <div className="text-2xl font-bold text-green-600">{test.results.length}</div>
                                        <div className="text-sm text-gray-600">결과 수</div>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-600">예상 소요시간</span>
                                        <span className="font-medium">{test.questions.length * 0.5}분</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-600">난이도</span>
                                        <span className="font-medium">보통</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">통계</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="text-center p-4 bg-purple-50 rounded-lg">
                                        <div className="text-2xl font-bold text-purple-600">0</div>
                                        <div className="text-sm text-gray-600">총 응답</div>
                                    </div>
                                    <div className="text-center p-4 bg-orange-50 rounded-lg">
                                        <div className="text-2xl font-bold text-orange-600">0%</div>
                                        <div className="text-sm text-gray-600">완료율</div>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-600">일일 평균 응답</span>
                                        <span className="font-medium">0개</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-600">평균 소요시간</span>
                                        <span className="font-medium">-분</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* 질문 미리보기 */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">질문 미리보기</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                {test.questions.slice(0, 3).map((question, index) => (
                                    <div key={index} className="p-3 bg-gray-50 rounded-lg">
                                        <div className="font-medium text-gray-900 mb-2">
                                            {index + 1}. {question.text}
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                                            {question.options.map((option, optIndex) => (
                                                <div key={optIndex} className="text-gray-600">
                                                    {String.fromCharCode(65 + optIndex)}. {option.text}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                                {test.questions.length > 3 && (
                                    <div className="text-center text-gray-500 text-sm py-2">
                                        ... 그 외 {test.questions.length - 3}개 질문
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* 결과 유형 */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">결과 유형</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {test.results.map((result, index) => (
                                    <div key={index} className="p-4 border border-gray-200 rounded-lg">
                                        <div className="flex items-center gap-2 mb-2">
                                            <span className="text-xl">🎯</span>
                                            <span className="font-semibold text-gray-900">{result.title}</span>
                                        </div>
                                        <p className="text-sm text-gray-600">{result.description}</p>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}

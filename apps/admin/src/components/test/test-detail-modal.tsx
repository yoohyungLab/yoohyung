import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button, Badge, Card, CardContent, CardHeader, CardTitle } from '@repo/ui';
import { formatDateLong } from '@repo/shared';
import { X, Edit, Globe, Lock, Trash2, Copy, Calendar, Clock, BarChart3, Eye, Users, Palette, Play, ChevronRight } from 'lucide-react';
import type { Test } from '../../types/test';
import {
    getTestTypeInfo,
    getTestStatusInfo,
    formatTestDuration,
    calculateEstimatedTime,
    getQuestionStats,
    getResultStats,
} from '@/shared/lib/test-utils';

interface TestDetailModalProps {
    test: Test;
    onClose: () => void;
    onTogglePublish: (testId: string, currentStatus: boolean) => void;
    onDelete: (testId: string) => void;
}

type TabType = 'basic' | 'questions' | 'results' | 'preview';

export function TestDetailModal({ test, onClose, onTogglePublish, onDelete }: TestDetailModalProps) {
    const [activeTab, setActiveTab] = useState<TabType>('basic');
    const [previewQuestionIndex, setPreviewQuestionIndex] = useState(0);

    const typeInfo = getTestTypeInfo(test.type || 'psychology');
    const statusInfo = getTestStatusInfo(test.status || 'draft');
    const questionStats = getQuestionStats(test);
    const resultStats = getResultStats(test);
    const estimatedTime = calculateEstimatedTime(test);

    const tabs = [
        { id: 'basic', label: '기본 정보' },
        { id: 'questions', label: '질문 요약' },
        { id: 'results', label: '결과 요약' },
        { id: 'preview', label: '미리보기' },
    ] as const;

    const handleTogglePublish = async () => {
        await onTogglePublish(test.id, test.status === 'published');
        // 모달은 부모 컴포넌트가 상태를 업데이트하므로 별도 처리 불필요
    };

    const handleDelete = () => {
        if (confirm('정말로 이 테스트를 삭제하시겠습니까?')) {
            onDelete(test.id);
            onClose();
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-6xl w-full max-h-[90vh] overflow-hidden flex flex-col">
                {/* 헤더 */}
                <div className="p-6 border-b border-gray-200">
                    {/* 상단 영역 */}
                    <div className="flex items-start justify-between mb-4">
                        <div className="flex items-start gap-4 flex-1">
                            {/* 썸네일 */}
                            <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center flex-shrink-0">
                                {test.thumbnailImage ? (
                                    <img src={test.thumbnailImage} alt={test.title} className="w-full h-full object-cover" />
                                ) : (
                                    <span className="text-2xl font-bold">{test.title[0] || 'T'}</span>
                                )}
                            </div>

                            {/* 제목 및 정보 */}
                            <div className="flex-1 min-w-0">
                                <h2 className="text-2xl font-bold text-gray-900 mb-2 truncate">{test.title}</h2>
                                <div className="flex items-center gap-3 mb-3">
                                    <Badge variant="outline">{test.category}</Badge>
                                    <Badge variant="outline">{typeInfo.name}</Badge>
                                    <Badge variant="outline">{statusInfo.name}</Badge>
                                </div>
                                <p className="text-gray-600 text-sm">{test.description}</p>
                            </div>
                        </div>

                        {/* 닫기 버튼 */}
                        <Button variant="ghost" size="sm" onClick={onClose} className="h-8 w-8 p-0">
                            <X className="h-4 w-4" />
                        </Button>
                    </div>

                    {/* 탭 네비게이션 */}
                    <div className="flex gap-1 border-b border-gray-200 -mb-px">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center gap-2 px-4 py-2 border-b-2 transition-colors ${
                                    activeTab === tab.id
                                        ? 'border-blue-500 text-blue-600 bg-blue-50'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                }`}
                            >
                                <span className="text-sm font-medium">{tab.label}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* 콘텐츠 */}
                <div className="flex-1 overflow-y-auto">
                    {activeTab === 'basic' && (
                        <div className="p-6 space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* 기본 정보 */}
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="text-lg">기본 정보</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="grid grid-cols-2 gap-4 text-sm">
                                            <div>
                                                <span className="text-gray-500">생성일</span>
                                                <div className="font-medium">{formatDateLong(test.createdAt)}</div>
                                            </div>
                                            <div>
                                                <span className="text-gray-500">수정일</span>
                                                <div className="font-medium">{formatDateLong(test.updatedAt)}</div>
                                            </div>
                                            <div>
                                                <span className="text-gray-500">예상 소요시간</span>
                                                <div className="font-medium">{formatTestDuration(estimatedTime)}</div>
                                            </div>
                                            <div>
                                                <span className="text-gray-500">완료 수</span>
                                                <div className="font-medium">{test.completion_count || 0}개</div>
                                            </div>
                                            <div>
                                                <span className="text-gray-500">공유 수</span>
                                                <div className="font-medium">{test.share_count || 0}개</div>
                                            </div>
                                            <div>
                                                <span className="text-gray-500">응답 수</span>
                                                <div className="font-medium">{test.responseCount || 0}개</div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* 노출 설정 */}
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="text-lg">노출 설정</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div>
                                            <span className="text-sm text-gray-500">현재 상태</span>
                                            <div className="flex items-center gap-2 mt-1">
                                                <Badge variant="outline">{statusInfo.name}</Badge>
                                                {test.status === 'scheduled' && test.scheduledAt && (
                                                    <span className="text-sm text-gray-600">
                                                        {formatDateLong(test.scheduledAt)} 공개 예정
                                                    </span>
                                                )}
                                            </div>
                                        </div>

                                        <div>
                                            <span className="text-sm text-gray-500">완료율</span>
                                            <div className="mt-1">
                                                <div className="flex items-center gap-2">
                                                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                                                        <div
                                                            className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                                                            style={{ width: `${test.completionRate || 0}%` }}
                                                        />
                                                    </div>
                                                    <span className="text-sm font-medium">{test.completionRate || 0}%</span>
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                    )}

                    {activeTab === 'questions' && (
                        <div className="p-6 space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* 질문 통계 */}
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="text-lg">질문 통계</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="text-center p-4 bg-blue-50 rounded-lg">
                                                <div className="text-2xl font-bold text-blue-600">{questionStats.total}</div>
                                                <div className="text-sm text-gray-600">총 질문 수</div>
                                            </div>
                                            <div className="text-center p-4 bg-green-50 rounded-lg">
                                                <div className="text-2xl font-bold text-green-600">{questionStats.avgOptions}</div>
                                                <div className="text-sm text-gray-600">평균 보기 수</div>
                                            </div>
                                            <div className="text-center p-4 bg-purple-50 rounded-lg">
                                                <div className="text-2xl font-bold text-purple-600">{questionStats.minOptions}</div>
                                                <div className="text-sm text-gray-600">최소 보기 수</div>
                                            </div>
                                            <div className="text-center p-4 bg-orange-50 rounded-lg">
                                                <div className="text-2xl font-bold text-orange-600">{questionStats.maxOptions}</div>
                                                <div className="text-sm text-gray-600">최대 보기 수</div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* 그룹 정보 */}
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="text-lg">그룹 정보</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        {questionStats.groups.length > 0 ? (
                                            <div className="space-y-2">
                                                {questionStats.groups.map((group, index) => (
                                                    <div
                                                        key={index}
                                                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                                                    >
                                                        <span className="font-medium">{group}</span>
                                                        <Badge variant="outline">
                                                            {test.questions.filter((q) => q.group === group).length}개
                                                        </Badge>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="text-center py-8 text-gray-500">그룹이 설정되지 않았습니다</div>
                                        )}
                                    </CardContent>
                                </Card>
                            </div>

                            {/* 질문 목록 미리보기 */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-lg">질문 목록</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-3 max-h-64 overflow-y-auto">
                                        {test.questions.slice(0, 5).map((question, index) => (
                                            <div key={index} className="p-3 border border-gray-200 rounded-lg">
                                                <div className="font-medium text-gray-900 mb-2">
                                                    {index + 1}. {question.text}
                                                </div>
                                                <div className="text-sm text-gray-500">
                                                    {question.options.length}개 보기
                                                    {question.group && ` • ${question.group} 그룹`}
                                                </div>
                                            </div>
                                        ))}
                                        {test.questions.length > 5 && (
                                            <div className="text-center text-gray-500 text-sm py-2">
                                                ... 그 외 {test.questions.length - 5}개 질문
                                            </div>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    )}

                    {activeTab === 'results' && (
                        <div className="p-6 space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* 결과 통계 */}
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="text-lg">결과 통계</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="text-center p-4 bg-blue-50 rounded-lg">
                                                <div className="text-2xl font-bold text-blue-600">{resultStats.total}</div>
                                                <div className="text-sm text-gray-600">총 결과 수</div>
                                            </div>
                                            <div className="text-center p-4 bg-green-50 rounded-lg">
                                                <div className="text-2xl font-bold text-green-600">{resultStats.withEmoji}</div>
                                                <div className="text-sm text-gray-600">이모지 있음</div>
                                            </div>
                                            <div className="text-center p-4 bg-purple-50 rounded-lg">
                                                <div className="text-2xl font-bold text-purple-600">{resultStats.withTheme}</div>
                                                <div className="text-sm text-gray-600">테마 색상</div>
                                            </div>
                                            <div className="text-center p-4 bg-orange-50 rounded-lg">
                                                <div className="text-2xl font-bold text-orange-600">{resultStats.avgKeywords}</div>
                                                <div className="text-sm text-gray-600">평균 키워드</div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* 대표 결과 */}
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="text-lg">대표 결과 샘플</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        {test.results.slice(0, 2).map((result, index) => (
                                            <div key={index} className="p-4 border border-gray-200 rounded-lg mb-3 last:mb-0">
                                                <div className="flex items-center gap-3 mb-2">
                                                    <span className="text-2xl">🎯</span>
                                                    <div className="flex-1">
                                                        <h4 className="font-semibold text-gray-900">{result.title}</h4>
                                                        {result.themeColor && (
                                                            <div
                                                                className="w-4 h-4 rounded-full mt-1"
                                                                style={{ backgroundColor: result.themeColor }}
                                                            />
                                                        )}
                                                    </div>
                                                </div>
                                                <p className="text-sm text-gray-600 mb-2">{result.description}</p>
                                                {result.keywords && result.keywords.length > 0 && (
                                                    <div className="flex flex-wrap gap-1">
                                                        {result.keywords.slice(0, 3).map((keyword, kidx) => (
                                                            <Badge key={kidx} variant="outline" className="text-xs">
                                                                {keyword}
                                                            </Badge>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </CardContent>
                                </Card>
                            </div>

                            {/* 모든 결과 목록 */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-lg">전체 결과 목록</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                        {test.results.map((result, index) => (
                                            <div key={index} className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg">
                                                <span className="text-xl">🎯</span>
                                                <div className="flex-1 min-w-0">
                                                    <div className="font-medium text-gray-900 truncate">{result.title}</div>
                                                    <div className="text-sm text-gray-500">{result.keywords?.length || 0}개 키워드</div>
                                                </div>
                                                {result.themeColor && (
                                                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: result.themeColor }} />
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    )}

                    {activeTab === 'preview' && (
                        <div className="p-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-lg flex items-center gap-2">
                                        <Play className="w-5 h-5" />
                                        테스트 미리보기
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="bg-gray-50 rounded-lg p-6">
                                        <div className="max-w-md mx-auto">
                                            {/* 시작 화면 */}
                                            {previewQuestionIndex === -1 && (
                                                <div className="text-center space-y-4">
                                                    <div className="text-4xl mb-4">{test.title[0] || 'T'}</div>
                                                    <h3 className="text-xl font-bold">{test.title}</h3>
                                                    <p className="text-gray-600">{test.startMessage}</p>
                                                    <Button onClick={() => setPreviewQuestionIndex(0)} className="w-full">
                                                        테스트 시작하기
                                                    </Button>
                                                </div>
                                            )}

                                            {/* 질문 화면 */}
                                            {previewQuestionIndex >= 0 && previewQuestionIndex < test.questions.length && (
                                                <div className="space-y-4">
                                                    <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                                                        <span>
                                                            {previewQuestionIndex + 1} / {test.questions.length}
                                                        </span>
                                                        <div className="w-32 bg-gray-200 rounded-full h-2">
                                                            <div
                                                                className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                                                                style={{
                                                                    width: `${((previewQuestionIndex + 1) / test.questions.length) * 100}%`,
                                                                }}
                                                            />
                                                        </div>
                                                    </div>

                                                    <h4 className="text-lg font-semibold mb-4">
                                                        {test.questions[previewQuestionIndex].text}
                                                    </h4>

                                                    <div className="space-y-2">
                                                        {test.questions[previewQuestionIndex].options.map((option, optIndex) => (
                                                            <button
                                                                key={optIndex}
                                                                onClick={() => {
                                                                    if (previewQuestionIndex < test.questions.length - 1) {
                                                                        setPreviewQuestionIndex(previewQuestionIndex + 1);
                                                                    } else {
                                                                        setPreviewQuestionIndex(test.questions.length);
                                                                    }
                                                                }}
                                                                className="w-full p-3 text-left border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors"
                                                            >
                                                                {option.text}
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}

                                            {/* 결과 화면 */}
                                            {previewQuestionIndex >= test.questions.length && (
                                                <div className="text-center space-y-4">
                                                    <div className="text-4xl mb-4">🎉</div>
                                                    <h3 className="text-xl font-bold">{test.results[0]?.title || '결과'}</h3>
                                                    <p className="text-gray-600">
                                                        {test.results[0]?.description || '테스트가 완료되었습니다!'}
                                                    </p>
                                                    <Button
                                                        onClick={() => setPreviewQuestionIndex(-1)}
                                                        variant="outline"
                                                        className="w-full"
                                                    >
                                                        다시 시작하기
                                                    </Button>
                                                </div>
                                            )}

                                            {previewQuestionIndex === -1 && (
                                                <Button
                                                    onClick={() => setPreviewQuestionIndex(-1)}
                                                    variant="outline"
                                                    className="w-full mt-4"
                                                >
                                                    미리보기 시작
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    )}
                </div>

                {/* 하단 액션 버튼 */}
                <div className="p-6 border-t border-gray-200 bg-gray-50">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Badge variant="outline" className="text-xs">
                                <Clock className="w-3 h-3 mr-1" />
                                {formatTestDuration(estimatedTime)}
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                                <Users className="w-3 h-3 mr-1" />
                                {test.responseCount || 0}명 참여
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                                완료 {test.completion_count || 0}명
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                                공유 {test.share_count || 0}회
                            </Badge>
                        </div>

                        <div className="flex items-center gap-2">
                            <Button variant="outline" size="sm">
                                <Copy className="w-4 h-4 mr-2" />
                                복제하기
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={handleTogglePublish}
                                className={test.status === 'published' ? 'text-yellow-600' : 'text-green-600'}
                            >
                                {test.status === 'published' ? (
                                    <>
                                        <Lock className="w-4 h-4 mr-2" />
                                        비공개 전환
                                    </>
                                ) : (
                                    <>
                                        <Globe className="w-4 h-4 mr-2" />
                                        공개 전환
                                    </>
                                )}
                            </Button>
                            <Link to={`/tests/${test.id}/edit`}>
                                <Button size="sm">
                                    <Edit className="w-4 h-4 mr-2" />
                                    수정하기
                                </Button>
                            </Link>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={handleDelete}
                                className="text-red-600 border-red-600 hover:bg-red-50"
                            >
                                <Trash2 className="w-4 h-4 mr-2" />
                                삭제하기
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

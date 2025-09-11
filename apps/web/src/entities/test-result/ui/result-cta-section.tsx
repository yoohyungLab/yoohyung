import { useState, useEffect } from 'react';
import { MAIN_TESTS } from '@/shared/constants';
import { trackCtaClicked, trackNextTestImpression } from '@/shared/lib/analytics';

interface ResultCtaSectionProps {
    resultType: string;
    totalScore: number;
    isLoggedIn: boolean;
    onShare: () => void;
    onSave: () => void;
    onSignUp: () => void;
    onSubscribe: () => void;
}

export function ResultCtaSection({ totalScore, isLoggedIn, onShare, onSave, onSignUp, onSubscribe }: ResultCtaSectionProps) {
    const [showMoreTests, setShowMoreTests] = useState(false);

    // 추천 테스트 생성 (태그 기반)
    const getRecommendedTests = () => {
        const allTests = MAIN_TESTS.filter((test) => test.id !== 'egen-teto');

        // 점수에 따른 추천 로직
        if (totalScore >= 70) {
            return allTests.filter((test) => test.tags.some((tag) => ['성격', '진단', '자기계발'].includes(tag))).slice(0, 3);
        } else if (totalScore >= 40) {
            return allTests.filter((test) => test.tags.some((tag) => ['연애', '감정', '밸런스 게임'].includes(tag))).slice(0, 3);
        } else {
            return allTests.filter((test) => test.tags.some((tag) => ['지능', '퀴즈', '기타'].includes(tag))).slice(0, 3);
        }
    };

    const recommendedTests = getRecommendedTests();

    // 추천 테스트 노출 트래킹
    useEffect(() => {
        if (recommendedTests.length > 0) {
            trackNextTestImpression(
                recommendedTests.map((test, index) => ({
                    test_id: test.id,
                    rank: index + 1,
                })),
                'tag-based'
            );
        }
    }, [recommendedTests]);

    return (
        <div className="space-y-6">
            {/* 공유 섹션 */}
            <div className="bg-gradient-to-r from-pink-50 to-blue-50 rounded-2xl p-6 border border-pink-100">
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <span className="text-2xl">📤</span>
                    결과 공유하기
                </h3>
                <p className="text-gray-600 mb-4">친구들과 내 성향을 공유해보세요!</p>
                <div className="flex flex-wrap gap-3">
                    <button
                        onClick={onShare}
                        className="flex-1 min-w-[120px] bg-white hover:bg-gray-50 text-gray-700 font-medium py-3 px-4 rounded-lg border border-gray-200 transition-colors flex items-center justify-center gap-2"
                    >
                        <span className="text-lg">🔗</span>
                        링크 복사
                    </button>
                    <button
                        onClick={onShare}
                        className="flex-1 min-w-[120px] bg-yellow-400 hover:bg-yellow-500 text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
                    >
                        <span className="text-lg">💬</span>
                        카카오톡
                    </button>
                    <button
                        onClick={onShare}
                        className="flex-1 min-w-[120px] bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
                    >
                        <span className="text-lg">📸</span>
                        인스타그램
                    </button>
                </div>
            </div>

            {/* 추천 테스트 섹션 */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                        <span className="text-2xl">🎯</span>
                        추천 테스트
                    </h3>
                    <button
                        onClick={() => setShowMoreTests(!showMoreTests)}
                        className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                    >
                        {showMoreTests ? '접기' : '더 보기'}
                    </button>
                </div>
                <p className="text-gray-600 mb-4">당신에게 맞는 다른 테스트를 추천해드려요</p>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {recommendedTests.slice(0, showMoreTests ? 6 : 3).map((test) => (
                        <div
                            key={test.id}
                            className="bg-gray-50 hover:bg-gray-100 rounded-lg p-4 transition-colors cursor-pointer group"
                            onClick={() => {
                                trackCtaClicked('similar_test', 'egen-teto', {
                                    recommended_test_id: test.id,
                                    test_title: test.title,
                                });
                                window.location.href = `/tests/${test.id}`;
                            }}
                        >
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 bg-gradient-to-br from-pink-400 to-blue-400 rounded-lg flex items-center justify-center text-white font-bold text-lg">
                                    {test.title.charAt(0)}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h4 className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors">{test.title}</h4>
                                    <p className="text-sm text-gray-500 mt-1 line-clamp-2">{test.description}</p>
                                    <div className="flex flex-wrap gap-1 mt-2">
                                        {test.tags.slice(0, 2).map((tag, index) => (
                                            <span key={index} className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full">
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* 저장 및 가입 섹션 */}
            {!isLoggedIn ? (
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100">
                    <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <span className="text-2xl">💾</span>
                        결과 저장하기
                    </h3>
                    <p className="text-gray-600 mb-4">회원가입하고 결과를 영구적으로 저장해보세요!</p>
                    <div className="space-y-3">
                        <button
                            onClick={onSignUp}
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
                        >
                            <span className="text-lg">✨</span>
                            무료로 회원가입하기
                        </button>
                        <div className="text-center">
                            <span className="text-sm text-gray-500">또는</span>
                        </div>
                        <button
                            onClick={onSave}
                            className="w-full bg-white hover:bg-gray-50 text-gray-700 font-medium py-3 px-4 rounded-lg border border-gray-200 transition-colors flex items-center justify-center gap-2"
                        >
                            <span className="text-lg">📧</span>
                            이메일로 결과 받기
                        </button>
                    </div>
                </div>
            ) : (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <span className="text-2xl">💾</span>
                        결과 저장됨
                    </h3>
                    <p className="text-gray-600 mb-4">결과가 자동으로 저장되었습니다. 마이페이지에서 언제든 확인할 수 있어요.</p>
                    <button
                        onClick={onSave}
                        className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2 px-4 rounded-lg transition-colors"
                    >
                        마이페이지에서 보기
                    </button>
                </div>
            )}

            {/* 알림 구독 섹션 */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <span className="text-2xl">🔔</span>
                    알림 받기
                </h3>
                <p className="text-gray-600 mb-4">새로운 테스트와 결과 분석을 이메일로 받아보세요</p>
                <div className="flex gap-3">
                    <button
                        onClick={onSubscribe}
                        className="flex-1 bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
                    >
                        <span className="text-lg">📧</span>
                        이메일 알림
                    </button>
                    <button
                        onClick={onSubscribe}
                        className="flex-1 bg-yellow-400 hover:bg-yellow-500 text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
                    >
                        <span className="text-lg">💬</span>
                        카카오 알림톡
                    </button>
                </div>
            </div>

            {/* 재테스트 CTA */}
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-6 border border-purple-100 text-center">
                <h3 className="text-xl font-bold text-gray-900 mb-2">다시 테스트해보고 싶다면?</h3>
                <p className="text-gray-600 mb-4">시간이 지나면 결과가 달라질 수 있어요</p>
                <button
                    onClick={() => (window.location.href = '/tests/egen-teto')}
                    className="bg-purple-600 hover:bg-purple-700 text-white font-medium py-3 px-6 rounded-lg transition-colors inline-flex items-center gap-2"
                >
                    <span className="text-lg">🔄</span>
                    다시 테스트하기
                </button>
            </div>
        </div>
    );
}

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { EGEN_TETO_QUESTIONS } from '@/shared/constants';
import { trackTestStarted, trackTestCompleted } from '@/shared/lib/analytics';

interface Answer {
    questionId: number;
    score: number;
    type: string;
}

export function EgenTetoTest() {
    const router = useRouter();
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [answers, setAnswers] = useState<Answer[]>([]);
    const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
    const [isCompleted, setIsCompleted] = useState(false);
    const [startTime, setStartTime] = useState<number>(0);

    const currentQ = EGEN_TETO_QUESTIONS[currentQuestion];
    const progress = ((currentQuestion + 1) / EGEN_TETO_QUESTIONS.length) * 100;

    // 테스트 시작 트래킹
    useEffect(() => {
        setStartTime(Date.now());
        trackTestStarted('egen-teto');
    }, []);

    const handleAnswerSelect = (optionIndex: number) => {
        setSelectedAnswer(optionIndex);
    };

    const handleNext = () => {
        if (selectedAnswer === null) return;

        const selectedOption = currentQ.options[selectedAnswer];
        const newAnswer: Answer = {
            questionId: currentQ.id,
            score: selectedOption.score,
            type: selectedOption.type,
        };

        const newAnswers = [...answers, newAnswer];
        setAnswers(newAnswers);

        if (currentQuestion < EGEN_TETO_QUESTIONS.length - 1) {
            setCurrentQuestion(currentQuestion + 1);
            setSelectedAnswer(null);
        } else {
            // 테스트 완료
            const totalScore = newAnswers.reduce((sum, answer) => sum + answer.score, 0);
            const normalizedScore = Math.max(0, Math.min(100, ((totalScore + 20) / 40) * 100)); // -20~20을 0~100으로 변환

            // 결과 계산
            // const egenCount = newAnswers.filter((a) => a.type.includes('에겐')).length;
            // const tetoCount = newAnswers.filter((a) => a.type.includes('테토')).length;

            let resultType: string;
            if (normalizedScore >= 70) {
                resultType = 'egen-male'; // 실제로는 성별 선택이 필요
            } else if (normalizedScore >= 50) {
                resultType = 'egen-female';
            } else if (normalizedScore >= 30) {
                resultType = 'teto-male';
            } else if (normalizedScore >= 10) {
                resultType = 'teto-female';
            } else {
                resultType = 'mixed';
            }

            // 세션 스토리지에 결과 저장
            const resultData = {
                score: Math.round(normalizedScore),
                gender: 'male', // 실제로는 사용자 선택 필요
                resultType,
                answers: newAnswers,
                completedAt: new Date().toISOString(),
            };

            if (typeof window !== 'undefined') {
                sessionStorage.setItem('testResult', JSON.stringify(resultData));
            }

            // 완료 트래킹
            const duration = Math.round((Date.now() - startTime) / 1000);
            trackTestCompleted('egen-teto', resultType, Math.round(normalizedScore), duration);

            setIsCompleted(true);
        }
    };

    const handleRestart = () => {
        setCurrentQuestion(0);
        setAnswers([]);
        setSelectedAnswer(null);
        setIsCompleted(false);
        setStartTime(Date.now());
    };

    const handleViewResult = () => {
        router.push('/tests/result?type=egen-male&score=75&gender=male'); // 실제로는 계산된 결과 사용
    };

    if (isCompleted) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-pink-50 via-blue-50 to-purple-50 flex items-center justify-center p-4">
                <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
                    <div className="text-6xl mb-4">🎉</div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-4">테스트 완료!</h1>
                    <p className="text-gray-600 mb-6">
                        당신의 에겐·테토 성향을 분석했습니다.
                        <br />
                        결과를 확인해보세요!
                    </p>
                    <div className="space-y-3">
                        <button
                            onClick={handleViewResult}
                            className="w-full bg-gradient-to-r from-pink-500 to-blue-500 text-white font-semibold py-3 px-6 rounded-lg hover:from-pink-600 hover:to-blue-600 transition-all duration-300"
                        >
                            결과 보기
                        </button>
                        <button
                            onClick={handleRestart}
                            className="w-full bg-gray-100 text-gray-700 font-semibold py-3 px-6 rounded-lg hover:bg-gray-200 transition-colors"
                        >
                            다시 테스트하기
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-pink-50 via-blue-50 to-purple-50">
            {/* 헤더 */}
            <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-40">
                <div className="max-w-2xl mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <button
                            onClick={() => router.push('/')}
                            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
                        >
                            <span className="text-2xl">🏠</span>
                            <span className="font-medium">TypologyLab</span>
                        </button>
                        <div className="text-sm text-gray-500">
                            {currentQuestion + 1} / {EGEN_TETO_QUESTIONS.length}
                        </div>
                    </div>
                    {/* 진행률 바 */}
                    <div className="mt-4 w-full bg-gray-200 rounded-full h-2">
                        <div
                            className="bg-gradient-to-r from-pink-400 to-blue-400 h-2 rounded-full transition-all duration-500 ease-out"
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                </div>
            </header>

            {/* 메인 콘텐츠 */}
            <main className="max-w-2xl mx-auto px-4 py-8">
                <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8">
                    {/* 질문 */}
                    <div className="text-center mb-8">
                        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">{currentQ.text}</h1>
                        <p className="text-gray-500 text-sm">가장 가깝다고 생각하는 답을 선택해주세요</p>
                    </div>

                    {/* 선택지 */}
                    <div className="space-y-3 mb-8">
                        {currentQ.options.map((option, index) => (
                            <button
                                key={index}
                                onClick={() => handleAnswerSelect(index)}
                                className={`w-full p-4 text-left rounded-xl border-2 transition-all duration-200 ${
                                    selectedAnswer === index
                                        ? 'border-pink-400 bg-pink-50 text-pink-700'
                                        : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50 text-gray-700'
                                }`}
                            >
                                <div className="flex items-center gap-3">
                                    <div
                                        className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                                            selectedAnswer === index ? 'border-pink-400 bg-pink-400' : 'border-gray-300'
                                        }`}
                                    >
                                        {selectedAnswer === index && <div className="w-2 h-2 bg-white rounded-full" />}
                                    </div>
                                    <span className="font-medium">{option.text}</span>
                                </div>
                            </button>
                        ))}
                    </div>

                    {/* 다음 버튼 */}
                    <div className="flex justify-between">
                        <button onClick={() => router.push('/')} className="text-gray-500 hover:text-gray-700 transition-colors">
                            ← 나가기
                        </button>
                        <button
                            onClick={handleNext}
                            disabled={selectedAnswer === null}
                            className={`px-8 py-3 rounded-lg font-semibold transition-all duration-200 ${
                                selectedAnswer === null
                                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                    : 'bg-gradient-to-r from-pink-500 to-blue-500 text-white hover:from-pink-600 hover:to-blue-600 shadow-lg hover:shadow-xl'
                            }`}
                        >
                            {currentQuestion === EGEN_TETO_QUESTIONS.length - 1 ? '결과 보기' : '다음'}
                        </button>
                    </div>
                </div>

                {/* 힌트 */}
                <div className="mt-6 text-center">
                    <p className="text-sm text-gray-500">💡 솔직하게 답할수록 더 정확한 결과를 얻을 수 있어요</p>
                </div>
            </main>
        </div>
    );
}

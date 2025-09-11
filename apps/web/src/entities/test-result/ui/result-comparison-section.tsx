interface ResultComparisonSectionProps {
    totalScore: number;
    resultType: string;
}

export function ResultComparisonSection({ totalScore }: ResultComparisonSectionProps) {
    // 비슷한 사람 비율 데이터 (실제로는 API에서 가져와야 함)
    const getSimilarTypes = (score: number) => {
        if (score >= 80) {
            return [
                { type: '도전적인 에겐', percentage: 15, count: 1250 },
                { type: '활발한 에겐', percentage: 25, count: 2100 },
                { type: '균형잡힌 에겐', percentage: 35, count: 2900 },
            ];
        }
        if (score >= 60) {
            return [
                { type: '활발한 에겐', percentage: 20, count: 1800 },
                { type: '균형잡힌 에겐', percentage: 30, count: 2500 },
                { type: '신중한 테토', percentage: 25, count: 2100 },
            ];
        }
        if (score >= 40) {
            return [
                { type: '균형잡힌 에겐', percentage: 25, count: 2200 },
                { type: '신중한 테토', percentage: 30, count: 2600 },
                { type: '차분한 테토', percentage: 20, count: 1700 },
            ];
        }
        if (score >= 20) {
            return [
                { type: '신중한 테토', percentage: 35, count: 3000 },
                { type: '차분한 테토', percentage: 25, count: 2200 },
                { type: '균형잡힌 에겐', percentage: 20, count: 1800 },
            ];
        }
        return [
            { type: '차분한 테토', percentage: 40, count: 3500 },
            { type: '신중한 테토', percentage: 30, count: 2600 },
            { type: '균형잡힌 에겐', percentage: 15, count: 1300 },
        ];
    };

    // 전체 평균 점수 (실제로는 API에서 가져와야 함)
    const getAverageScore = () => {
        return Math.floor(Math.random() * 20) + 40; // 40-60 사이의 랜덤 값
    };

    const similarTypes = getSimilarTypes(totalScore);
    const averageScore = getAverageScore();
    const scoreDifference = totalScore - averageScore;

    return (
        <div className="space-y-6">
            {/* 나와 비슷한 사람 비율 */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                    <span className="text-2xl">👥</span>
                    나와 비슷한 사람들
                </h3>
                <div className="space-y-4">
                    {similarTypes.map((item, index) => (
                        <div key={index} className="space-y-2">
                            <div className="flex justify-between items-center">
                                <span className="text-sm font-medium text-gray-700">{item.type}</span>
                                <span className="text-sm font-medium text-gray-900">
                                    {item.percentage}% ({item.count.toLocaleString()}명)
                                </span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                                <div
                                    className="bg-gradient-to-r from-pink-400 to-blue-400 h-2 rounded-full transition-all duration-1000 ease-out"
                                    style={{ width: `${item.percentage}%` }}
                                />
                            </div>
                        </div>
                    ))}
                </div>
                <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600 text-center">
                        💡 총{' '}
                        <span className="font-semibold">{similarTypes.reduce((sum, item) => sum + item.count, 0).toLocaleString()}</span>
                        명이 비슷한 성향을 가지고 있어요
                    </p>
                </div>
            </div>

            {/* 내 점수 vs 전체 평균 */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                    <span className="text-2xl">📊</span>내 점수 vs 전체 평균
                </h3>

                <div className="space-y-4">
                    {/* 내 점수 */}
                    <div className="space-y-2">
                        <div className="flex justify-between items-center">
                            <span className="text-sm font-medium text-gray-700">나의 점수</span>
                            <span className="text-lg font-bold text-gray-900">{totalScore}점</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-3">
                            <div
                                className="bg-gradient-to-r from-pink-400 to-blue-400 h-3 rounded-full transition-all duration-1000 ease-out"
                                style={{ width: `${totalScore}%` }}
                            />
                        </div>
                    </div>

                    {/* 전체 평균 */}
                    <div className="space-y-2">
                        <div className="flex justify-between items-center">
                            <span className="text-sm font-medium text-gray-700">전체 평균</span>
                            <span className="text-lg font-bold text-gray-600">{averageScore}점</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-3">
                            <div
                                className="bg-gray-400 h-3 rounded-full transition-all duration-1000 ease-out"
                                style={{ width: `${averageScore}%` }}
                            />
                        </div>
                    </div>
                </div>

                {/* 차이점 분석 */}
                <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-pink-50 rounded-lg">
                    <div className="text-center">
                        <p className="text-sm text-gray-600 mb-2">
                            {scoreDifference > 0 ? (
                                <>
                                    <span className="font-semibold text-blue-600">평균보다 {scoreDifference}점 높아요</span>
                                    <br />
                                    <span className="text-xs text-gray-500">에겐 성향이 평균보다 강한 편입니다</span>
                                </>
                            ) : scoreDifference < 0 ? (
                                <>
                                    <span className="font-semibold text-pink-600">평균보다 {Math.abs(scoreDifference)}점 낮아요</span>
                                    <br />
                                    <span className="text-xs text-gray-500">테토 성향이 평균보다 강한 편입니다</span>
                                </>
                            ) : (
                                <>
                                    <span className="font-semibold text-gray-600">평균과 동일해요</span>
                                    <br />
                                    <span className="text-xs text-gray-500">균형잡힌 성향을 가지고 있습니다</span>
                                </>
                            )}
                        </p>
                    </div>
                </div>
            </div>

            {/* 미니 스파크라인 (간단한 차트) */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <span className="text-2xl">📈</span>
                    최근 트렌드
                </h3>
                <div className="space-y-3">
                    <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">이번 주</span>
                        <div className="flex items-center gap-2">
                            <div className="w-16 h-8 bg-gray-100 rounded flex items-end justify-between px-1">
                                {[20, 35, 45, 30, 40, 25, totalScore].map((height, index) => (
                                    <div
                                        key={index}
                                        className="bg-gradient-to-t from-pink-400 to-blue-400 rounded-sm"
                                        style={{
                                            width: '6px',
                                            height: `${(height / 100) * 24}px`,
                                        }}
                                    />
                                ))}
                            </div>
                            <span className="text-xs text-gray-500">점수 변화</span>
                        </div>
                    </div>
                    <div className="text-xs text-gray-500 text-center">💡 최근 7일간의 점수 변화를 보여드려요</div>
                </div>
            </div>
        </div>
    );
}

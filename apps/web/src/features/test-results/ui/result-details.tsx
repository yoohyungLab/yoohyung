'use client';

interface ResultDetailsProps {
    result: {
        id: string;
        score: number;
        category: string;
        description: string;
        image: string;
    };
}

export function ResultDetails({ result }: ResultDetailsProps) {
    return (
        <div className="bg-white rounded-lg p-6 shadow-sm">
            <h2 className="text-xl font-bold mb-4">테스트 결과</h2>
            <div className="space-y-4">
                <div>
                    <h3 className="font-semibold text-gray-900">점수</h3>
                    <p className="text-2xl font-bold text-blue-600">{result.score}점</p>
                </div>
                <div>
                    <h3 className="font-semibold text-gray-900">카테고리</h3>
                    <p className="text-gray-700">{result.category}</p>
                </div>
                <div>
                    <h3 className="font-semibold text-gray-900">설명</h3>
                    <p className="text-gray-700">{result.description}</p>
                </div>
            </div>
        </div>
    );
}

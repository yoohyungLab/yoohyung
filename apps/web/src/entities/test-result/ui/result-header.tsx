'use client';

interface ResultHeaderProps {
    title: string;
    emoji: string;
    description: string;
    onShare: () => void;
    onRestart: () => void;
}

export function ResultHeader({ title, emoji, description, onShare, onRestart }: ResultHeaderProps) {
    return (
        <div className="text-center mb-8">
            <div className="text-6xl mb-4">{emoji}</div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{title}</h1>
            <p className="text-lg text-gray-600 mb-6">{description}</p>
            <div className="flex justify-center gap-3">
                <button
                    onClick={onShare}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                >
                    공유하기
                </button>
                <button
                    onClick={onRestart}
                    className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-3 rounded-lg font-medium transition-colors"
                >
                    다시 테스트하기
                </button>
            </div>
        </div>
    );
}

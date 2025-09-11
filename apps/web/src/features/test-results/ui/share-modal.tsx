'use client';

// import { useState } from 'react';

interface ShareModalProps {
    isOpen: boolean;
    onClose: () => void;
    result: {
        id: string;
        score: number;
        category: string;
    };
}

export function ShareModal({ isOpen, onClose }: ShareModalProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
                <h2 className="text-xl font-bold mb-4">결과 공유하기</h2>
                <p className="mb-4">내 테스트 결과를 공유해보세요!</p>
                <div className="space-y-2">
                    <button className="w-full bg-yellow-400 text-black px-4 py-2 rounded-lg font-semibold hover:bg-yellow-500 transition-colors">
                        카카오톡으로 공유
                    </button>
                    <button className="w-full bg-gray-800 text-white px-4 py-2 rounded-lg font-semibold hover:bg-gray-900 transition-colors">
                        링크 복사
                    </button>
                </div>
                <button
                    onClick={onClose}
                    className="mt-4 w-full bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors"
                >
                    닫기
                </button>
            </div>
        </div>
    );
}

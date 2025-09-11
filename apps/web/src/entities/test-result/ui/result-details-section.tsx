'use client';

import React from 'react';

interface ResultDetailsSectionProps {
    totalScore: number;
}

export function ResultDetailsSection({}: ResultDetailsSectionProps) {
    return (
        <div className="bg-white rounded-lg p-6 shadow-sm">
            <h2 className="text-xl font-bold text-gray-900 mb-4">결과 상세</h2>
            <p className="text-gray-600">결과 상세 정보가 준비 중입니다.</p>
        </div>
    );
}

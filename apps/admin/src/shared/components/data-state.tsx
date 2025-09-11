import React from 'react';
import { Button } from '@repo/ui';
import { cn } from '../lib/utils';

interface DataStateProps {
    loading?: boolean;
    error?: string | null;
    data: any[];
    onRetry?: () => void;
    children: React.ReactNode;
}

export function DataState({ loading = false, error = null, data = [], onRetry, children }: DataStateProps) {
    // 로딩 상태
    if (loading && data.length === 0) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <span className="text-gray-600">데이터를 불러오는 중...</span>
                </div>
            </div>
        );
    }

    // 에러 상태
    if (error) {
        return (
            <div className="space-y-6 p-5">
                <div className="text-center py-12">
                    <div className="text-red-600 text-lg font-semibold mb-2">오류가 발생했습니다</div>
                    <div className="text-gray-600 mb-4">{error}</div>
                    {onRetry && (
                        <Button onClick={onRetry} variant="outline">
                            다시 시도
                        </Button>
                    )}
                </div>
            </div>
        );
    }

    // 데이터가 없는 상태
    if (data.length === 0) {
        return (
            <div className="bg-white rounded-lg border overflow-hidden">
                <div className="p-12 text-center">
                    <div className="text-gray-400 text-6xl mb-4">📭</div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">데이터가 없습니다</h3>
                </div>
            </div>
        );
    }

    // 정상 상태 - children 렌더링
    return <>{children}</>;
}

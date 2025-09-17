import { useState, useCallback, useEffect } from 'react';
import type { ResultCreationData } from '../api/test-creation.service';
import type { TestResult } from '@repo/supabase';

export const useResults = (initialResults?: ResultCreationData[]) => {
    const [results, setResults] = useState<ResultCreationData[]>(
        initialResults || [
            {
                result_name: '',
                result_order: 0,
                description: null,
                match_conditions: { type: 'score' as const, min: 0, max: 30 },
                background_image_url: null,
                theme_color: '#3B82F6',
                features: {},
            },
        ]
    );

    // 초기 데이터가 변경될 때 상태 업데이트
    useEffect(() => {
        if (initialResults) {
            setResults(initialResults);
        }
    }, [initialResults]);

    const addResult = useCallback(() => {
        setResults((prev) => [
            ...prev,
            {
                result_name: '',
                result_order: prev.length,
                description: null,
                match_conditions: { type: 'score' as const, min: 0, max: 30 },
                background_image_url: null,
                theme_color: '#3B82F6',
                features: {},
            },
        ]);
    }, []);

    const removeResult = useCallback((index: number) => {
        setResults((prev) => prev.filter((_, i) => i !== index));
    }, []);

    const updateResult = useCallback((index: number, updates: Partial<ResultCreationData>) => {
        setResults((prev) => prev.map((r, i) => (i === index ? { ...r, ...updates } : r)));
    }, []);

    return {
        results,
        addResult,
        removeResult,
        updateResult,
    };
};

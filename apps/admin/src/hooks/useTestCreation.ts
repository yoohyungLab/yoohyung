import { useState, useCallback } from 'react';
import { defaultTestData, defaultQuestion, defaultResult } from '../constants/testData';

export interface TestCreationState {
    step: number;
    type: string | null;
    data: typeof defaultTestData;
    questions: any[];
    results: any[];
    loading: boolean;
}

export const useTestCreation = () => {
    const [state, setState] = useState<TestCreationState>({
        step: 1,
        type: null,
        data: defaultTestData,
        questions: [defaultQuestion],
        results: [defaultResult],
        loading: false,
    });

    // 단계 이동
    const setStep = useCallback((step: number) => {
        setState((prev) => ({ ...prev, step }));
    }, []);

    const nextStep = useCallback(() => {
        setState((prev) => ({ ...prev, step: Math.min(prev.step + 1, 5) }));
    }, []);

    const prevStep = useCallback(() => {
        setState((prev) => ({ ...prev, step: Math.max(prev.step - 1, 1) }));
    }, []);

    // 타입 선택
    const selectType = useCallback((type: string) => {
        setState((prev) => ({ ...prev, type }));
    }, []);

    // 데이터 업데이트
    const updateData = useCallback((updates: Partial<typeof defaultTestData>) => {
        setState((prev) => ({ ...prev, data: { ...prev.data, ...updates } }));
    }, []);

    // 질문 관리
    const updateQuestions = useCallback((questions: any[]) => {
        setState((prev) => ({ ...prev, questions }));
    }, []);

    const addQuestion = useCallback(() => {
        setState((prev) => ({
            ...prev,
            questions: [
                ...prev.questions,
                {
                    ...defaultQuestion,
                    id: Date.now(),
                    choices: [
                        { text: '', score: 1 },
                        { text: '', score: 2 },
                    ],
                },
            ],
        }));
    }, []);

    const removeQuestion = useCallback((id: number) => {
        setState((prev) => ({
            ...prev,
            questions: prev.questions.filter((q) => q.id !== id),
        }));
    }, []);

    // 결과 관리
    const updateResults = useCallback((results: any[]) => {
        setState((prev) => ({ ...prev, results }));
    }, []);

    const addResult = useCallback(() => {
        setState((prev) => ({
            ...prev,
            results: [
                ...prev.results,
                {
                    ...defaultResult,
                    id: Date.now(),
                },
            ],
        }));
    }, []);

    const removeResult = useCallback((id: number) => {
        setState((prev) => ({
            ...prev,
            results: prev.results.filter((r) => r.id !== id),
        }));
    }, []);

    // 로딩 상태
    const setLoading = useCallback((loading: boolean) => {
        setState((prev) => ({ ...prev, loading }));
    }, []);

    // 진행 가능 여부
    const canProceed = useCallback(() => {
        switch (state.step) {
            case 1:
                return !!state.type;
            case 2:
                return !!state.data.title.trim();
            case 3:
                return state.questions.length > 0 && state.questions.every((q) => q.text.trim());
            case 4:
                return state.results.length > 0 && state.results.every((r) => r.name.trim());
            case 5:
                return true;
            default:
                return false;
        }
    }, [state]);

    return {
        // 상태
        ...state,

        // 액션
        setStep,
        nextStep,
        prevStep,
        selectType,
        updateData,
        updateQuestions,
        addQuestion,
        removeQuestion,
        updateResults,
        addResult,
        removeResult,
        setLoading,
        canProceed,
    };
};

import { useState, useCallback } from 'react';
import { useSaveCompleteTest } from './useTestCreationQueries';
import type { QuestionCreationData, ResultCreationData } from '../api/test-creation.service';

export const useTestCreation = () => {
    const [step, setStep] = useState(1);

    // 폼 데이터
    const [basicInfo, setBasicInfo] = useState({
        title: '',
        description: '',
        slug: '',
        thumbnail_url: '',
        response_count: 0,
        view_count: 0,
        category_ids: [] as string[],
        short_code: '',
        intro_text: '',
        status: 'draft' as const,
        estimated_time: 5,
        scheduled_at: null as string | null,
        max_score: 100,
        type: 'psychology' as const,
        published_at: null as string | null,
    });

    const [questions, setQuestions] = useState<QuestionCreationData[]>([
        {
            question_text: '',
            question_order: 0,
            image_url: null,
            choices: [
                { choice_text: '', choice_order: 0, score: 1, is_correct: false },
                { choice_text: '', choice_order: 1, score: 2, is_correct: false },
            ],
        },
    ]);

    const [results, setResults] = useState<ResultCreationData[]>([
        {
            result_name: '',
            result_order: 0,
            description: null,
            match_conditions: { type: 'score' as const, min: 0, max: 30 },
            background_image_url: null,
            theme_color: '#3B82F6',
            features: {},
        },
    ]);

    const saveCompleteTestMutation = useSaveCompleteTest();

    // 질문 추가
    const addQuestion = useCallback(() => {
        setQuestions((prev) => [
            ...prev,
            {
                question_text: '',
                question_order: prev.length,
                image_url: null,
                choices: [
                    { choice_text: '', choice_order: 0, score: 1, is_correct: false },
                    { choice_text: '', choice_order: 1, score: 2, is_correct: false },
                ],
            },
        ]);
    }, []);

    // 질문 삭제
    const removeQuestion = useCallback((index: number) => {
        setQuestions((prev) => prev.filter((_, i) => i !== index));
    }, []);

    // 질문 업데이트
    const updateQuestion = useCallback((index: number, updates: Partial<QuestionCreationData>) => {
        setQuestions((prev) => prev.map((q, i) => (i === index ? { ...q, ...updates } : q)));
    }, []);

    // 선택지 추가
    const addChoice = useCallback((questionIndex: number) => {
        setQuestions((prev) =>
            prev.map((q, i) =>
                i === questionIndex
                    ? {
                          ...q,
                          choices: [
                              ...q.choices,
                              {
                                  choice_text: '',
                                  choice_order: q.choices.length,
                                  score: 1,
                                  is_correct: false,
                              },
                          ],
                      }
                    : q
            )
        );
    }, []);

    // 선택지 삭제
    const removeChoice = useCallback((questionIndex: number, choiceIndex: number) => {
        setQuestions((prev) =>
            prev.map((q, i) => (i === questionIndex ? { ...q, choices: q.choices.filter((_, ci) => ci !== choiceIndex) } : q))
        );
    }, []);

    // 선택지 업데이트
    const updateChoice = useCallback(
        (
            questionIndex: number,
            choiceIndex: number,
            updates: Partial<{
                choice_text: string;
                choice_order: number;
                score: number | null;
                is_correct: boolean | null;
            }>
        ) => {
            setQuestions((prev) =>
                prev.map((q, i) =>
                    i === questionIndex
                        ? { ...q, choices: q.choices.map((choice, ci) => (ci === choiceIndex ? { ...choice, ...updates } : choice)) }
                        : q
                )
            );
        },
        []
    );

    // 결과 추가
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

    // 결과 삭제
    const removeResult = useCallback((index: number) => {
        setResults((prev) => prev.filter((_, i) => i !== index));
    }, []);

    // 결과 업데이트
    const updateResult = useCallback((index: number, updates: Partial<ResultCreationData>) => {
        setResults((prev) => prev.map((r, i) => (i === index ? { ...r, ...updates } : r)));
    }, []);

    // 테스트 저장 (마지막에 한 번에)
    const saveTest = useCallback(async () => {
        try {
            console.log('🚀 Starting test save process...');
            console.log('📋 Questions data:', questions);
            console.log('📋 Results data:', results);

            const completeData = {
                test: basicInfo,
                questions,
                results,
            };

            console.log('📋 Complete data prepared:', completeData);

            const result = await saveCompleteTestMutation.mutateAsync(completeData);

            console.log('✅ Test save successful:', result);
            return result;
        } catch (error) {
            console.error('❌ Test save failed:', error);
            throw error;
        }
    }, [basicInfo, questions, results, saveCompleteTestMutation]);

    return {
        // 상태
        step,
        basicInfo,
        questions,
        results,
        isLoading: saveCompleteTestMutation.isPending,

        // 단계 관리
        setStep,
        nextStep: () => setStep((prev) => Math.min(prev + 1, 5)),
        prevStep: () => setStep((prev) => Math.max(prev - 1, 1)),

        // 기본 정보 업데이트
        updateBasicInfo: (updates: Partial<typeof basicInfo>) => setBasicInfo((prev) => ({ ...prev, ...updates })),

        // 질문 관리
        addQuestion,
        removeQuestion,
        updateQuestion,
        addChoice,
        removeChoice,
        updateChoice,

        // 결과 관리
        addResult,
        removeResult,
        updateResult,

        // 저장
        saveTest,
    };
};

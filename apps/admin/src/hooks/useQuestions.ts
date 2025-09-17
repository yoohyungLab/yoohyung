import { useState, useCallback, useEffect } from 'react';
import type { QuestionCreationData } from '../api/test-creation.service';
import type { TestQuestion, TestChoice } from '@repo/supabase';

export const useQuestions = (initialQuestions?: QuestionCreationData[]) => {
    const [questions, setQuestions] = useState<QuestionCreationData[]>(
        initialQuestions || [
            {
                question_text: '',
                question_order: 0,
                image_url: null,
                choices: [
                    { choice_text: '', choice_order: 0, score: 1, is_correct: false },
                    { choice_text: '', choice_order: 1, score: 2, is_correct: false },
                ],
            },
        ]
    );

    // 초기 데이터가 변경될 때 상태 업데이트
    useEffect(() => {
        if (initialQuestions) {
            setQuestions(initialQuestions);
        }
    }, [initialQuestions]);

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

    const removeQuestion = useCallback((index: number) => {
        setQuestions((prev) => prev.filter((_, i) => i !== index));
    }, []);

    const updateQuestion = useCallback((index: number, updates: Partial<QuestionCreationData>) => {
        setQuestions((prev) => prev.map((q, i) => (i === index ? { ...q, ...updates } : q)));
    }, []);

    const addChoice = useCallback((questionIndex: number) => {
        setQuestions((prev) =>
            prev.map((q, i) =>
                i === questionIndex
                    ? {
                          ...q,
                          choices: [...q.choices, { choice_text: '', choice_order: q.choices.length, score: 1, is_correct: false }],
                      }
                    : q
            )
        );
    }, []);

    const removeChoice = useCallback((questionIndex: number, choiceIndex: number) => {
        setQuestions((prev) =>
            prev.map((q, i) => (i === questionIndex ? { ...q, choices: q.choices.filter((_, ci) => ci !== choiceIndex) } : q))
        );
    }, []);

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

    return {
        questions,
        addQuestion,
        removeQuestion,
        updateQuestion,
        addChoice,
        removeChoice,
        updateChoice,
    };
};

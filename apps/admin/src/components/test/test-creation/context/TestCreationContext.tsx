import React, { createContext, useContext, useState, ReactNode } from 'react';
import { TestCreationContextType, Step, TestType } from '../types';

const TestCreationContext = createContext<TestCreationContextType | undefined>(undefined);

export const useTestCreation = () => {
    const context = useContext(TestCreationContext);
    if (!context) {
        throw new Error('useTestCreation must be used within a TestCreationProvider');
    }
    return context;
};

interface TestCreationProviderProps {
    children: ReactNode;
}

export const TestCreationProvider: React.FC<TestCreationProviderProps> = ({ children }) => {
    const [currentStep, setCurrentStep] = useState<Step>('type');
    const [selectedType, setSelectedType] = useState<TestType | null>(null);
    const [loading, setLoading] = useState(false);

    // 테스트 기본 정보
    const [testData, setTestData] = useState<any>({
        title: '',
        description: '',
        intro_text: '',
        category_ids: [],
        slug: '',
        thumbnail_url: '',
        estimated_time: 5,
        status: 'draft',
        scheduled_at: null,
        max_score: 100,
    });

    // 질문 데이터
    const [questions, setQuestions] = useState<any[]>([
        {
            id: 1,
            text: '',
            image_url: '',
            group: '',
            choices: [
                { text: '', image_url: '', score: 1, correct: false, result_id: null },
                { text: '', image_url: '', score: 2, correct: false, result_id: null },
            ],
        },
    ]);

    // 결과 데이터
    const [results, setResults] = useState<any[]>([
        {
            id: 1,
            name: '',
            description: '',
            features: [],
            match_results: [],
            jobs: [],
            bg_image_url: '',
            theme_color: '#3B82F6',
            condition: { type: 'score', min: 0, max: 30 },
        },
    ]);

    const value: TestCreationContextType = {
        currentStep,
        setCurrentStep,
        selectedType,
        setSelectedType,
        testData,
        setTestData,
        questions,
        setQuestions,
        results,
        setResults,
        loading,
        setLoading,
    };

    return <TestCreationContext.Provider value={value}>{children}</TestCreationContext.Provider>;
};

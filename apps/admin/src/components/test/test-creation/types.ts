// 테스트 생성 관련 타입 정의
export type Step = 'type' | 'basic' | 'questions' | 'results' | 'preview';
export type TestType = 'psychology' | 'balance' | 'character' | 'quiz' | 'meme' | 'lifestyle';

export interface TestData {
    title: string;
    description: string;
    intro_text: string;
    category_ids: number[];
    slug: string;
    thumbnail_url: string;
    estimated_time: number;
    status: 'draft' | 'published';
    scheduled_at: string | null;
    max_score: number;
}

export interface Question {
    id: number;
    text: string;
    image_url: string;
    group: string;
    choices: Choice[];
}

export interface Choice {
    text: string;
    image_url: string;
    score: number;
    correct: boolean;
    result_id: number | null;
}

export interface Result {
    id: number;
    name: string;
    description: string;
    features: string[];
    match_results: number[];
    jobs: string[];
    bg_image_url: string;
    theme_color: string;
    condition: {
        type: string;
        min: number;
        max: number;
    };
}

export interface TestCreationContextType {
    currentStep: Step;
    setCurrentStep: (step: Step) => void;
    selectedType: TestType | null;
    setSelectedType: (type: TestType | null) => void;
    testData: any;
    setTestData: (data: any) => void;
    questions: any[];
    setQuestions: (questions: any[]) => void;
    results: any[];
    setResults: (results: any[]) => void;
    loading: boolean;
    setLoading: (loading: boolean) => void;
}

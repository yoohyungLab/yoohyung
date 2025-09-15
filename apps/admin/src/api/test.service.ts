import { supabase } from '@repo/shared';
import type {
    Test,
    TestInsert,
    TestUpdate,
    TestQuestion,
    TestQuestionInsert,
    TestChoice,
    TestChoiceInsert,
    TestResult,
    TestResultInsert,
    UserTestResponse,
    Category,
    TestStatus,
    TestType,
} from '../types/test';

// Admin UI 호환을 위한 확장 인터페이스
export interface TestWithDetails extends Omit<Test, 'response_count'> {
    category?: Category;
    questions?: TestQuestion[];
    results?: TestResult[];
    question_count?: number;
    result_count?: number;
    response_count?: number | null;
    completion_rate?: number;
    // Admin UI 호환 필드들
    category_name?: string;
    emoji?: string;
    thumbnailImage?: string;
    startMessage?: string;
    scheduledAt?: string;
    responseCount?: number;
    completionRate?: number;
    estimatedTime?: number;
    createdBy?: string;
    createdAt: string;
    updatedAt: string;
    isPublished?: boolean;
}

export const testService = {
    async getAllTests(): Promise<TestWithDetails[]> {
        const { data, error } = await supabase
            .from('tests')
            .select(
                `
                *,
                categories!tests_category_id_fkey (
                    id,
                    name,
                    slug
                ),
                test_questions (count),
                test_results (count),
                user_test_responses (count)
            `
            )
            .order('created_at', { ascending: false });

        if (error) throw error;

        // Admin UI 호환 포맷으로 변환
        return (data || []).map((item) => {
            const questionCount = (item as any).test_questions?.[0]?.count || 0;
            const resultCount = (item as any).test_results?.[0]?.count || 0;

            return {
                ...item,
                // 호환 필드 매핑
                category: item.categories?.name || '',
                category_name: item.categories?.name || '',
                emoji: '📝', // 기본값
                thumbnailImage: item.thumbnail_url || '',
                startMessage: item.intro_text || '',
                scheduledAt: item.scheduled_at || '',
                responseCount: item.response_count || 0,
                completionRate:
                    item.completion_count && item.response_count ? Math.round((item.completion_count / item.response_count) * 100) : 0,
                estimatedTime: item.estimated_time || 5,
                share_count: item.share_count || 0,
                completion_count: item.completion_count || 0,
                createdBy: item.author_id || '',
                createdAt: item.created_at,
                updatedAt: item.updated_at,
                isPublished: item.status === 'published',
                question_count: questionCount,
                result_count: resultCount,
                response_count: (item as any).user_test_responses?.[0]?.count || 0,
                // Admin UI가 기대하는 배열 형태로 생성 (length 속성만 필요)
                questions: new Array(questionCount).fill({}),
                results: new Array(resultCount).fill({}),
            };
        }) as TestWithDetails[];
    },

    async getPublishedTests(): Promise<TestWithDetails[]> {
        const { data, error } = await supabase
            .from('tests')
            .select(
                `
                *,
                categories!tests_category_id_fkey (
                    id,
                    name,
                    slug
                )
            `
            )
            .eq('status', 'published')
            .order('created_at', { ascending: false });

        if (error) throw error;

        return (data || []).map((item) => ({
            ...item,
            category: item.categories?.name || '',
            category_name: item.categories?.name || '',
            emoji: '',
            thumbnailImage: item.thumbnail_url || '',
            startMessage: item.intro_text || '',
            scheduledAt: item.scheduled_at || '',
            responseCount: item.response_count || 0,
            completionRate:
                item.completion_count && item.response_count ? Math.round((item.completion_count / item.response_count) * 100) : 0,
            estimatedTime: item.estimated_time || 5,
            share_count: item.share_count || 0,
            completion_count: item.completion_count || 0,
            createdBy: item.author_id || '',
            createdAt: item.created_at,
            updatedAt: item.updated_at,
            isPublished: item.status === 'published',
            questions: [],
            results: [],
        })) as TestWithDetails[];
    },

    async getTestById(id: string): Promise<TestWithDetails> {
        const { data, error } = await supabase
            .from('tests')
            .select(
                `
                *,
                categories!tests_category_id_fkey (
                    id,
                    name,
                    slug
                ),
                test_questions (
                    *,
                    test_choices (*)
                ),
                test_results (*)
            `
            )
            .eq('id', id)
            .single();

        if (error) throw error;

        return {
            ...data,
            category: data.categories?.name || '',
            category_name: data.categories?.name || '',
            emoji: '',
            thumbnailImage: data.thumbnail_url || '',
            startMessage: data.intro_text || '',
            scheduledAt: data.scheduled_at || '',
            responseCount: data.response_count || 0,
            completionRate:
                data.completion_count && data.response_count ? Math.round((data.completion_count / data.response_count) * 100) : 0,
            estimatedTime: data.estimated_time || 5,
            share_count: data.share_count || 0,
            completion_count: data.completion_count || 0,
            createdBy: data.author_id || '',
            createdAt: data.created_at,
            updatedAt: data.updated_at,
            isPublished: data.status === 'published',
            questions: data.test_questions || [],
            results: data.test_results || [],
        } as TestWithDetails;
    },

    async createTest(testData: TestInsert): Promise<Test> {
        const { data, error } = await supabase.from('tests').insert([testData]).select().single();
        if (error) throw error;
        return data as Test;
    },

    async updateTest(id: string, testData: TestUpdate): Promise<Test> {
        const { data, error } = await supabase.from('tests').update(testData).eq('id', id).select().single();
        if (error) throw error;
        return data as Test;
    },

    async deleteTest(id: string): Promise<void> {
        const { error } = await supabase.from('tests').delete().eq('id', id);
        if (error) throw error;
    },

    async togglePublishStatus(id: string, isPublished: boolean): Promise<Test> {
        const status: TestStatus = isPublished ? 'published' : 'draft';
        const { data, error } = await supabase
            .from('tests')
            .update({ status, updated_at: new Date().toISOString() })
            .eq('id', id)
            .select()
            .single();
        if (error) throw error;
        return data as Test;
    },

    // 공유수 증가
    async incrementShareCount(id: string): Promise<void> {
        // 현재 값을 가져와서 +1 증가
        const { data: current, error: fetchError } = await supabase.from('tests').select('share_count').eq('id', id).single();

        if (fetchError) throw fetchError;

        const { error: updateError } = await supabase
            .from('tests')
            .update({ share_count: (current.share_count || 0) + 1 })
            .eq('id', id);

        if (updateError) throw updateError;
    },

    // 조회수 증가
    async incrementViewCount(id: string): Promise<void> {
        // 현재 값을 가져와서 +1 증가
        const { data: current, error: fetchError } = await supabase.from('tests').select('view_count').eq('id', id).single();

        if (fetchError) throw fetchError;

        const { error: updateError } = await supabase
            .from('tests')
            .update({ view_count: (current.view_count || 0) + 1 })
            .eq('id', id);

        if (updateError) throw updateError;
    },

    // Question 관련 메서드들 (올바른 테이블명 사용)
    async createQuestion(testId: string, questionData: TestQuestionInsert): Promise<TestQuestion> {
        const { data, error } = await supabase
            .from('test_questions')
            .insert([{ ...questionData, test_id: testId }])
            .select()
            .single();
        if (error) throw error;
        return data as TestQuestion;
    },

    async updateQuestion(id: string, questionData: Partial<TestQuestionInsert>): Promise<TestQuestion> {
        const { data, error } = await supabase.from('test_questions').update(questionData).eq('id', id).select().single();
        if (error) throw error;
        return data as TestQuestion;
    },

    async deleteQuestion(id: string): Promise<void> {
        const { error } = await supabase.from('test_questions').delete().eq('id', id);
        if (error) throw error;
    },

    // Choice 관련 메서드들 (올바른 테이블명 사용)
    async createChoice(questionId: string, choiceData: TestChoiceInsert): Promise<TestChoice> {
        const { data, error } = await supabase
            .from('test_choices')
            .insert([{ ...choiceData, question_id: questionId }])
            .select()
            .single();
        if (error) throw error;
        return data as TestChoice;
    },

    async updateChoice(id: string, choiceData: Partial<TestChoiceInsert>): Promise<TestChoice> {
        const { data, error } = await supabase.from('test_choices').update(choiceData).eq('id', id).select().single();
        if (error) throw error;
        return data as TestChoice;
    },

    async deleteChoice(id: string): Promise<void> {
        const { error } = await supabase.from('test_choices').delete().eq('id', id);
        if (error) throw error;
    },

    // Result 관련 메서드들
    async createTestResult(testId: string, resultData: TestResultInsert): Promise<TestResult> {
        const { data, error } = await supabase
            .from('test_results')
            .insert([{ ...resultData, test_id: testId }])
            .select()
            .single();
        if (error) throw error;
        return data as TestResult;
    },

    async updateTestResult(id: string, resultData: Partial<TestResultInsert>): Promise<TestResult> {
        const { data, error } = await supabase.from('test_results').update(resultData).eq('id', id).select().single();
        if (error) throw error;
        return data as TestResult;
    },

    async deleteTestResult(id: string): Promise<void> {
        const { error } = await supabase.from('test_results').delete().eq('id', id);
        if (error) throw error;
    },

    // 사용자 응답 조회 (올바른 테이블명 사용)
    async getUserResponses(testId?: string): Promise<UserTestResponse[]> {
        let query = supabase
            .from('user_test_responses')
            .select(
                `
                *,
                tests!user_test_responses_test_id_fkey (title),
                test_results!user_test_responses_result_id_fkey (result_name)
            `
            )
            .order('created_at', { ascending: false });

        if (testId) {
            query = query.eq('test_id', testId);
        }

        const { data, error } = await query;
        if (error) throw error;
        return (data as UserTestResponse[]) || [];
    },

    // 테스트 통계
    async getTestStats(): Promise<{
        totalTests: number;
        publishedTests: number;
        totalResponses: number;
        todayResponses: number;
    }> {
        const { data: tests, error: testsError } = await supabase.from('tests').select('id, status');
        if (testsError) throw testsError;

        const { data: responses, error: responsesError } = await supabase.from('user_test_responses').select('test_id, created_at');
        if (responsesError) throw responsesError;

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const todayResponses = responses?.filter((r) => new Date(r.created_at) >= today).length || 0;

        return {
            totalTests: tests?.length || 0,
            publishedTests: tests?.filter((t) => t.status === 'published').length || 0,
            totalResponses: responses?.length || 0,
            todayResponses,
        };
    },
};

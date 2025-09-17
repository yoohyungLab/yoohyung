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
    TestStatus,
    TestWithDetails,
} from '@repo/supabase';

export interface TestFilters {
    search?: string;
    status?: TestStatus;
    type?: string;
    category?: string;
}

export const testService = {
    async getAllTests(): Promise<TestWithDetails[]> {
        const { data, error } = await supabase.from('tests').select('*').order('created_at', { ascending: false });

        if (error) throw error;

        // Admin UI 호환 포맷으로 변환
        return (data || []).map((item: Test) => {
            return {
                ...item,
                // 호환 필드 매핑
                category: '기타', // 기본값
                category_name: '기타', // 기본값
                emoji: '📝', // 기본값
                status: 'draft', // 기본값 (UI 호환용)
                type: 'psychology', // 기본값 (UI 호환용)
                thumbnailImage: item.thumbnail_url || '',
                startMessage: '',
                scheduledAt: '',
                responseCount: item.response_count || 0,
                completionRate: 0,
                estimatedTime: 5,
                share_count: 0,
                completion_count: 0,
                createdBy: '',
                createdAt: item.created_at,
                updatedAt: item.updated_at,
                isPublished: false, // 기본값 (UI 호환용)
                question_count: 0, // 기본값
                result_count: 0, // 기본값
                response_count: item.response_count || 0,
                // Admin UI가 기대하는 배열 형태로 생성
                questions: [],
                results: [],
            };
        }) as TestWithDetails[];
    },

    async getPublishedTests(): Promise<TestWithDetails[]> {
        // status 컬럼이 없으므로 모든 테스트를 가져와서 UI에서 필터링
        const { data, error } = await supabase.from('tests').select('*').order('created_at', { ascending: false });

        if (error) throw error;

        return (data || []).map((item: Test) => ({
            ...item,
            category: '기타', // 기본값
            category_name: '기타', // 기본값
            emoji: '📝', // 기본값
            status: 'published', // UI 호환용
            type: 'psychology', // UI 호환용
            thumbnailImage: item.thumbnail_url || '',
            startMessage: '',
            scheduledAt: '',
            responseCount: item.response_count || 0,
            completionRate: 0,
            estimatedTime: 5,
            share_count: 0,
            completion_count: 0,
            createdBy: '',
            createdAt: item.created_at,
            updatedAt: item.updated_at,
            isPublished: true, // UI 호환용
            questions: [],
            results: [],
        })) as TestWithDetails[];
    },

    async getTestById(id: string): Promise<TestWithDetails> {
        const { data, error } = await supabase.from('tests').select('*').eq('id', id).maybeSingle();

        if (error) throw error;
        if (!data) throw new Error(`Test with id ${id} not found`);

        return {
            ...data,
            category: '기타', // 기본값
            category_name: '기타', // 기본값
            emoji: '📝', // 기본값
            status: 'draft', // UI 호환용
            type: 'psychology', // UI 호환용
            thumbnailImage: data.thumbnail_url || '',
            startMessage: '',
            scheduledAt: '',
            responseCount: data.response_count || 0,
            completionRate: 0,
            estimatedTime: 5,
            share_count: 0,
            completion_count: 0,
            createdBy: '',
            createdAt: data.created_at,
            updatedAt: data.updated_at,
            isPublished: false, // UI 호환용
            questions: [], // 기본값
            results: [], // 기본값
        } as TestWithDetails;
    },

    // 테스트와 관련된 모든 데이터를 가져오는 함수 (수정용)
    async getTestWithDetails(id: string): Promise<{
        test: Test;
        questions: Array<TestQuestion & { choices: TestChoice[] }>;
        results: TestResult[];
    }> {
        // 1. 테스트 기본 정보 가져오기
        const { data: testData, error: testError } = await supabase.from('tests').select('*').eq('id', id).maybeSingle();

        if (testError) throw testError;
        if (!testData) throw new Error(`Test with id ${id} not found`);

        // 2. 질문들과 선택지들 가져오기
        const { data: questionsData, error: questionsError } = await supabase
            .from('test_questions')
            .select(
                `
                *,
                choices:test_choices(*)
            `
            )
            .eq('test_id', id)
            .order('question_order');

        if (questionsError) throw questionsError;

        // 3. 결과들 가져오기
        const { data: resultsData, error: resultsError } = await supabase
            .from('test_results')
            .select('*')
            .eq('test_id', id)
            .order('result_order');

        if (resultsError) throw resultsError;

        return {
            test: testData as Test,
            questions: (questionsData || []) as Array<TestQuestion & { choices: TestChoice[] }>,
            results: (resultsData || []) as TestResult[],
        };
    },

    async createTest(testData: TestInsert): Promise<TestWithDetails> {
        const { data, error } = await supabase.from('tests').insert([testData]).select().single();
        if (error) throw error;

        // TestWithDetails 형식으로 변환
        return {
            ...data,
            category: '기타',
            category_name: '기타',
            emoji: '📝',
            status: 'draft',
            type: 'psychology',
            thumbnailImage: data.thumbnail_url || '',
            startMessage: '',
            scheduledAt: '',
            responseCount: data.response_count || 0,
            completionRate: 0,
            estimatedTime: 5,
            share_count: 0,
            completion_count: 0,
            createdBy: '',
            createdAt: data.created_at,
            updatedAt: data.updated_at,
            isPublished: false,
            question_count: 0,
            result_count: 0,
            response_count: data.response_count || 0,
            questions: [],
            results: [],
        } as TestWithDetails;
    },

    async updateTest(id: string, testData: TestUpdate): Promise<TestWithDetails> {
        const { data, error } = await supabase.from('tests').update(testData).eq('id', id).select().single();
        if (error) throw error;

        // TestWithDetails 형식으로 변환
        return {
            ...data,
            category: '기타',
            category_name: '기타',
            emoji: '📝',
            status: 'draft',
            type: 'psychology',
            thumbnailImage: data.thumbnail_url || '',
            startMessage: '',
            scheduledAt: '',
            responseCount: data.response_count || 0,
            completionRate: 0,
            estimatedTime: 5,
            share_count: 0,
            completion_count: 0,
            createdBy: '',
            createdAt: data.created_at,
            updatedAt: data.updated_at,
            isPublished: false,
            question_count: 0,
            result_count: 0,
            response_count: data.response_count || 0,
            questions: [],
            results: [],
        } as TestWithDetails;
    },

    async deleteTest(id: string): Promise<void> {
        const { error } = await supabase.from('tests').delete().eq('id', id);
        if (error) throw error;
    },

    async togglePublishStatus(id: string, isPublished: boolean): Promise<Test> {
        // status 컬럼이 없으므로 updated_at만 업데이트
        const { data, error } = await supabase
            .from('tests')
            .update({ updated_at: new Date().toISOString() })
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
        const { data: tests, error: testsError } = await supabase.from('tests').select('id');
        if (testsError) throw testsError;

        const { data: responses, error: responsesError } = await supabase.from('user_test_responses').select('test_id, created_date');
        if (responsesError) throw responsesError;

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const todayResponses = responses?.filter((r: UserTestResponse) => new Date(r.created_date || '') >= today).length || 0;

        return {
            totalTests: tests?.length || 0,
            publishedTests: tests?.length || 0, // status 컬럼이 없으므로 모든 테스트를 published로 간주
            totalResponses: responses?.length || 0,
            todayResponses,
        };
    },
};

import { supabase } from '@repo/shared';
import { generateSlug } from '../utils/slugUtils';
import type { Test, TestQuestion, TestChoice, TestResult } from '@repo/supabase';

// 유니크한 slug 생성 함수
const ensureUniqueSlug = async (baseSlug: string): Promise<string> => {
    if (!baseSlug || baseSlug.trim() === '') {
        baseSlug = 'test';
    }

    let slug = baseSlug.trim();
    let counter = 1;
    const maxAttempts = 100;

    while (counter <= maxAttempts) {
        const { data, error } = await supabase.from('tests').select('id').eq('slug', slug);

        if (!data || data.length === 0 || error) {
            return slug;
        }

        slug = `${baseSlug}-${counter}`;
        counter++;
    }

    return `${baseSlug}-${Date.now()}`;
};

// 테스트 생성 관련 타입들
export interface TestCreationData {
    id?: string;
    title: string;
    description?: string;
    slug?: string;
    thumbnail_url?: string;
    response_count?: number;
    view_count?: number;
    category_ids?: string[];
    short_code?: string;
    intro_text?: string;
    status?: 'published';
    estimated_time?: number;
    scheduled_at?: string | null;
    max_score?: number;
    type?: string;
    published_at?: string | null;
}

export interface QuestionCreationData {
    id?: string;
    question_text: string;
    question_order: number;
    image_url: string | null;
    choices: ChoiceCreationData[];
}

export interface ChoiceCreationData {
    id?: string;
    choice_text: string;
    choice_order: number;
    score: number | null;
    is_correct: boolean | null;
}

export interface ResultCreationData {
    id?: string;
    result_name: string;
    result_order: number;
    description: string | null;
    match_conditions: Record<string, unknown>;
    background_image_url: string | null;
    theme_color: string | null;
    features: Record<string, unknown>;
}

export interface CompleteTestData {
    test: TestCreationData;
    questions: QuestionCreationData[];
    results: ResultCreationData[];
}

// 테스트 생성 API 서비스
export const testCreationService = {
    // 1. 테스트 기본 정보 저장/업데이트
    async saveTestBasicInfo(data: TestCreationData): Promise<Test> {
        let baseSlug = data.slug;
        if (!baseSlug || baseSlug.trim() === '') {
            baseSlug = data.title ? generateSlug(data.title) : 'test';
        }

        const uniqueSlug = await ensureUniqueSlug(baseSlug);

        const dataWithUniqueFields = {
            title: data.title,
            description: data.description,
            slug: uniqueSlug,
            thumbnail_url: data.thumbnail_url,
            response_count: 0,
            view_count: 0,
            category_ids: data.category_ids || [],
            short_code: data.short_code || '',
            intro_text: data.intro_text,
            status: 'published', // 항상 published로 저장
            estimated_time: data.estimated_time,
            scheduled_at: data.scheduled_at,
            max_score: data.max_score,
            type: data.type,
            published_at: new Date().toISOString(), // 현재 시간으로 설정
        };

        if (data.id) {
            // 업데이트
            const updateData = {
                ...dataWithUniqueFields,
                updated_at: new Date().toISOString(),
            };

            const { data: result, error } = await supabase
                .from('tests')
                .update(updateData)
                .eq('id', data.id)
                .select()
                .maybeSingle();

            if (error) throw error;
            if (!result) throw new Error(`Test with id ${data.id} not found`);
            return result as Test;
        } else {
            // 생성
            const { data: result, error } = await supabase
                .from('tests')
                .insert([dataWithUniqueFields])
                .select()
                .single();

            if (error) throw error;
            return result as Test;
        }
    },

    // 2. 질문 저장/업데이트
    async saveQuestion(testId: string, questionData: QuestionCreationData): Promise<TestQuestion> {
        const questionPayload = {
            test_id: testId,
            question_text: questionData.question_text,
            image_url: questionData.image_url,
            question_order: questionData.question_order,
        };

        if (questionData.id) {
            const { data: result, error } = await supabase
                .from('test_questions')
                .update(questionPayload)
                .eq('id', questionData.id)
                .select()
                .maybeSingle();

            if (error) throw error;
            if (!result) {
                // 질문을 찾을 수 없으면 새로 생성
                const { data: newResult, error: createError } = await supabase
                    .from('test_questions')
                    .insert([questionPayload])
                    .select()
                    .single();

                if (createError) throw createError;
                return newResult as TestQuestion;
            }
            return result as TestQuestion;
        } else {
            const { data: result, error } = await supabase
                .from('test_questions')
                .insert([questionPayload])
                .select()
                .single();

            if (error) throw error;
            return result as TestQuestion;
        }
    },

    // 3. 선택지 저장/업데이트
    async saveChoice(questionId: string, choiceData: ChoiceCreationData): Promise<TestChoice> {
        const choicePayload = {
            question_id: questionId,
            choice_text: choiceData.choice_text,
            score: choiceData.score,
            is_correct: choiceData.is_correct,
            choice_order: choiceData.choice_order,
        };

        if (choiceData.id) {
            const { data: result, error } = await supabase
                .from('test_choices')
                .update(choicePayload)
                .eq('id', choiceData.id)
                .select()
                .maybeSingle();

            if (error) throw error;
            if (!result) {
                // 선택지를 찾을 수 없으면 새로 생성
                const { data: newResult, error: createError } = await supabase
                    .from('test_choices')
                    .insert([choicePayload])
                    .select()
                    .single();

                if (createError) throw createError;
                return newResult as TestChoice;
            }
            return result as TestChoice;
        } else {
            const { data: result, error } = await supabase
                .from('test_choices')
                .insert([choicePayload])
                .select()
                .single();

            if (error) throw error;
            return result as TestChoice;
        }
    },

    // 4. 결과 저장/업데이트
    async saveResult(testId: string, resultData: ResultCreationData): Promise<TestResult> {
        const resultPayload = {
            test_id: testId,
            result_name: resultData.result_name,
            description: resultData.description,
            background_image_url: resultData.background_image_url,
            theme_color: resultData.theme_color,
            match_conditions: resultData.match_conditions,
            result_order: resultData.result_order,
            features: resultData.features,
        };

        if (resultData.id) {
            const { data: result, error } = await supabase
                .from('test_results')
                .update(resultPayload)
                .eq('id', resultData.id)
                .select()
                .maybeSingle();

            if (error) throw error;
            if (!result) {
                // 결과를 찾을 수 없으면 새로 생성
                const { data: newResult, error: createError } = await supabase
                    .from('test_results')
                    .insert([resultPayload])
                    .select()
                    .single();

                if (createError) throw createError;
                return newResult as TestResult;
            }
            return result as TestResult;
        } else {
            const { data: result, error } = await supabase
                .from('test_results')
                .insert([resultPayload])
                .select()
                .single();

            if (error) throw error;
            return result as TestResult;
        }
    },

    // 5. 전체 테스트 저장 (원자적 트랜잭션)
    async saveCompleteTest(data: CompleteTestData): Promise<{ test: Test; questions: TestQuestion[]; results: TestResult[] }> {
        let test: Test | null = null;
        const questions: TestQuestion[] = [];
        const results: TestResult[] = [];

        try {
            // 1. 테스트 기본 정보 저장
            test = await this.saveTestBasicInfo(data.test);

            // 2. 기존 질문들과 선택지들 삭제 (업데이트 모드인 경우)
            if (data.test.id) {
                const { data: existingQuestions } = await supabase
                    .from('test_questions')
                    .select('id')
                    .eq('test_id', test.id);

                if (existingQuestions && existingQuestions.length > 0) {
                    const questionIds = existingQuestions.map((q: { id: string }) => q.id);

                    // 선택지들 삭제
                    const { error: choicesError } = await supabase
                        .from('test_choices')
                        .delete()
                        .in('question_id', questionIds);

                    if (choicesError) throw choicesError;

                    // 질문들 삭제
                    const { error: questionsError } = await supabase
                        .from('test_questions')
                        .delete()
                        .eq('test_id', test.id);

                    if (questionsError) throw questionsError;
                }
            }

            // 3. 새로운 질문들 저장
            for (let i = 0; i < data.questions.length; i++) {
                const questionData = {
                    ...data.questions[i],
                    test_id: test.id,
                    question_order: i,
                    id: data.test.id ? undefined : data.questions[i].id,
                };

                const question = await this.saveQuestion(test.id, questionData);
                questions.push(question);

                // 4. 각 질문의 선택지들 저장
                for (let j = 0; j < questionData.choices.length; j++) {
                    const choiceData = {
                        ...questionData.choices[j],
                        question_id: question.id,
                        choice_order: j,
                        id: data.test.id ? undefined : questionData.choices[j].id,
                    };
                    await this.saveChoice(question.id, choiceData);
                }
            }

            // 5. 기존 결과들 삭제 (업데이트 모드인 경우)
            if (data.test.id) {
                const { error: resultsError } = await supabase
                    .from('test_results')
                    .delete()
                    .eq('test_id', test.id);

                if (resultsError) throw resultsError;
            }

            // 6. 새로운 결과들 저장
            for (let i = 0; i < data.results.length; i++) {
                const resultData = {
                    ...data.results[i],
                    test_id: test.id,
                    result_order: i,
                    id: data.test.id ? undefined : data.results[i].id,
                };
                const result = await this.saveResult(test.id, resultData);
                results.push(result);
            }

            return { test, questions, results };
        } catch (error) {
            // 롤백: 테스트가 생성되었다면 삭제 (생성 모드인 경우만)
            if (test && !data.test.id) {
                try {
                    await this.deleteTest(test.id);
                } catch (rollbackError) {
                    console.error('Error during rollback:', rollbackError);
                }
            }

            throw error;
        }
    },

    // 6. 테스트 삭제
    async deleteTest(testId: string): Promise<void> {
        const { error } = await supabase.from('tests').delete().eq('id', testId);
        if (error) throw error;
    },

    // 7. 질문 삭제
    async deleteQuestion(questionId: string): Promise<void> {
        const { error } = await supabase.from('test_questions').delete().eq('id', questionId);
        if (error) throw error;
    },

    // 8. 선택지 삭제
    async deleteChoice(choiceId: string): Promise<void> {
        const { error } = await supabase.from('test_choices').delete().eq('id', choiceId);
        if (error) throw error;
    },

    // 9. 결과 삭제
    async deleteResult(resultId: string): Promise<void> {
        const { error } = await supabase.from('test_results').delete().eq('id', resultId);
        if (error) throw error;
    },
};

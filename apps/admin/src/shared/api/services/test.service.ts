import { supabase } from '@repo/shared';
import type {
	Test,
	TestChoice,
	TestChoiceInsert,
	TestInsert,
	TestQuestion,
	TestQuestionInsert,
	TestResult,
	TestResultInsert,
	TestUpdate,
	TestWithDetails,
	TestWithNestedDetails,
} from '@repo/supabase';
import { generateSlug } from '../../../utils/slugUtils';

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

// Supabase 타입을 직접 사용
export type QuestionCreationData = TestQuestionInsert & {
	choices: TestChoiceInsert[];
};

export type ResultCreationData = TestResultInsert;

export type CompleteTestData = {
	test: TestInsert;
	questions: QuestionCreationData[];
	results: ResultCreationData[];
};

// 테스트 서비스 - 실제 사용되는 함수들만 포함
export const testService = {
	// 모든 테스트 목록 조회 (Admin UI 호환 포맷으로 변환)
	async getAllTests(): Promise<TestWithDetails[]> {
		const { data, error } = await supabase.from('tests').select('*').order('created_at', { ascending: false });
		if (error) throw error;

		// 카테고리 정보 가져오기
		const { data: categories } = await supabase.from('categories').select('id, name').eq('is_active', true);
		const categoryMap = new Map(categories?.map((cat) => [cat.id.toString(), cat.name]) || []);

		// Admin UI 호환 포맷으로 변환
		return (data || []).map((item: Test) => {
			const categoryNames = item.category_ids?.map((id) => categoryMap.get(id) || '기타') || ['기타'];
			const primaryCategory = categoryNames[0] || '기타';

			return {
				...item,
				category: primaryCategory,
				category_name: primaryCategory,
				emoji: '📝',
				status: item.status || 'draft',
				type: item.type || 'psychology',
				thumbnailImage: item.thumbnail_url || '',
				startMessage: '',
				scheduledAt: item.scheduled_at || '',
				responseCount: item.response_count || 0,
				completionRate: 0,
				estimatedTime: item.estimated_time || 5,
				share_count: 0,
				completion_count: 0,
				createdBy: '',
				createdAt: item.created_at,
				updatedAt: item.updated_at,
				isPublished: item.status === 'published',
				question_count: 0,
				result_count: 0,
				response_count: item.response_count || 0,
				questions: [],
				results: [],
			};
		}) as TestWithDetails[];
	},

	// ID로 테스트 조회 (Admin UI 호환 포맷으로 변환)
	async getTestById(id: string): Promise<TestWithDetails> {
		const { data, error } = await supabase.from('tests').select('*').eq('id', id).maybeSingle();
		if (error) throw error;
		if (!data) throw new Error(`Test with id ${id} not found`);

		// 카테고리 정보 가져오기
		const { data: categories } = await supabase.from('categories').select('id, name').eq('is_active', true);
		const categoryMap = new Map(categories?.map((cat) => [cat.id.toString(), cat.name]) || []);

		const categoryNames = data.category_ids?.map((id) => categoryMap.get(id) || '기타') || ['기타'];
		const primaryCategory = categoryNames[0] || '기타';

		return {
			...data,
			category: primaryCategory,
			category_name: primaryCategory,
			emoji: '📝',
			status: data.status || 'draft',
			type: data.type || 'psychology',
			thumbnailImage: data.thumbnail_url || '',
			startMessage: '',
			scheduledAt: data.scheduled_at || '',
			responseCount: data.response_count || 0,
			completionRate: 0,
			estimatedTime: data.estimated_time || 5,
			share_count: 0,
			completion_count: 0,
			createdBy: '',
			createdAt: data.created_at,
			updatedAt: data.updated_at,
			isPublished: data.status === 'published',
			questions: [],
			results: [],
		} as TestWithDetails;
	},

	// 상세 테스트 조회 (질문, 결과 포함)
	async getTestWithDetails(testId: string): Promise<TestWithNestedDetails> {
		const { data, error } = await supabase.rpc('get_test_complete_optimized', {
			test_uuid: testId,
		});
		if (error) throw error;
		if (!data) throw new Error(`Test with id ${testId} not found`);
		return data as TestWithNestedDetails;
	},

	// 새 테스트 생성
	async createTest(testData: TestInsert): Promise<TestWithDetails> {
		const { data, error } = await supabase.from('tests').insert([testData]).select().single();
		if (error) throw error;

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

	// 테스트 수정
	async updateTest(id: string, testData: TestUpdate): Promise<TestWithDetails> {
		const { data, error } = await supabase.from('tests').update(testData).eq('id', id).select().single();
		if (error) throw error;

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

	// 테스트 삭제
	async deleteTest(id: string): Promise<void> {
		const { error } = await supabase.from('tests').delete().eq('id', id);
		if (error) throw error;
	},

	// 게시 상태 토글 (updated_at만 업데이트)
	async togglePublishStatus(id: string, isPublished?: boolean): Promise<Test> {
		const { data, error } = await supabase
			.from('tests')
			.update({ updated_at: new Date().toISOString() })
			.eq('id', id)
			.select()
			.single();
		if (error) throw error;
		return data as Test;
	},

	// 통합 테스트 저장 (질문, 결과 포함하여 생성/수정)
	async saveCompleteTest(data: CompleteTestData): Promise<TestWithNestedDetails> {
		// slug 생성
		let baseSlug = data.test.slug;
		if (!baseSlug || baseSlug.trim() === '') {
			baseSlug = data.test.title ? generateSlug(data.test.title) : 'test';
		}
		const uniqueSlug = await ensureUniqueSlug(baseSlug);

		// 테스트 데이터 준비
		const testData = {
			...data.test,
			id: data.test.id || null,
			slug: uniqueSlug,
			response_count: data.test.response_count || 0,
			view_count: data.test.view_count || 0,
			category_ids: data.test.category_ids || [],
			short_code: data.test.short_code && data.test.short_code.trim() !== '' ? data.test.short_code : null,
			status: data.test.status || 'published',
			published_at: data.test.published_at || new Date().toISOString(),
		};

		// 질문 데이터 준비
		const questionsData = data.questions.map((q, index) => ({
			question_text: q.question_text,
			question_order: index,
			image_url: q.image_url,
			choices: q.choices.map((c, choiceIndex) => ({
				choice_text: c.choice_text,
				choice_order: choiceIndex,
				score: c.score || 0,
				is_correct: c.is_correct || false,
			})),
		}));

		// 결과 데이터 준비
		const resultsData = data.results.map((r, index) => ({
			result_name: r.result_name,
			description: r.description,
			result_order: index,
			background_image_url: r.background_image_url,
			theme_color: r.theme_color,
			match_conditions: r.match_conditions || {},
			features: r.features || {},
		}));

		// ID가 있으면 수정, 없으면 생성
		if (data.test.id) {
			const { data: result, error } = await supabase.rpc('save_test_complete', {
				test_uuid: data.test.id,
				test_data: testData,
				questions_data: questionsData,
				results_data: resultsData,
			});
			if (error) throw error;
			return result as TestWithNestedDetails;
		} else {
			const { data: result, error } = await supabase.rpc('create_test_complete', {
				test_data: testData,
				questions_data: questionsData,
				results_data: resultsData,
			});
			if (error) throw error;
			return result as TestWithNestedDetails;
		}
	},

	// 공유수 증가
	async incrementShareCount(id: string): Promise<void> {
		const { data: current, error: fetchError } = await supabase
			.from('tests')
			.select('share_count')
			.eq('id', id)
			.single();
		if (fetchError) throw fetchError;

		const { error: updateError } = await supabase
			.from('tests')
			.update({ share_count: (current.share_count || 0) + 1 })
			.eq('id', id);
		if (updateError) throw updateError;
	},

	// 조회수 증가
	async incrementViewCount(id: string): Promise<void> {
		const { data: current, error: fetchError } = await supabase
			.from('tests')
			.select('view_count')
			.eq('id', id)
			.single();
		if (fetchError) throw fetchError;

		const { error: updateError } = await supabase
			.from('tests')
			.update({ view_count: (current.view_count || 0) + 1 })
			.eq('id', id);
		if (updateError) throw updateError;
	},
};

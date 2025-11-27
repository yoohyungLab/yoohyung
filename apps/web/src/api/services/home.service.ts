import { createServerClient, supabase } from '@pickid/supabase';
import type { Category, Test } from '@pickid/supabase';

// Type re-exports
export type { Category, Test };

// Home Service - 홈 페이지 데이터 조회
// 순수 데이터 접근만 담당, 변환 로직은 lib/transforms.ts에서 처리
export const homeService = {
	getClient() {
		return typeof window === 'undefined' ? createServerClient() : supabase;
	},

	// 게시된 테스트 목록 조회
	async getPublishedTests(): Promise<Test[]> {
		const client = this.getClient();

		const { data, error } = await client
			.from('tests')
			.select('*')
			.eq('status', 'published')
			.order('created_at', { ascending: false });

		if (error) {
			throw new Error(`게시된 테스트 조회 실패: ${error.message}`);
		}

		return data || [];
	},

	// 활성 카테고리 목록 조회
	async getActiveCategories(): Promise<Category[]> {
		const client = this.getClient();

		const { data, error } = await client.from('categories').select('*').eq('status', 'active').order('name');

		if (error) {
			throw new Error(`활성 카테고리 조회 실패: ${error.message}`);
		}

		return data || [];
	},

	// 홈 페이지 데이터 일괄 조회 (테스트 + 카테고리)
	async getHomePageData(): Promise<{ tests: Test[]; categories: Category[] }> {
		const client = this.getClient();

		const [testsData, categoriesData] = await Promise.all([
			client.from('tests').select('*').eq('status', 'published').order('created_at', { ascending: false }),
			client.from('categories').select('*').eq('status', 'active').order('name'),
		]);

		if (testsData.error) {
			throw new Error(`테스트 조회 실패: ${testsData.error.message}`);
		}

		if (categoriesData.error) {
			throw new Error(`카테고리 조회 실패: ${categoriesData.error.message}`);
		}

		return {
			tests: (testsData.data as Test[]) || [],
			categories: (categoriesData.data as Category[]) || [],
		};
	},
};

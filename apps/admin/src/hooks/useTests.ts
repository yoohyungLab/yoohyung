import { queryKeys } from '@pickid/shared';
import { TEST_STATUS } from '@/constants';
import { testService } from '@/services/test.service';
import { useToast } from '@pickid/shared';
import type { Database, TestFilters, TestStats, TestStatus } from '@pickid/supabase';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useCallback, useMemo, useState } from 'react';

// Test status constants


type TestInsert = Database['public']['Tables']['tests']['Insert'];
type TestQuestionInsert = Database['public']['Tables']['test_questions']['Insert'];
type TestResultInsert = Database['public']['Tables']['test_results']['Insert'];

interface ISaveTestParams {
	testData: TestInsert;
	questionsData: TestQuestionInsert[];
	resultsData: TestResultInsert[];
}

interface IUpdateTestStatusParams {
	id: string;
	status: TestStatus;
}

export const useTests = () => {
	const queryClient = useQueryClient();
	const toast = useToast();

	const { data: tests = [], isLoading: loading } = useQuery({
		queryKey: queryKeys.tests.all,
		queryFn: () => testService.getTests(),
		staleTime: 5 * 60 * 1000,
	});

	const saveTestMutation = useMutation({
		mutationFn: ({ testData, questionsData, resultsData }: ISaveTestParams) =>
			testService.saveCompleteTest(testData, questionsData, resultsData),
		onSuccess: (_data, variables) => {
			queryClient.invalidateQueries({ queryKey: queryKeys.tests.all });
			if (variables.testData.id) {
				queryClient.invalidateQueries({ queryKey: queryKeys.tests.detail(variables.testData.id) });
			}
			toast.success('테스트가 성공적으로 저장되었습니다.');
		},
	});

	const deleteTestMutation = useMutation({
		mutationFn: (testId: string) => testService.deleteTest(testId),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: queryKeys.tests.all });
			toast.success('테스트가 삭제되었습니다.');
		},
	});

	const updateStatusMutation = useMutation({
		mutationFn: ({ id, status }: IUpdateTestStatusParams) => testService.updateTestStatus(id, status),
		onSuccess: (_data, variables) => {
			queryClient.invalidateQueries({ queryKey: queryKeys.tests.all });
			queryClient.invalidateQueries({ queryKey: queryKeys.tests.detail(variables.id) });
			toast.success('테스트 상태가 변경되었습니다.');
		},
	});

	const [filters, setFilters] = useState<TestFilters>({
		search: '',
		status: 'all',
	});

	const filteredTests = useMemo(() => {
		return tests.filter((test) => {
			const matchesSearch =
				filters.search === '' || test.title.toLowerCase().includes((filters.search || '').toLowerCase());
			const matchesStatus = filters.status === 'all' || test.status === filters.status;
			return matchesSearch && matchesStatus;
		});
	}, [tests, filters]);

	const stats = useMemo((): TestStats => {
		if (tests.length === 0) {
			return {
				total: 0,
				published: 0,
				draft: 0,
				scheduled: 0,
				archived: 0,
				responses: 0,
			};
		}

		return {
			total: tests.length,
			published: tests.filter((test) => test.status === TEST_STATUS.PUBLISHED).length,
			draft: tests.filter((test) => test.status === TEST_STATUS.DRAFT).length,
			scheduled: tests.filter((test) => test.status === TEST_STATUS.SCHEDULED).length,
			archived: tests.filter((test) => test.status === TEST_STATUS.ARCHIVED).length,
			responses: tests.reduce((sum, test) => sum + (test.response_count || 0), 0),
		};
	}, [tests]);

	const updateFilters = useCallback((newFilters: Partial<TestFilters>) => {
		setFilters((prev) => ({ ...prev, ...newFilters }));
	}, []);

	return {
		tests: filteredTests,
		loading,
		filters,
		stats,
		updateFilters,
		saveTest: saveTestMutation.mutateAsync,
		deleteTest: deleteTestMutation.mutateAsync,
		updateTestStatus: updateStatusMutation.mutateAsync,
	};
};

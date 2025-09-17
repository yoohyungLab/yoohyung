import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { testCreationService } from '../api/test-creation.service';
import type {
    TestCreationData,
    QuestionCreationData,
    ChoiceCreationData,
    ResultCreationData,
    CompleteTestData,
} from '../api/test-creation.service';

// Query Keys
export const testCreationKeys = {
    all: ['test-creation'] as const,
    test: (id: string) => [...testCreationKeys.all, 'test', id] as const,
    questions: (testId: string) => [...testCreationKeys.all, 'questions', testId] as const,
    results: (testId: string) => [...testCreationKeys.all, 'results', testId] as const,
};

// 1. 테스트 기본 정보 관련 훅들
export const useTestBasicInfo = (testId?: string) => {
    return useQuery({
        queryKey: testCreationKeys.test(testId || ''),
        queryFn: () => testCreationService.saveTestBasicInfo({} as TestCreationData),
        enabled: false, // 수동으로 호출
    });
};

export const useSaveTestBasicInfo = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: TestCreationData) => testCreationService.saveTestBasicInfo(data),
        onSuccess: (data) => {
            queryClient.setQueryData(testCreationKeys.test(data.id), data);
        },
    });
};

// 2. 질문 관련 훅들
export const useSaveQuestion = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ testId, questionData }: { testId: string; questionData: QuestionCreationData }) =>
            testCreationService.saveQuestion(testId, questionData),
        onSuccess: (data, variables) => {
            queryClient.invalidateQueries({ queryKey: testCreationKeys.questions(variables.testId) });
        },
    });
};

export const useDeleteQuestion = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (questionId: string) => testCreationService.deleteQuestion(questionId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: testCreationKeys.all });
        },
    });
};

// 3. 선택지 관련 훅들
export const useSaveChoice = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ questionId, choiceData }: { questionId: string; choiceData: ChoiceCreationData }) =>
            testCreationService.saveChoice(questionId, choiceData),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: testCreationKeys.all });
        },
    });
};

export const useDeleteChoice = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (choiceId: string) => testCreationService.deleteChoice(choiceId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: testCreationKeys.all });
        },
    });
};

// 4. 결과 관련 훅들
export const useSaveResult = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ testId, resultData }: { testId: string; resultData: ResultCreationData }) =>
            testCreationService.saveResult(testId, resultData),
        onSuccess: (data, variables) => {
            queryClient.invalidateQueries({ queryKey: testCreationKeys.results(variables.testId) });
        },
    });
};

export const useDeleteResult = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (resultId: string) => testCreationService.deleteResult(resultId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: testCreationKeys.all });
        },
    });
};

// 5. 전체 테스트 저장 훅
export const useSaveCompleteTest = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: CompleteTestData) => testCreationService.saveCompleteTest(data),
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: testCreationKeys.all });
            queryClient.setQueryData(testCreationKeys.test(data.test.id), data.test);
        },
    });
};

// 6. 테스트 삭제 훅
export const useDeleteTest = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (testId: string) => testCreationService.deleteTest(testId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: testCreationKeys.all });
        },
    });
};

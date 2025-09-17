import { useSaveCompleteTest } from './useTestCreationQueries';
import type { QuestionCreationData, ResultCreationData } from '../api/test-creation.service';
import type { BasicInfo } from '../components/test/test-create/types';

export const useTestSave = (
    basicInfo: BasicInfo,
    type: string | null,
    questions: QuestionCreationData[],
    results: ResultCreationData[],
    testId?: string,
    prepareForSubmission?: () => void
) => {
    const saveCompleteTestMutation = useSaveCompleteTest();

    const saveTest = async () => {
        // 제출 전에 short_code와 slug 생성
        if (prepareForSubmission) {
            prepareForSubmission();
        }

        const completeData = {
            test: {
                ...basicInfo,
                type: type || '',
                id: testId,
                description: basicInfo.description || undefined,
                thumbnail_url: basicInfo.thumbnail_url || undefined,
                intro_text: basicInfo.intro_text || undefined,
                status: 'published' as const,
                estimated_time: basicInfo.estimated_time || undefined,
                scheduled_at: basicInfo.scheduled_at || undefined,
                max_score: basicInfo.max_score || undefined,
                published_at: new Date().toISOString(),
                category_ids: basicInfo.category_ids.map((id) => id.toString()),
            },
            questions,
            results,
        };
        return await saveCompleteTestMutation.mutateAsync(completeData);
    };

    return {
        saveTest,
        isLoading: saveCompleteTestMutation.isPending,
    };
};

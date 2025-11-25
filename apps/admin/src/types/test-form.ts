import type { BasicInfo, QuestionData, ResultData } from './test.types';

export interface TestFormValues {
	type: string | null;
	basicInfo: BasicInfo;
	questions: QuestionData[];
	results: ResultData[];
}

import type { TestResult } from '@pickid/supabase';
import { DescriptionSection } from './sections/description-section';
import { JobsSection } from './sections/jobs-section';
import { CompatibilitySection } from './sections/compatibility-section';
import { GiftsSection } from './sections/gifts-section';

interface ITestResultContentProps {
	testResult: TestResult;
}

export function TestResultContent({ testResult }: ITestResultContentProps) {
	const features = testResult.features as Record<string, string[] | string>;
	const themeColor = testResult.theme_color || '#3B82F6';

	return (
		<div className="max-w-lg mx-auto px-5">
			<DescriptionSection description={testResult.description || ''} themeColor={themeColor} />

			<div className="space-y-3">
				<JobsSection jobs={features?.['잘 맞는 직업'] || ''} themeColor={themeColor} />
				<CompatibilitySection
					bestMatches={features?.['최고의 궁합'] || ''}
					worstMatches={features?.['최악의 궁합'] || ''}
					themeColor={themeColor}
				/>
				<GiftsSection gifts={features?.['선호하는 선물'] || ''} themeColor={themeColor} />
			</div>
		</div>
	);
}

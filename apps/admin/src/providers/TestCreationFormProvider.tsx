import { FormProvider, useForm, useFormContext } from 'react-hook-form';
import type { TestFormValues } from '@/types/test-form';
import { DEFAULT_QUESTION, DEFAULT_RESULT } from '@/constants/test';
import { createBasicInfoWithShortCode } from '@/utils/test.utils';

interface TestCreationFormProviderProps {
	children: React.ReactNode;
	defaultValues?: Partial<TestFormValues>;
}

export function TestCreationFormProvider({ children, defaultValues }: TestCreationFormProviderProps) {
	const methods = useForm<TestFormValues>({
		defaultValues: {
			type: null,
			basicInfo: createBasicInfoWithShortCode(),
			questions: [DEFAULT_QUESTION],
			results: [DEFAULT_RESULT],
			...defaultValues,
		},
		mode: 'onChange',
	});

	return <FormProvider {...methods}>{children}</FormProvider>;
}

export const useTestForm = () => {
	const context = useFormContext<TestFormValues>();
	if (!context) {
		throw new Error('useTestForm must be used within TestCreationFormProvider');
	}
	return context;
};

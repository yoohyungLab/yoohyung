import type { Test } from '@pickid/supabase';

export type ITestBase = Pick<Test, 'id' | 'title' | 'description' | 'type'>;

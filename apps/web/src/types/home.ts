// Home Feature Types

import type { Test } from '@pickid/supabase';

// Popular Test
export interface IPopularTest extends Pick<Test, 'id' | 'title' | 'description' | 'thumbnail_url'> {
	testId: string;
	category?: string;
	thumbnailUrl: string;
	participantCount: number;
}

// Home Feature Types

import type { Test } from '@pickid/supabase';

// Popular Test
export interface IPopularTest extends Pick<Test, 'id' | 'title' | 'description' | 'thumbnail_url'> {
	category?: string;
	participantCount: number;
}

/**
 * Home Feature Types
 */

import type { Test } from '@pickid/supabase';

export interface Banner {
	id: string;
	image: string;
	title?: string;
	description?: string;
	testId?: string;
	ctaAction?: () => void;
}

// Popular Test
export interface IPopularTest extends Pick<Test, 'id' | 'title' | 'description' | 'thumbnail_url'> {
	testId: string;
	category?: string;
	thumbnailUrl: string;
	participantCount: number;
}

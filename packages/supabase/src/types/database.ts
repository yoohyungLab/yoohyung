export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export interface Database {
	public: {
		Tables: {
			categories: {
				Row: {
					id: string;
					name: string;
					slug: string;
					description: string | null;
					icon_url: string | null;
					color_code: string | null;
					status: string;
					sort_order: number;
					created_at: string;
					updated_at: string;
				};
				Insert: Partial<Database['public']['Tables']['categories']['Row']>;
				Update: Partial<Database['public']['Tables']['categories']['Row']>;
			};
			tests: {
				Row: {
					id: string;
					title: string;
					slug: string;
					description: string | null;
					thumbnail_url: string | null;
					type: string | null;
					status: string;
					category_ids: string[] | null;
					start_count: number | null;
					response_count: number | null;
					requires_gender: boolean | null;
					created_at: string;
					updated_at: string;
				};
				Insert: Partial<Database['public']['Tables']['tests']['Row']>;
				Update: Partial<Database['public']['Tables']['tests']['Row']>;
			};
			test_questions: {
				Row: {
					id: string;
					test_id: string;
					question_text: string;
					question_order: number;
					image_url: string | null;
					created_at: string;
					updated_at: string;
				};
				Insert: Partial<Database['public']['Tables']['test_questions']['Row']>;
				Update: Partial<Database['public']['Tables']['test_questions']['Row']>;
			};
			test_choices: {
				Row: {
					id: string;
					question_id: string;
					choice_text: string;
					choice_order: number;
					score: number | null;
					response_count: number | null;
					created_at: string;
					updated_at: string;
				};
				Insert: Partial<Database['public']['Tables']['test_choices']['Row']>;
				Update: Partial<Database['public']['Tables']['test_choices']['Row']>;
			};
			test_results: {
				Row: {
					id: string;
					test_id: string;
					result_name: string;
					description: string | null;
					image_url: string | null;
					min_score: number | null;
					max_score: number | null;
					theme_color: string | null;
					background_image_url: string | null;
					features: Json | null;
					created_at: string;
					updated_at: string;
				};
				Insert: Partial<Database['public']['Tables']['test_results']['Row']>;
				Update: Partial<Database['public']['Tables']['test_results']['Row']>;
			};
			user_test_responses: {
				Row: {
					id: string;
					user_id: string | null;
					test_id: string;
					session_id: string | null;
					started_at: string | null;
					completed_at: string | null;
					completion_time_seconds: number | null;
					total_score: number | null;
					result: string | null;
					responses: Json | null;
					device_type: string | null;
					ip_address: string | null;
					user_agent: string | null;
					referrer: string | null;
					created_at: string;
				};
				Insert: Partial<Database['public']['Tables']['user_test_responses']['Row']>;
				Update: Partial<Database['public']['Tables']['user_test_responses']['Row']>;
			};
			feedbacks: {
				Row: {
					id: string;
					title: string;
					content: string;
					category: string;
					status: string;
					author_name: string | null;
					author_email: string | null;
					admin_reply: string | null;
					admin_reply_at: string | null;
					created_at: string;
					updated_at: string;
				};
				Insert: Partial<Database['public']['Tables']['feedbacks']['Row']>;
				Update: Partial<Database['public']['Tables']['feedbacks']['Row']>;
			};
			users: {
				Row: {
					id: string;
					email: string | null;
					name: string | null;
					avatar_url: string | null;
					provider: string | null;
					status: string | null;
					created_at: string;
					updated_at: string;
				};
				Insert: Partial<Database['public']['Tables']['users']['Row']>;
				Update: Partial<Database['public']['Tables']['users']['Row']>;
			};
			admin_users: {
				Row: {
					id: string;
					user_id: string;
					role: string;
					permissions: Json | null;
					created_at: string;
					updated_at: string;
				};
				Insert: Partial<Database['public']['Tables']['admin_users']['Row']>;
				Update: Partial<Database['public']['Tables']['admin_users']['Row']>;
			};
			home_balance_games: {
				Row: {
					id: string;
					title: string;
					option_a_emoji: string;
					option_a_label: string;
					option_b_emoji: string;
					option_b_label: string;
					total_votes: number;
					votes_a: number;
					votes_b: number;
					week_number: number;
					created_at: string;
					updated_at: string;
				};
				Insert: Partial<Database['public']['Tables']['home_balance_games']['Row']>;
				Update: Partial<Database['public']['Tables']['home_balance_games']['Row']>;
			};
			home_balance_votes: {
				Row: {
					id: string;
					game_id: string;
					choice: string;
					ip_address: string | null;
					user_agent: string | null;
					created_at: string;
				};
				Insert: Partial<Database['public']['Tables']['home_balance_votes']['Row']>;
				Update: Partial<Database['public']['Tables']['home_balance_votes']['Row']>;
			};
		};
		Enums: {
			category_status: 'active' | 'inactive';
			gender_type: 'male' | 'female' | 'other';
		};
	};
}

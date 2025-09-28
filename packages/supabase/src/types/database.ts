export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
	// Allows to automatically instantiate createClient with right options
	// instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
	__InternalSupabase: {
		PostgrestVersion: '12.2.3 (519615d)';
	};
	public: {
		Tables: {
			admin_users: {
				Row: {
					created_at: string | null;
					email: string | null;
					id: string;
					is_active: boolean | null;
					name: string;
					password_hash: string;
					updated_at: string | null;
					username: string;
				};
				Insert: {
					created_at?: string | null;
					email?: string | null;
					id?: string;
					is_active?: boolean | null;
					name: string;
					password_hash: string;
					updated_at?: string | null;
					username: string;
				};
				Update: {
					created_at?: string | null;
					email?: string | null;
					id?: string;
					is_active?: boolean | null;
					name?: string;
					password_hash?: string;
					updated_at?: string | null;
					username?: string;
				};
				Relationships: [];
			};
			categories: {
				Row: {
					banner_url: string | null;
					created_at: string;
					description: string | null;
					icon_url: string | null;
					id: string;
					is_active: boolean | null;
					name: string;
					slug: string;
					sort_order: number | null;
					thumbnail_url: string | null;
					updated_at: string;
				};
				Insert: {
					banner_url?: string | null;
					created_at?: string;
					description?: string | null;
					icon_url?: string | null;
					id?: string;
					is_active?: boolean | null;
					name: string;
					slug: string;
					sort_order?: number | null;
					thumbnail_url?: string | null;
					updated_at?: string;
				};
				Update: {
					banner_url?: string | null;
					created_at?: string;
					description?: string | null;
					icon_url?: string | null;
					id?: string;
					is_active?: boolean | null;
					name?: string;
					slug?: string;
					sort_order?: number | null;
					thumbnail_url?: string | null;
					updated_at?: string;
				};
				Relationships: [];
			};
			favorites: {
				Row: {
					content_id: string | null;
					created_at: string;
					id: string;
					user_id: string | null;
				};
				Insert: {
					content_id?: string | null;
					created_at?: string;
					id?: string;
					user_id?: string | null;
				};
				Update: {
					content_id?: string | null;
					created_at?: string;
					id?: string;
					user_id?: string | null;
				};
				Relationships: [];
			};
			feedbacks: {
				Row: {
					admin_reply: string | null;
					admin_reply_at: string | null;
					attached_file_url: string | null;
					author_email: string | null;
					author_name: string | null;
					category: string;
					content: string;
					created_at: string;
					id: string;
					status: string;
					title: string;
					updated_at: string;
					views: number | null;
				};
				Insert: {
					admin_reply?: string | null;
					admin_reply_at?: string | null;
					attached_file_url?: string | null;
					author_email?: string | null;
					author_name?: string | null;
					category?: string;
					content: string;
					created_at?: string;
					id?: string;
					status?: string;
					title: string;
					updated_at?: string;
					views?: number | null;
				};
				Update: {
					admin_reply?: string | null;
					admin_reply_at?: string | null;
					attached_file_url?: string | null;
					author_email?: string | null;
					author_name?: string | null;
					category?: string;
					content?: string;
					created_at?: string;
					id?: string;
					status?: string;
					title?: string;
					updated_at?: string;
					views?: number | null;
				};
				Relationships: [];
			};
			users: {
				Row: {
					avatar_url: string | null;
					created_at: string | null;
					email: string | null;
					id: string;
					name: string | null;
					provider: string | null;
					status: string | null;
					updated_at: string | null;
				};
				Insert: {
					avatar_url?: string | null;
					created_at?: string | null;
					email?: string | null;
					id: string;
					name?: string | null;
					provider?: string | null;
					status?: string | null;
					updated_at?: string | null;
				};
				Update: {
					avatar_url?: string | null;
					created_at?: string | null;
					email?: string | null;
					id?: string;
					name?: string | null;
					provider?: string | null;
					status?: string | null;
					updated_at?: string | null;
				};
				Relationships: [];
			};
			test_choices: {
				Row: {
					choice_order: number;
					choice_text: string;
					created_at: string | null;
					id: string;
					is_correct: boolean | null;
					question_id: string | null;
					score: number | null;
				};
				Insert: {
					choice_order: number;
					choice_text: string;
					created_at?: string | null;
					id?: string;
					is_correct?: boolean | null;
					question_id?: string | null;
					score?: number | null;
				};
				Update: {
					choice_order?: number;
					choice_text?: string;
					created_at?: string | null;
					id?: string;
					is_correct?: boolean | null;
					question_id?: string | null;
					score?: number | null;
				};
				Relationships: [
					{
						foreignKeyName: 'test_choices_question_id_fkey';
						columns: ['question_id'];
						isOneToOne: false;
						referencedRelation: 'test_questions';
						referencedColumns: ['id'];
					}
				];
			};
			test_questions: {
				Row: {
					created_at: string | null;
					id: string;
					image_url: string | null;
					question_order: number;
					question_text: string;
					test_id: string | null;
					updated_at: string | null;
				};
				Insert: {
					created_at?: string | null;
					id?: string;
					image_url?: string | null;
					question_order: number;
					question_text: string;
					test_id?: string | null;
					updated_at?: string | null;
				};
				Update: {
					created_at?: string | null;
					id?: string;
					image_url?: string | null;
					question_order?: number;
					question_text?: string;
					test_id?: string | null;
					updated_at?: string | null;
				};
				Relationships: [
					{
						foreignKeyName: 'test_questions_test_id_fkey';
						columns: ['test_id'];
						isOneToOne: false;
						referencedRelation: 'tests';
						referencedColumns: ['id'];
					}
				];
			};
			test_results: {
				Row: {
					background_image_url: string | null;
					created_at: string | null;
					description: string | null;
					features: Json | null;
					id: string;
					match_conditions: Json | null;
					result_name: string;
					result_order: number;
					test_id: string | null;
					theme_color: string | null;
					updated_at: string | null;
				};
				Insert: {
					background_image_url?: string | null;
					created_at?: string | null;
					description?: string | null;
					features?: Json | null;
					id?: string;
					match_conditions?: Json | null;
					result_name: string;
					result_order: number;
					test_id?: string | null;
					theme_color?: string | null;
					updated_at?: string | null;
				};
				Update: {
					background_image_url?: string | null;
					created_at?: string | null;
					description?: string | null;
					features?: Json | null;
					id?: string;
					match_conditions?: Json | null;
					result_name?: string;
					result_order?: number;
					test_id?: string | null;
					theme_color?: string | null;
					updated_at?: string | null;
				};
				Relationships: [
					{
						foreignKeyName: 'test_results_test_id_fkey';
						columns: ['test_id'];
						isOneToOne: false;
						referencedRelation: 'tests';
						referencedColumns: ['id'];
					}
				];
			};
			tests: {
				Row: {
					category_ids: string[] | null;
					created_at: string;
					description: string | null;
					estimated_time: number | null;
					id: string;
					intro_text: string | null;
					max_score: number | null;
					published_at: string | null;
					response_count: number | null;
					scheduled_at: string | null;
					short_code: string | null;
					slug: string;
					status: string | null;
					thumbnail_url: string | null;
					title: string;
					type: string | null;
					updated_at: string;
					view_count: number | null;
				};
				Insert: {
					category_ids?: string[] | null;
					created_at?: string;
					description?: string | null;
					estimated_time?: number | null;
					id?: string;
					intro_text?: string | null;
					max_score?: number | null;
					published_at?: string | null;
					response_count?: number | null;
					scheduled_at?: string | null;
					short_code?: string | null;
					slug: string;
					status?: string | null;
					thumbnail_url?: string | null;
					title: string;
					type?: string | null;
					updated_at?: string;
					view_count?: number | null;
				};
				Update: {
					category_ids?: string[] | null;
					created_at?: string;
					description?: string | null;
					estimated_time?: number | null;
					id?: string;
					intro_text?: string | null;
					max_score?: number | null;
					published_at?: string | null;
					response_count?: number | null;
					scheduled_at?: string | null;
					short_code?: string | null;
					slug?: string;
					status?: string | null;
					thumbnail_url?: string | null;
					title?: string;
					type?: string | null;
					updated_at?: string;
					view_count?: number | null;
				};
				Relationships: [];
			};
			uploads: {
				Row: {
					created_at: string | null;
					filename: string;
					id: string;
					path: string;
					size: number;
					type: string;
					uploaded_by: string | null;
					url: string;
				};
				Insert: {
					created_at?: string | null;
					filename: string;
					id?: string;
					path: string;
					size: number;
					type: string;
					uploaded_by?: string | null;
					url: string;
				};
				Update: {
					created_at?: string | null;
					filename?: string;
					id?: string;
					path?: string;
					size?: number;
					type?: string;
					uploaded_by?: string | null;
					url?: string;
				};
				Relationships: [];
			};
			user_test_responses: {
				Row: {
					completed_at: string | null;
					completion_time_seconds: number | null;
					created_at: string | null;
					created_date: string | null;
					device_type: string | null;
					id: string;
					ip_address: unknown | null;
					referrer: string | null;
					responses: Json;
					result_id: string | null;
					session_id: string;
					started_at: string | null;
					test_id: string | null;
					total_score: number | null;
					user_agent: string | null;
					user_id: string | null;
				};
				Insert: {
					completed_at?: string | null;
					completion_time_seconds?: number | null;
					created_at?: string | null;
					created_date?: string | null;
					device_type?: string | null;
					id?: string;
					ip_address?: unknown | null;
					referrer?: string | null;
					responses: Json;
					result_id?: string | null;
					session_id: string;
					started_at?: string | null;
					test_id?: string | null;
					total_score?: number | null;
					user_agent?: string | null;
					user_id?: string | null;
				};
				Update: {
					completed_at?: string | null;
					completion_time_seconds?: number | null;
					created_at?: string | null;
					created_date?: string | null;
					device_type?: string | null;
					id?: string;
					ip_address?: unknown | null;
					referrer?: string | null;
					responses?: Json;
					result_id?: string | null;
					session_id?: string;
					started_at?: string | null;
					test_id?: string | null;
					total_score?: number | null;
					user_agent?: string | null;
					user_id?: string | null;
				};
				Relationships: [
					{
						foreignKeyName: 'user_test_responses_result_id_fkey';
						columns: ['result_id'];
						isOneToOne: false;
						referencedRelation: 'test_results';
						referencedColumns: ['id'];
					},
					{
						foreignKeyName: 'user_test_responses_test_id_fkey';
						columns: ['test_id'];
						isOneToOne: false;
						referencedRelation: 'tests';
						referencedColumns: ['id'];
					}
				];
			};
		};
		Views: {
			[_ in never]: never;
		};
		Functions: {
			create_test_complete: {
				Args: { questions_data: Json; results_data: Json; test_data: Json };
				Returns: Json;
			};
			delete_test_complete: {
				Args: { test_uuid: string };
				Returns: boolean;
			};
			duplicate_test: {
				Args: {
					new_slug?: string;
					new_title?: string;
					source_test_uuid: string;
				};
				Returns: Json;
			};
			get_popular_tests: {
				Args: { limit_count?: number };
				Returns: {
					id: string;
					response_count: number;
					slug: string;
					thumbnail_url: string;
					title: string;
					type: string;
					view_count: number;
				}[];
			};
			get_test_by_slug: {
				Args: { test_slug: string };
				Returns: Json;
			};
			get_test_complete_optimized: {
				Args: { test_uuid: string };
				Returns: Json;
			};
			get_test_stats: {
				Args: { test_uuid: string };
				Returns: Json;
			};
			get_test_with_details: {
				Args: { test_id_param: string };
				Returns: Json;
			};
			get_tests_by_category: {
				Args: { category_uuid: string; limit_count?: number };
				Returns: {
					description: string;
					estimated_time: number;
					id: string;
					response_count: number;
					slug: string;
					thumbnail_url: string;
					title: string;
					type: string;
					view_count: number;
				}[];
			};
			get_tests_list: {
				Args: {
					limit_count?: number;
					offset_count?: number;
					status_filter?: string;
				};
				Returns: {
					category_names: string[];
					created_at: string;
					description: string;
					estimated_time: number;
					id: string;
					published_at: string;
					response_count: number;
					slug: string;
					status: string;
					thumbnail_url: string;
					title: string;
					type: string;
					view_count: number;
				}[];
			};
			get_tests_list_with_categories: {
				Args: {
					category_filter?: string;
					limit_count?: number;
					offset_count?: number;
					status_filter?: string;
				};
				Returns: {
					categories: Json;
					created_at: string;
					description: string;
					estimated_time: number;
					id: string;
					published_at: string;
					question_count: number;
					response_count: number;
					result_count: number;
					slug: string;
					status: string;
					thumbnail_url: string;
					title: string;
					type: string;
					view_count: number;
				}[];
			};
			increment_test_response: {
				Args: { test_uuid: string };
				Returns: undefined;
			};
			increment_test_view: {
				Args: { test_uuid: string };
				Returns: undefined;
			};
			save_complete_test: {
				Args: { questions_data: Json; results_data: Json; test_data: Json };
				Returns: Json;
			};
			save_test_complete: {
				Args: {
					questions_data: Json;
					results_data: Json;
					test_data: Json;
					test_uuid: string;
				};
				Returns: Json;
			};
			search_tests: {
				Args: { limit_count?: number; search_query: string };
				Returns: {
					description: string;
					id: string;
					match_score: number;
					slug: string;
					thumbnail_url: string;
					title: string;
					type: string;
				}[];
			};
			update_test_basic: {
				Args: { test_data: Json; test_uuid: string };
				Returns: Json;
			};
			update_test_status: {
				Args: { new_status: string; test_uuid: string };
				Returns: Json;
			};
			// Analytics RPC functions
			get_dashboard_overview_stats: {
				Args: Record<PropertyKey, never>;
				Returns: {
					total: number;
					published: number;
					draft: number;
					scheduled: number;
					totalResponses: number;
					totalCompletions: number;
					completionRate: number;
					avgCompletionTime: number;
					anomalies: number;
				};
			};
			get_test_detailed_stats: {
				Args: { test_uuid: string };
				Returns: {
					test_id: string;
					test_title: string;
					total_responses: number;
					total_views: number;
					completion_rate: number;
					average_score: number;
					average_completion_time: number;
					device_breakdown: {
						mobile: number;
						desktop: number;
						tablet: number;
					};
					recent_responses: number;
					popular_results: Array<{
						result_name: string;
						count: number;
						percentage: number;
					}>;
					response_trend: Array<{
						date: string;
						count: number;
					}>;
				};
			};
			get_test_basic_stats: {
				Args: { test_uuid: string };
				Returns: {
					responses: number;
					completions: number;
					completionRate: number;
					avgTime: number;
					avgScore: number;
					deviceBreakdown: {
						mobile: number;
						desktop: number;
						tablet: number;
					};
				};
			};
			get_responses_chart_data: {
				Args: { test_uuid: string; days?: number };
				Returns: Array<{
					date: string;
					responses: number;
					completions: number;
				}>;
			};
			get_user_responses_stats: {
				Args: { test_uuid: string };
				Returns: {
					total_responses: number;
					unique_users: number;
					completion_rate: number;
					avg_completion_time: number;
					device_breakdown: {
						mobile: number;
						desktop: number;
						tablet: number;
					};
				};
			};
			export_user_responses: {
				Args: { test_uuid: string; limit_count?: number; offset_count?: number };
				Returns: Array<{
					id: string;
					user_id: string | null;
					test_id: string | null;
					result_id: string | null;
					responses: Json;
					score: number | null;
					started_at: string | null;
					completed_at: string | null;
					completion_time_seconds: number | null;
					ip_address: string | null;
					user_agent: string | null;
					referrer: string | null;
					device_type: string | null;
					created_at: string | null;
				}>;
			};
			get_test_analytics_data: {
				Args: { test_uuid: string; days?: number };
				Returns: {
					overview: {
						total_responses: number;
						total_views: number;
						completion_rate: number;
						avg_completion_time: number;
						avg_score: number;
					};
					trends: Array<{
						date: string;
						responses: number;
						completions: number;
					}>;
					device_breakdown: {
						mobile: number;
						desktop: number;
						tablet: number;
					};
					popular_results: Array<{
						result_name: string;
						count: number;
						percentage: number;
					}>;
				};
			};
			// Marketing RPC functions
			get_marketing_funnel: {
				Args: { from_date: string; to_date: string; source?: string; medium?: string; campaign?: string };
				Returns: {
					visits: number;
					test_starts: number;
					test_completes: number;
					sign_ups: number;
					start_rate: number;
					complete_rate: number;
					sign_up_rate: number;
				};
			};
			get_channel_performance: {
				Args: { from_date: string; to_date: string };
				Returns: Array<{
					source: string;
					medium: string;
					campaign: string;
					sessions: number;
					start_rate: number;
					complete_rate: number;
					sign_up_rate: number;
					avg_dwell_time: number;
					avg_question_depth: number;
					share_rate: number;
				}>;
			};
			get_landing_performance: {
				Args: { from_date: string; to_date: string };
				Returns: Array<{
					url: string;
					sessions: number;
					bounce_rate: number;
					start_rate: number;
					complete_rate: number;
					avg_dwell_time: number;
					conversion_value: number;
				}>;
			};
			get_cohort_analysis: {
				Args: { from_date: string; to_date: string };
				Returns: Array<{
					cohort: string;
					users: number;
					retention_1d: number;
					retention_7d: number;
					retention_30d: number;
					ltv: number;
				}>;
			};
			get_marketing_insights: {
				Args: { from_date: string; to_date: string };
				Returns: {
					top_performing_channel: string;
					best_converting_landing: string;
					highest_ltv_cohort: string;
					recommendations: string[];
					anomalies: Array<{
						metric: string;
						change: number;
						description: string;
					}>;
				};
			};
			export_marketing_data: {
				Args: { from_date: string; to_date: string; format?: string };
				Returns: Json;
			};
			get_utm_sources: {
				Args: Record<PropertyKey, never>;
				Returns: Array<{ source: string; count: number }>;
			};
			get_utm_mediums: {
				Args: Record<PropertyKey, never>;
				Returns: Array<{ medium: string; count: number }>;
			};
			get_utm_campaigns: {
				Args: Record<PropertyKey, never>;
				Returns: Array<{ campaign: string; count: number }>;
			};
			get_devices: {
				Args: Record<PropertyKey, never>;
				Returns: Array<{ device: string; count: number }>;
			};
			get_regions: {
				Args: Record<PropertyKey, never>;
				Returns: Array<{ region: string; count: number }>;
			};
		};
		Enums: {
			[_ in never]: never;
		};
		CompositeTypes: {
			[_ in never]: never;
		};
	};
};

type DatabaseWithoutInternals = Omit<Database, '__InternalSupabase'>;

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, 'public'>];

export type Tables<
	DefaultSchemaTableNameOrOptions extends
		| keyof (DefaultSchema['Tables'] & DefaultSchema['Views'])
		| { schema: keyof DatabaseWithoutInternals },
	TableName extends DefaultSchemaTableNameOrOptions extends {
		schema: keyof DatabaseWithoutInternals;
	}
		? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
				DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Views'])
		: never = never
> = DefaultSchemaTableNameOrOptions extends {
	schema: keyof DatabaseWithoutInternals;
}
	? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
			DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Views'])[TableName] extends {
			Row: infer R;
	  }
		? R
		: never
	: DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema['Tables'] & DefaultSchema['Views'])
	? (DefaultSchema['Tables'] & DefaultSchema['Views'])[DefaultSchemaTableNameOrOptions] extends {
			Row: infer R;
	  }
		? R
		: never
	: never;

export type TablesInsert<
	DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables'] | { schema: keyof DatabaseWithoutInternals },
	TableName extends DefaultSchemaTableNameOrOptions extends {
		schema: keyof DatabaseWithoutInternals;
	}
		? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables']
		: never = never
> = DefaultSchemaTableNameOrOptions extends {
	schema: keyof DatabaseWithoutInternals;
}
	? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
			Insert: infer I;
	  }
		? I
		: never
	: DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
	? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
			Insert: infer I;
	  }
		? I
		: never
	: never;

export type TablesUpdate<
	DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables'] | { schema: keyof DatabaseWithoutInternals },
	TableName extends DefaultSchemaTableNameOrOptions extends {
		schema: keyof DatabaseWithoutInternals;
	}
		? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables']
		: never = never
> = DefaultSchemaTableNameOrOptions extends {
	schema: keyof DatabaseWithoutInternals;
}
	? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
			Update: infer U;
	  }
		? U
		: never
	: DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
	? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
			Update: infer U;
	  }
		? U
		: never
	: never;

export type Enums<
	DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema['Enums'] | { schema: keyof DatabaseWithoutInternals },
	EnumName extends DefaultSchemaEnumNameOrOptions extends {
		schema: keyof DatabaseWithoutInternals;
	}
		? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions['schema']]['Enums']
		: never = never
> = DefaultSchemaEnumNameOrOptions extends {
	schema: keyof DatabaseWithoutInternals;
}
	? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions['schema']]['Enums'][EnumName]
	: DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema['Enums']
	? DefaultSchema['Enums'][DefaultSchemaEnumNameOrOptions]
	: never;

export type CompositeTypes<
	PublicCompositeTypeNameOrOptions extends
		| keyof DefaultSchema['CompositeTypes']
		| { schema: keyof DatabaseWithoutInternals },
	CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
		schema: keyof DatabaseWithoutInternals;
	}
		? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes']
		: never = never
> = PublicCompositeTypeNameOrOptions extends {
	schema: keyof DatabaseWithoutInternals;
}
	? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes'][CompositeTypeName]
	: PublicCompositeTypeNameOrOptions extends keyof DefaultSchema['CompositeTypes']
	? DefaultSchema['CompositeTypes'][PublicCompositeTypeNameOrOptions]
	: never;

export const Constants = {
	public: {
		Enums: {},
	},
} as const;

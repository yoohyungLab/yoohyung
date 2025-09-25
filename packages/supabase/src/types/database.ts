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
					},
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
					},
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
					},
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
					},
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
		: never = never,
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
		: never = never,
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
		: never = never,
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
		: never = never,
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
		: never = never,
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

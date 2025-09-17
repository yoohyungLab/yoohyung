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
                    id: string;
                    username: string;
                    password_hash: string;
                    email: string | null;
                    name: string;
                    role: string | null;
                    is_active: boolean | null;
                    last_login: string | null;
                    created_at: string | null;
                    updated_at: string | null;
                };
                Insert: {
                    id?: string;
                    username: string;
                    password_hash: string;
                    email?: string | null;
                    name: string;
                    role?: string | null;
                    is_active?: boolean | null;
                    last_login?: string | null;
                    created_at?: string | null;
                    updated_at?: string | null;
                };
                Update: {
                    id?: string;
                    username?: string;
                    password_hash?: string;
                    email?: string | null;
                    name?: string;
                    role?: string | null;
                    is_active?: boolean | null;
                    last_login?: string | null;
                    created_at?: string | null;
                    updated_at?: string | null;
                };
                Relationships: [];
            };
            categories: {
                Row: {
                    id: string;
                    name: string;
                    slug: string;
                    description: string | null;
                    sort_order: number | null;
                    is_active: boolean | null;
                    created_at: string;
                    updated_at: string;
                    icon_url: string | null;
                    banner_url: string | null;
                    thumbnail_url: string | null;
                };
                Insert: {
                    id?: string;
                    name: string;
                    slug: string;
                    description?: string | null;
                    sort_order?: number | null;
                    is_active?: boolean | null;
                    created_at?: string;
                    updated_at?: string;
                    icon_url?: string | null;
                    banner_url?: string | null;
                    thumbnail_url?: string | null;
                };
                Update: {
                    id?: string;
                    name?: string;
                    slug?: string;
                    description?: string | null;
                    sort_order?: number | null;
                    is_active?: boolean | null;
                    created_at?: string;
                    updated_at?: string;
                    icon_url?: string | null;
                    banner_url?: string | null;
                    thumbnail_url?: string | null;
                };
                Relationships: [];
            };
            favorites: {
                Row: {
                    id: string;
                    created_at: string;
                    content_id: string | null;
                    user_id: string | null;
                };
                Insert: {
                    id?: string;
                    created_at?: string;
                    content_id?: string | null;
                    user_id?: string | null;
                };
                Update: {
                    id?: string;
                    created_at?: string;
                    content_id?: string | null;
                    user_id?: string | null;
                };
                Relationships: [];
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
                    attached_file_url: string | null;
                    admin_reply: string | null;
                    admin_reply_at: string | null;
                    views: number | null;
                    created_at: string;
                    updated_at: string;
                };
                Insert: {
                    id?: string;
                    title: string;
                    content: string;
                    category?: string;
                    status?: string;
                    author_name?: string | null;
                    author_email?: string | null;
                    attached_file_url?: string | null;
                    admin_reply?: string | null;
                    admin_reply_at?: string | null;
                    views?: number | null;
                    created_at?: string;
                    updated_at?: string;
                };
                Update: {
                    id?: string;
                    title?: string;
                    content?: string;
                    category?: string;
                    status?: string;
                    author_name?: string | null;
                    author_email?: string | null;
                    attached_file_url?: string | null;
                    admin_reply?: string | null;
                    admin_reply_at?: string | null;
                    views?: number | null;
                    created_at?: string;
                    updated_at?: string;
                };
                Relationships: [];
            };
            profiles: {
                Row: {
                    id: string;
                    email: string | null;
                    name: string | null;
                    avatar_url: string | null;
                    provider: string | null;
                    created_at: string | null;
                    updated_at: string | null;
                    status: string | null;
                };
                Insert: {
                    id: string;
                    email?: string | null;
                    name?: string | null;
                    avatar_url?: string | null;
                    provider?: string | null;
                    created_at?: string | null;
                    updated_at?: string | null;
                    status?: string | null;
                };
                Update: {
                    id?: string;
                    email?: string | null;
                    name?: string | null;
                    avatar_url?: string | null;
                    provider?: string | null;
                    created_at?: string | null;
                    updated_at?: string | null;
                    status?: string | null;
                };
                Relationships: [];
            };
            test_choices: {
                Row: {
                    id: string;
                    question_id: string | null;
                    choice_text: string;
                    choice_order: number;
                    score: number | null;
                    is_correct: boolean | null;
                    created_at: string | null;
                };
                Insert: {
                    id?: string;
                    question_id?: string | null;
                    choice_text: string;
                    choice_order: number;
                    score?: number | null;
                    is_correct?: boolean | null;
                    created_at?: string | null;
                };
                Update: {
                    id?: string;
                    question_id?: string | null;
                    choice_text?: string;
                    choice_order?: number;
                    score?: number | null;
                    is_correct?: boolean | null;
                    created_at?: string | null;
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
                    id: string;
                    test_id: string | null;
                    question_text: string;
                    question_order: number;
                    image_url: string | null;
                    created_at: string | null;
                    updated_at: string | null;
                };
                Insert: {
                    id?: string;
                    test_id?: string | null;
                    question_text: string;
                    question_order: number;
                    image_url?: string | null;
                    created_at?: string | null;
                    updated_at?: string | null;
                };
                Update: {
                    id?: string;
                    test_id?: string | null;
                    question_text?: string;
                    question_order?: number;
                    image_url?: string | null;
                    created_at?: string | null;
                    updated_at?: string | null;
                };
                Relationships: [
                    {
                        foreignKeyName: 'test_questions_test_id_fkey';
                        columns: ['test_id'];
                        isOneToOne: false;
                        referencedRelation: 'test_statistics';
                        referencedColumns: ['id'];
                    },
                    {
                        foreignKeyName: 'test_questions_test_id_fkey';
                        columns: ['test_id'];
                        isOneToOne: false;
                        referencedRelation: 'tests';
                        referencedColumns: ['id'];
                    },
                    {
                        foreignKeyName: 'test_questions_test_id_fkey';
                        columns: ['test_id'];
                        isOneToOne: false;
                        referencedRelation: 'tests_list';
                        referencedColumns: ['id'];
                    }
                ];
            };
            test_results: {
                Row: {
                    id: string;
                    test_id: string | null;
                    result_name: string;
                    result_order: number;
                    description: string | null;
                    match_conditions: Json | null;
                    background_image_url: string | null;
                    theme_color: string | null;
                    created_at: string | null;
                    updated_at: string | null;
                    features: Json;
                };
                Insert: {
                    id?: string;
                    test_id?: string | null;
                    result_name: string;
                    result_order: number;
                    description?: string | null;
                    match_conditions?: Json | null;
                    background_image_url?: string | null;
                    theme_color?: string | null;
                    created_at?: string | null;
                    updated_at?: string | null;
                    features: Json;
                };
                Update: {
                    id?: string;
                    test_id?: string | null;
                    result_name?: string;
                    result_order?: number;
                    description?: string | null;
                    match_conditions?: Json | null;
                    background_image_url?: string | null;
                    theme_color?: string | null;
                    created_at?: string | null;
                    updated_at?: string | null;
                    features?: Json;
                };
                Relationships: [
                    {
                        foreignKeyName: 'test_results_test_id_fkey';
                        columns: ['test_id'];
                        isOneToOne: false;
                        referencedRelation: 'test_statistics';
                        referencedColumns: ['id'];
                    },
                    {
                        foreignKeyName: 'test_results_test_id_fkey';
                        columns: ['test_id'];
                        isOneToOne: false;
                        referencedRelation: 'tests';
                        referencedColumns: ['id'];
                    },
                    {
                        foreignKeyName: 'test_results_test_id_fkey';
                        columns: ['test_id'];
                        isOneToOne: false;
                        referencedRelation: 'tests_list';
                        referencedColumns: ['id'];
                    }
                ];
            };
            tests: {
                Row: {
                    id: string;
                    title: string;
                    description: string | null;
                    slug: string;
                    thumbnail_url: string | null;
                    response_count: number | null;
                    view_count: number | null;
                    category_ids: string[] | null;
                    short_code: string | null;
                    intro_text: string | null;
                    status: string | null;
                    estimated_time: number | null;
                    scheduled_at: string | null;
                    max_score: number | null;
                    type: string | null;
                    published_at: string | null;
                    created_at: string;
                    updated_at: string;
                };
                Insert: {
                    id?: string;
                    title: string;
                    description?: string | null;
                    slug: string;
                    thumbnail_url?: string | null;
                    response_count?: number | null;
                    view_count?: number | null;
                    category_ids?: string[] | null;
                    short_code?: string | null;
                    intro_text?: string | null;
                    status?: string | null;
                    estimated_time?: number | null;
                    scheduled_at?: string | null;
                    max_score?: number | null;
                    type?: string | null;
                    published_at?: string | null;
                    created_at?: string;
                    updated_at?: string;
                };
                Update: {
                    id?: string;
                    title?: string;
                    description?: string | null;
                    slug?: string;
                    thumbnail_url?: string | null;
                    response_count?: number | null;
                    view_count?: number | null;
                    category_ids?: string[] | null;
                    short_code?: string | null;
                    intro_text?: string | null;
                    status?: string | null;
                    estimated_time?: number | null;
                    scheduled_at?: string | null;
                    max_score?: number | null;
                    type?: string | null;
                    published_at?: string | null;
                    created_at?: string;
                    updated_at?: string;
                };
                Relationships: [
                    {
                        foreignKeyName: 'tests_category_id_fkey';
                        columns: ['category_id'];
                        isOneToOne: false;
                        referencedRelation: 'categories';
                        referencedColumns: ['id'];
                    }
                ];
            };
            uploads: {
                Row: {
                    id: string;
                    filename: string;
                    path: string;
                    url: string;
                    size: number;
                    type: string;
                    uploaded_by: string | null;
                    created_at: string | null;
                };
                Insert: {
                    id?: string;
                    filename: string;
                    path: string;
                    url: string;
                    size: number;
                    type: string;
                    uploaded_by?: string | null;
                    created_at?: string | null;
                };
                Update: {
                    id?: string;
                    filename?: string;
                    path?: string;
                    url?: string;
                    size?: number;
                    type?: string;
                    uploaded_by?: string | null;
                    created_at?: string | null;
                };
                Relationships: [];
            };
            user_test_responses: {
                Row: {
                    id: string;
                    test_id: string | null;
                    user_id: string | null;
                    session_id: string;
                    total_score: number | null;
                    result_id: string | null;
                    started_at: string | null;
                    completed_at: string | null;
                    completion_time_seconds: number | null;
                    ip_address: unknown | null;
                    user_agent: string | null;
                    referrer: string | null;
                    device_type: string | null;
                    responses: Json;
                    created_date: string | null;
                    created_at: string | null;
                };
                Insert: {
                    id?: string;
                    test_id?: string | null;
                    user_id?: string | null;
                    session_id: string;
                    total_score?: number | null;
                    result_id?: string | null;
                    started_at?: string | null;
                    completed_at?: string | null;
                    completion_time_seconds?: number | null;
                    ip_address?: unknown | null;
                    user_agent?: string | null;
                    referrer?: string | null;
                    device_type?: string | null;
                    responses: Json;
                    created_date?: string | null;
                    created_at?: string | null;
                };
                Update: {
                    id?: string;
                    test_id?: string | null;
                    user_id?: string | null;
                    session_id?: string;
                    total_score?: number | null;
                    result_id?: string | null;
                    started_at?: string | null;
                    completed_at?: string | null;
                    completion_time_seconds?: number | null;
                    ip_address?: unknown | null;
                    user_agent?: string | null;
                    referrer?: string | null;
                    device_type?: string | null;
                    responses?: Json;
                    created_date?: string | null;
                    created_at?: string | null;
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
                        referencedRelation: 'test_statistics';
                        referencedColumns: ['id'];
                    },
                    {
                        foreignKeyName: 'user_test_responses_test_id_fkey';
                        columns: ['test_id'];
                        isOneToOne: false;
                        referencedRelation: 'tests';
                        referencedColumns: ['id'];
                    },
                    {
                        foreignKeyName: 'user_test_responses_test_id_fkey';
                        columns: ['test_id'];
                        isOneToOne: false;
                        referencedRelation: 'tests_list';
                        referencedColumns: ['id'];
                    }
                ];
            };
        };
        Views: {
            test_statistics: {
                Row: {
                    avg_completion_time: number | null;
                    completion_count: number | null;
                    completion_rate: number | null;
                    id: string | null;
                    response_count: number | null;
                    status: string | null;
                    title: string | null;
                };
                Relationships: [];
            };
            tests_list: {
                Row: {
                    category_name: string | null;
                    completion_count: number | null;
                    created_at: string | null;
                    description: string | null;
                    estimated_time: number | null;
                    id: string | null;
                    question_count: number | null;
                    result_count: number | null;
                    slug: string | null;
                    status: string | null;
                    thumbnail_url: string | null;
                    title: string | null;
                    type: string | null;
                    view_count: number | null;
                };
                Relationships: [];
            };
        };
        Functions: {
            bulk_update_profiles_status: {
                Args: { new_status: string; profile_ids: string[] };
                Returns: Json;
            };
            create_test_profiles: {
                Args: { count_num?: number };
                Returns: string;
            };
            get_dashboard_stats: {
                Args: Record<PropertyKey, never>;
                Returns: {
                    most_popular_category: string;
                    published_tests: number;
                    total_categories: number;
                    total_responses: number;
                    total_tests: number;
                }[];
            };
            get_profile_details: {
                Args: { profile_id: string };
                Returns: Json;
            };
            get_profiles_stats: {
                Args: Record<PropertyKey, never>;
                Returns: Json;
            };
            search_profiles: {
                Args: {
                    page_num?: number;
                    page_size?: number;
                    provider_filter?: string;
                    search_term?: string;
                    status_filter?: string;
                };
                Returns: {
                    profiles: Json;
                    total_count: number;
                }[];
            };
            update_profile_status: {
                Args: { new_status: string; profile_id: string };
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
    PublicCompositeTypeNameOrOptions extends keyof DefaultSchema['CompositeTypes'] | { schema: keyof DatabaseWithoutInternals },
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

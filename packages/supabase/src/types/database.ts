export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      admin_users: {
        Row: {
          created_at: string | null
          email: string | null
          id: string
          is_active: boolean | null
          last_login: string | null
          name: string
          password_hash: string
          role: string | null
          updated_at: string | null
          username: string
        }
        Insert: {
          created_at?: string | null
          email?: string | null
          id?: string
          is_active?: boolean | null
          last_login?: string | null
          name: string
          password_hash: string
          role?: string | null
          updated_at?: string | null
          username: string
        }
        Update: {
          created_at?: string | null
          email?: string | null
          id?: string
          is_active?: boolean | null
          last_login?: string | null
          name?: string
          password_hash?: string
          role?: string | null
          updated_at?: string | null
          username?: string
        }
        Relationships: []
      }
      categories: {
        Row: {
          banner_url: string | null
          created_at: string
          description: string | null
          icon_url: string | null
          id: string
          is_active: boolean | null
          name: string
          slug: string
          sort_order: number | null
          thumbnail_url: string | null
          updated_at: string
        }
        Insert: {
          banner_url?: string | null
          created_at?: string
          description?: string | null
          icon_url?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          slug: string
          sort_order?: number | null
          thumbnail_url?: string | null
          updated_at?: string
        }
        Update: {
          banner_url?: string | null
          created_at?: string
          description?: string | null
          icon_url?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          slug?: string
          sort_order?: number | null
          thumbnail_url?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      favorites: {
        Row: {
          content_id: string | null
          created_at: string
          id: string
          user_id: string | null
        }
        Insert: {
          content_id?: string | null
          created_at?: string
          id?: string
          user_id?: string | null
        }
        Update: {
          content_id?: string | null
          created_at?: string
          id?: string
          user_id?: string | null
        }
        Relationships: []
      }
      feedbacks: {
        Row: {
          admin_reply: string | null
          admin_reply_at: string | null
          attached_file_url: string | null
          author_email: string | null
          author_name: string | null
          category: string
          content: string
          created_at: string
          id: string
          status: string
          title: string
          updated_at: string
          views: number | null
        }
        Insert: {
          admin_reply?: string | null
          admin_reply_at?: string | null
          attached_file_url?: string | null
          author_email?: string | null
          author_name?: string | null
          category?: string
          content: string
          created_at?: string
          id?: string
          status?: string
          title: string
          updated_at?: string
          views?: number | null
        }
        Update: {
          admin_reply?: string | null
          admin_reply_at?: string | null
          attached_file_url?: string | null
          author_email?: string | null
          author_name?: string | null
          category?: string
          content?: string
          created_at?: string
          id?: string
          status?: string
          title?: string
          updated_at?: string
          views?: number | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          email: string | null
          id: string
          name: string | null
          provider: string | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          email?: string | null
          id: string
          name?: string | null
          provider?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          email?: string | null
          id?: string
          name?: string | null
          provider?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      test_choices: {
        Row: {
          choice_order: number
          choice_text: string
          created_at: string | null
          id: string
          image_url: string | null
          is_correct: boolean | null
          question_id: string | null
          result_mapping: Json | null
          score: number | null
        }
        Insert: {
          choice_order: number
          choice_text: string
          created_at?: string | null
          id?: string
          image_url?: string | null
          is_correct?: boolean | null
          question_id?: string | null
          result_mapping?: Json | null
          score?: number | null
        }
        Update: {
          choice_order?: number
          choice_text?: string
          created_at?: string | null
          id?: string
          image_url?: string | null
          is_correct?: boolean | null
          question_id?: string | null
          result_mapping?: Json | null
          score?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "test_choices_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "test_questions"
            referencedColumns: ["id"]
          },
        ]
      }
      test_questions: {
        Row: {
          created_at: string | null
          id: string
          image_url: string | null
          question_group: string | null
          question_order: number
          question_text: string
          required: boolean | null
          settings: Json | null
          test_id: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          image_url?: string | null
          question_group?: string | null
          question_order: number
          question_text: string
          required?: boolean | null
          settings?: Json | null
          test_id?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          image_url?: string | null
          question_group?: string | null
          question_order?: number
          question_text?: string
          required?: boolean | null
          settings?: Json | null
          test_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "test_questions_test_id_fkey"
            columns: ["test_id"]
            isOneToOne: false
            referencedRelation: "test_statistics"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "test_questions_test_id_fkey"
            columns: ["test_id"]
            isOneToOne: false
            referencedRelation: "tests"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "test_questions_test_id_fkey"
            columns: ["test_id"]
            isOneToOne: false
            referencedRelation: "tests_list"
            referencedColumns: ["id"]
          },
        ]
      }
      test_results: {
        Row: {
          background_image_url: string | null
          created_at: string | null
          description: string | null
          emoji: string | null
          features: string[] | null
          id: string
          jobs: string[] | null
          keywords: string[] | null
          match_conditions: Json | null
          meta_description: string | null
          percentage: number | null
          result_name: string
          result_order: number
          share_image_url: string | null
          test_id: string | null
          theme_color: string | null
          updated_at: string | null
        }
        Insert: {
          background_image_url?: string | null
          created_at?: string | null
          description?: string | null
          emoji?: string | null
          features?: string[] | null
          id?: string
          jobs?: string[] | null
          keywords?: string[] | null
          match_conditions?: Json | null
          meta_description?: string | null
          percentage?: number | null
          result_name: string
          result_order: number
          share_image_url?: string | null
          test_id?: string | null
          theme_color?: string | null
          updated_at?: string | null
        }
        Update: {
          background_image_url?: string | null
          created_at?: string | null
          description?: string | null
          emoji?: string | null
          features?: string[] | null
          id?: string
          jobs?: string[] | null
          keywords?: string[] | null
          match_conditions?: Json | null
          meta_description?: string | null
          percentage?: number | null
          result_name?: string
          result_order?: number
          share_image_url?: string | null
          test_id?: string | null
          theme_color?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "test_results_test_id_fkey"
            columns: ["test_id"]
            isOneToOne: false
            referencedRelation: "test_statistics"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "test_results_test_id_fkey"
            columns: ["test_id"]
            isOneToOne: false
            referencedRelation: "tests"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "test_results_test_id_fkey"
            columns: ["test_id"]
            isOneToOne: false
            referencedRelation: "tests_list"
            referencedColumns: ["id"]
          },
        ]
      }
      tests: {
        Row: {
          author_id: string | null
          banner_image_url: string | null
          category_id: string | null
          completion_count: number | null
          created_at: string
          description: string | null
          estimated_time: number | null
          id: string
          intro_text: string | null
          max_score: number | null
          og_image_url: string | null
          response_count: number | null
          scheduled_at: string | null
          share_count: number | null
          slug: string
          status: string | null
          tags: string[] | null
          thumbnail_url: string | null
          title: string
          type: string | null
          updated_at: string
          view_count: number | null
        }
        Insert: {
          author_id?: string | null
          banner_image_url?: string | null
          category_id?: string | null
          completion_count?: number | null
          created_at?: string
          description?: string | null
          estimated_time?: number | null
          id?: string
          intro_text?: string | null
          max_score?: number | null
          og_image_url?: string | null
          response_count?: number | null
          scheduled_at?: string | null
          share_count?: number | null
          slug: string
          status?: string | null
          tags?: string[] | null
          thumbnail_url?: string | null
          title: string
          type?: string | null
          updated_at?: string
          view_count?: number | null
        }
        Update: {
          author_id?: string | null
          banner_image_url?: string | null
          category_id?: string | null
          completion_count?: number | null
          created_at?: string
          description?: string | null
          estimated_time?: number | null
          id?: string
          intro_text?: string | null
          max_score?: number | null
          og_image_url?: string | null
          response_count?: number | null
          scheduled_at?: string | null
          share_count?: number | null
          slug?: string
          status?: string | null
          tags?: string[] | null
          thumbnail_url?: string | null
          title?: string
          type?: string | null
          updated_at?: string
          view_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "tests_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      user_test_responses: {
        Row: {
          completed_at: string | null
          completion_time_seconds: number | null
          created_date: string | null
          device_type: string | null
          id: string
          ip_address: unknown | null
          referrer: string | null
          responses: Json
          result_id: string | null
          session_id: string
          started_at: string | null
          test_id: string | null
          total_score: number | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          completed_at?: string | null
          completion_time_seconds?: number | null
          created_date?: string | null
          device_type?: string | null
          id?: string
          ip_address?: unknown | null
          referrer?: string | null
          responses: Json
          result_id?: string | null
          session_id: string
          started_at?: string | null
          test_id?: string | null
          total_score?: number | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          completed_at?: string | null
          completion_time_seconds?: number | null
          created_date?: string | null
          device_type?: string | null
          id?: string
          ip_address?: unknown | null
          referrer?: string | null
          responses?: Json
          result_id?: string | null
          session_id?: string
          started_at?: string | null
          test_id?: string | null
          total_score?: number | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_test_responses_result_id_fkey"
            columns: ["result_id"]
            isOneToOne: false
            referencedRelation: "test_results"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_test_responses_test_id_fkey"
            columns: ["test_id"]
            isOneToOne: false
            referencedRelation: "test_statistics"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_test_responses_test_id_fkey"
            columns: ["test_id"]
            isOneToOne: false
            referencedRelation: "tests"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_test_responses_test_id_fkey"
            columns: ["test_id"]
            isOneToOne: false
            referencedRelation: "tests_list"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      test_statistics: {
        Row: {
          avg_completion_time: number | null
          completion_count: number | null
          completion_rate: number | null
          id: string | null
          response_count: number | null
          status: string | null
          title: string | null
        }
        Relationships: []
      }
      tests_list: {
        Row: {
          category_name: string | null
          completion_count: number | null
          created_at: string | null
          description: string | null
          estimated_time: number | null
          id: string | null
          question_count: number | null
          result_count: number | null
          slug: string | null
          status: string | null
          thumbnail_url: string | null
          title: string | null
          type: string | null
          view_count: number | null
        }
        Relationships: []
      }
    }
    Functions: {
      bulk_update_profiles_status: {
        Args: { new_status: string; profile_ids: string[] }
        Returns: Json
      }
      create_test_profiles: {
        Args: { count_num?: number }
        Returns: string
      }
      get_dashboard_stats: {
        Args: Record<PropertyKey, never>
        Returns: {
          most_popular_category: string
          published_tests: number
          total_categories: number
          total_responses: number
          total_tests: number
        }[]
      }
      get_profile_details: {
        Args: { profile_id: string }
        Returns: Json
      }
      get_profiles_stats: {
        Args: Record<PropertyKey, never>
        Returns: Json
      }
      search_profiles: {
        Args: {
          page_num?: number
          page_size?: number
          provider_filter?: string
          search_term?: string
          status_filter?: string
        }
        Returns: {
          profiles: Json
          total_count: number
        }[]
      }
      update_profile_status: {
        Args: { new_status: string; profile_id: string }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const

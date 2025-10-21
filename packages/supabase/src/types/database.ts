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
          name: string
          password_hash: string
          updated_at: string | null
          username: string
        }
        Insert: {
          created_at?: string | null
          email?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          password_hash: string
          updated_at?: string | null
          username: string
        }
        Update: {
          created_at?: string | null
          email?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          password_hash?: string
          updated_at?: string | null
          username?: string
        }
        Relationships: []
      }
      categories: {
        Row: {
          created_at: string
          id: string
          name: string
          slug: string
          sort_order: number | null
          status: Database["public"]["Enums"]["category_status"]
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          slug: string
          sort_order?: number | null
          status?: Database["public"]["Enums"]["category_status"]
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          slug?: string
          sort_order?: number | null
          status?: Database["public"]["Enums"]["category_status"]
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
        Relationships: [
          {
            foreignKeyName: "favorites_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
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
          category: string
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
      home_balance_games: {
        Row: {
          created_at: string | null
          id: string
          is_active: boolean | null
          option_a_emoji: string
          option_a_label: string
          option_b_emoji: string
          option_b_label: string
          title: string
          total_votes: number | null
          updated_at: string | null
          votes_a: number | null
          votes_b: number | null
          week_number: number
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          option_a_emoji: string
          option_a_label: string
          option_b_emoji: string
          option_b_label: string
          title?: string
          total_votes?: number | null
          updated_at?: string | null
          votes_a?: number | null
          votes_b?: number | null
          week_number: number
        }
        Update: {
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          option_a_emoji?: string
          option_a_label?: string
          option_b_emoji?: string
          option_b_label?: string
          title?: string
          total_votes?: number | null
          updated_at?: string | null
          votes_a?: number | null
          votes_b?: number | null
          week_number?: number
        }
        Relationships: []
      }
      home_balance_votes: {
        Row: {
          choice: string
          created_at: string | null
          game_id: string
          id: string
          session_id: string | null
          user_id: string | null
        }
        Insert: {
          choice: string
          created_at?: string | null
          game_id: string
          id?: string
          session_id?: string | null
          user_id?: string | null
        }
        Update: {
          choice?: string
          created_at?: string | null
          game_id?: string
          id?: string
          session_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "home_balance_votes_game_id_fkey"
            columns: ["game_id"]
            isOneToOne: false
            referencedRelation: "home_balance_games"
            referencedColumns: ["id"]
          },
        ]
      }
      test_choices: {
        Row: {
          choice_order: number
          choice_text: string
          created_at: string | null
          id: string
          is_correct: boolean | null
          last_updated: string | null
          question_id: string | null
          response_count: number | null
          score: number | null
        }
        Insert: {
          choice_order: number
          choice_text: string
          created_at?: string | null
          id?: string
          is_correct?: boolean | null
          last_updated?: string | null
          question_id?: string | null
          response_count?: number | null
          score?: number | null
        }
        Update: {
          choice_order?: number
          choice_text?: string
          created_at?: string | null
          id?: string
          is_correct?: boolean | null
          last_updated?: string | null
          question_id?: string | null
          response_count?: number | null
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
          question_order: number
          question_text: string
          test_id: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          image_url?: string | null
          question_order: number
          question_text: string
          test_id?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          image_url?: string | null
          question_order?: number
          question_text?: string
          test_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "test_questions_test_id_fkey"
            columns: ["test_id"]
            isOneToOne: false
            referencedRelation: "tests"
            referencedColumns: ["id"]
          },
        ]
      }
      test_results: {
        Row: {
          background_image_url: string | null
          created_at: string | null
          description: string | null
          features: Json | null
          id: string
          match_conditions: Json | null
          result_name: string
          result_order: number
          target_gender: string | null
          test_id: string | null
          theme_color: string | null
          updated_at: string | null
        }
        Insert: {
          background_image_url?: string | null
          created_at?: string | null
          description?: string | null
          features?: Json | null
          id?: string
          match_conditions?: Json | null
          result_name: string
          result_order: number
          target_gender?: string | null
          test_id?: string | null
          theme_color?: string | null
          updated_at?: string | null
        }
        Update: {
          background_image_url?: string | null
          created_at?: string | null
          description?: string | null
          features?: Json | null
          id?: string
          match_conditions?: Json | null
          result_name?: string
          result_order?: number
          target_gender?: string | null
          test_id?: string | null
          theme_color?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "test_results_test_id_fkey"
            columns: ["test_id"]
            isOneToOne: false
            referencedRelation: "tests"
            referencedColumns: ["id"]
          },
        ]
      }
      tests: {
        Row: {
          category_ids: string[] | null
          created_at: string
          description: string | null
          estimated_time: number | null
          id: string
          intro_text: string | null
          max_score: number | null
          published_at: string | null
          requires_gender: boolean
          response_count: number | null
          scheduled_at: string | null
          short_code: string | null
          slug: string
          start_count: number | null
          status: string | null
          thumbnail_url: string | null
          title: string
          type: string | null
          updated_at: string
        }
        Insert: {
          category_ids?: string[] | null
          created_at?: string
          description?: string | null
          estimated_time?: number | null
          id?: string
          intro_text?: string | null
          max_score?: number | null
          published_at?: string | null
          requires_gender?: boolean
          response_count?: number | null
          scheduled_at?: string | null
          short_code?: string | null
          slug: string
          start_count?: number | null
          status?: string | null
          thumbnail_url?: string | null
          title: string
          type?: string | null
          updated_at?: string
        }
        Update: {
          category_ids?: string[] | null
          created_at?: string
          description?: string | null
          estimated_time?: number | null
          id?: string
          intro_text?: string | null
          max_score?: number | null
          published_at?: string | null
          requires_gender?: boolean
          response_count?: number | null
          scheduled_at?: string | null
          short_code?: string | null
          slug?: string
          start_count?: number | null
          status?: string | null
          thumbnail_url?: string | null
          title?: string
          type?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      uploads: {
        Row: {
          created_at: string | null
          filename: string
          id: string
          path: string
          size: number
          type: string
          uploaded_by: string | null
          url: string
        }
        Insert: {
          created_at?: string | null
          filename: string
          id?: string
          path: string
          size: number
          type: string
          uploaded_by?: string | null
          url: string
        }
        Update: {
          created_at?: string | null
          filename?: string
          id?: string
          path?: string
          size?: number
          type?: string
          uploaded_by?: string | null
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "uploads_uploaded_by_fkey"
            columns: ["uploaded_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      user_test_responses: {
        Row: {
          completed_at: string | null
          completion_time_seconds: number | null
          created_at: string | null
          created_date: string | null
          device_type: string | null
          gender: string | null
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
          created_at?: string | null
          created_date?: string | null
          device_type?: string | null
          gender?: string | null
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
          created_at?: string | null
          created_date?: string | null
          device_type?: string | null
          gender?: string | null
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
            referencedRelation: "tests"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_test_responses_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          email: string | null
          id: string
          name: string | null
          provider: string
          status: string | null
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          email?: string | null
          id?: string
          name?: string | null
          provider?: string
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          email?: string | null
          id?: string
          name?: string | null
          provider?: string
          status?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      create_test_complete: {
        Args: { questions_data: Json; results_data: Json; test_data: Json }
        Returns: Json
      }
      delete_test: {
        Args: { test_uuid: string }
        Returns: Json
      }
      get_current_week_balance_game: {
        Args: Record<PropertyKey, never>
        Returns: Json
      }
      increment_balance_game_vote: {
        Args: { p_choice: string; p_game_id: string }
        Returns: Json
      }
      increment_choice_response_count: {
        Args: { choice_uuid: string }
        Returns: undefined
      }
      increment_test_response: {
        Args: { test_uuid: string }
        Returns: undefined
      }
      increment_test_start: {
        Args: { test_uuid: string }
        Returns: undefined
      }
    }
    Enums: {
      category_status: "active" | "inactive"
      gender_type: "male" | "female" | "other" | "prefer_not_to_say"
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
    Enums: {
      category_status: ["active", "inactive"],
      gender_type: ["male", "female", "other", "prefer_not_to_say"],
    },
  },
} as const

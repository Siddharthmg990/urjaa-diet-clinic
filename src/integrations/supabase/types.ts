export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      appointments: {
        Row: {
          appointment_date: string | null
          appointment_time: string | null
          created_at: string | null
          dietitian_id: string | null
          id: string
          notes: string | null
          reason: string | null
          status: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          appointment_date?: string | null
          appointment_time?: string | null
          created_at?: string | null
          dietitian_id?: string | null
          id?: string
          notes?: string | null
          reason?: string | null
          status?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          appointment_date?: string | null
          appointment_time?: string | null
          created_at?: string | null
          dietitian_id?: string | null
          id?: string
          notes?: string | null
          reason?: string | null
          status?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "appointments_dietitian_id_fkey"
            columns: ["dietitian_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "appointments_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      contact_messages: {
        Row: {
          created_at: string | null
          email: string
          id: string
          message: string
          name: string
          status: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          id?: string
          message: string
          name: string
          status?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          id?: string
          message?: string
          name?: string
          status?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "contact_messages_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      diet_plan_logs: {
        Row: {
          action: string
          diet_plan_id: string | null
          id: string
          timestamp: string | null
          user_id: string | null
        }
        Insert: {
          action: string
          diet_plan_id?: string | null
          id?: string
          timestamp?: string | null
          user_id?: string | null
        }
        Update: {
          action?: string
          diet_plan_id?: string | null
          id?: string
          timestamp?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "diet_plan_logs_diet_plan_id_fkey"
            columns: ["diet_plan_id"]
            isOneToOne: false
            referencedRelation: "diet_plans"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "diet_plan_logs_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      diet_plans: {
        Row: {
          content: Json
          created_at: string | null
          description: string | null
          dietitian_id: string | null
          id: string
          status: string | null
          title: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          content: Json
          created_at?: string | null
          description?: string | null
          dietitian_id?: string | null
          id?: string
          status?: string | null
          title: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          content?: Json
          created_at?: string | null
          description?: string | null
          dietitian_id?: string | null
          id?: string
          status?: string | null
          title?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "diet_plans_dietitian_id_fkey"
            columns: ["dietitian_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "diet_plans_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      health_assessments: {
        Row: {
          activities: Json | null
          age: string | null
          break_times: string | null
          city: string | null
          created_at: string | null
          diet_type: string | null
          full_name: string | null
          health_concerns: string | null
          height: string | null
          height_unit: string | null
          id: string
          leave_home_time: string | null
          meals: Json | null
          medical_conditions: string[] | null
          medical_report_urls: string[] | null
          occupation: string | null
          other_condition: string | null
          photo_urls: string[] | null
          profession: string | null
          return_home_time: string | null
          sex: string | null
          sleep_time: string | null
          updated_at: string | null
          user_id: string | null
          wakeup_time: string | null
          weight: string | null
          weight_unit: string | null
          working_hours: Json | null
        }
        Insert: {
          activities?: Json | null
          age?: string | null
          break_times?: string | null
          city?: string | null
          created_at?: string | null
          diet_type?: string | null
          full_name?: string | null
          health_concerns?: string | null
          height?: string | null
          height_unit?: string | null
          id?: string
          leave_home_time?: string | null
          meals?: Json | null
          medical_conditions?: string[] | null
          medical_report_urls?: string[] | null
          occupation?: string | null
          other_condition?: string | null
          photo_urls?: string[] | null
          profession?: string | null
          return_home_time?: string | null
          sex?: string | null
          sleep_time?: string | null
          updated_at?: string | null
          user_id?: string | null
          wakeup_time?: string | null
          weight?: string | null
          weight_unit?: string | null
          working_hours?: Json | null
        }
        Update: {
          activities?: Json | null
          age?: string | null
          break_times?: string | null
          city?: string | null
          created_at?: string | null
          diet_type?: string | null
          full_name?: string | null
          health_concerns?: string | null
          height?: string | null
          height_unit?: string | null
          id?: string
          leave_home_time?: string | null
          meals?: Json | null
          medical_conditions?: string[] | null
          medical_report_urls?: string[] | null
          occupation?: string | null
          other_condition?: string | null
          photo_urls?: string[] | null
          profession?: string | null
          return_home_time?: string | null
          sex?: string | null
          sleep_time?: string | null
          updated_at?: string | null
          user_id?: string | null
          wakeup_time?: string | null
          weight?: string | null
          weight_unit?: string | null
          working_hours?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "health_assessments_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          address: string | null
          birthdate: string | null
          created_at: string | null
          height: string | null
          height_unit: string | null
          id: string
          name: string | null
          phone: string | null
          phone_verified: boolean | null
          role: string | null
          updated_at: string | null
          weight: string | null
          weight_unit: string | null
        }
        Insert: {
          address?: string | null
          birthdate?: string | null
          created_at?: string | null
          height?: string | null
          height_unit?: string | null
          id: string
          name?: string | null
          phone?: string | null
          phone_verified?: boolean | null
          role?: string | null
          updated_at?: string | null
          weight?: string | null
          weight_unit?: string | null
        }
        Update: {
          address?: string | null
          birthdate?: string | null
          created_at?: string | null
          height?: string | null
          height_unit?: string | null
          id?: string
          name?: string | null
          phone?: string | null
          phone_verified?: boolean | null
          role?: string | null
          updated_at?: string | null
          weight?: string | null
          weight_unit?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_diet_plan_elapsed_time: {
        Args: { plan_id: string }
        Returns: unknown
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

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const

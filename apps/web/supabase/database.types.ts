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
      classes: {
        Row: {
          created_at: string
          id: number
          is_started: boolean
          level_id: number
          name: string
          price: number
          school_id: string | null
          start_at: string | null
        }
        Insert: {
          created_at?: string
          id?: number
          is_started?: boolean
          level_id: number
          name: string
          price?: number
          school_id?: string | null
          start_at?: string | null
        }
        Update: {
          created_at?: string
          id?: number
          is_started?: boolean
          level_id?: number
          name?: string
          price?: number
          school_id?: string | null
          start_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "classes_level_id_fkey"
            columns: ["level_id"]
            isOneToOne: false
            referencedRelation: "levels"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "classes_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "schools"
            referencedColumns: ["id"]
          },
        ]
      }
      classes_sub_fields: {
        Row: {
          class_id: number | null
          created_at: string
          field: string
          id: number
          value: string
        }
        Insert: {
          class_id?: number | null
          created_at?: string
          field: string
          id?: number
          value: string
        }
        Update: {
          class_id?: number | null
          created_at?: string
          field?: string
          id?: number
          value?: string
        }
        Relationships: [
          {
            foreignKeyName: "classes_sub_fields_class_id_fkey"
            columns: ["class_id"]
            isOneToOne: false
            referencedRelation: "classes"
            referencedColumns: ["id"]
          },
        ]
      }
      informations: {
        Row: {
          created_at: string
          id: number
          position: string | null
          school_id: string
          team_size: string | null
          user_id: string | null
          where_did_u_find_us: string | null
        }
        Insert: {
          created_at?: string
          id?: number
          position?: string | null
          school_id: string
          team_size?: string | null
          user_id?: string | null
          where_did_u_find_us?: string | null
        }
        Update: {
          created_at?: string
          id?: number
          position?: string | null
          school_id?: string
          team_size?: string | null
          user_id?: string | null
          where_did_u_find_us?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "informations_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "schools"
            referencedColumns: ["id"]
          },
        ]
      }
      levels: {
        Row: {
          created_at: string
          id: number
          keywords: string[] | null
          name: string
          school_id: string
        }
        Insert: {
          created_at?: string
          id?: number
          keywords?: string[] | null
          name: string
          school_id: string
        }
        Update: {
          created_at?: string
          id?: number
          keywords?: string[] | null
          name?: string
          school_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "levels_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "schools"
            referencedColumns: ["id"]
          },
        ]
      }
      levels_sub_fields: {
        Row: {
          created_at: string
          field: string
          id: number
          level_id: number
          value: string
        }
        Insert: {
          created_at?: string
          field: string
          id?: number
          level_id: number
          value: string
        }
        Update: {
          created_at?: string
          field?: string
          id?: number
          level_id?: number
          value?: string
        }
        Relationships: [
          {
            foreignKeyName: "levels_sub_fields_level_id_fkey"
            columns: ["level_id"]
            isOneToOne: false
            referencedRelation: "levels"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          full_name: string | null
          id: string
          updated_at: string | null
          username: string | null
          website: string | null
        }
        Insert: {
          avatar_url?: string | null
          full_name?: string | null
          id: string
          updated_at?: string | null
          username?: string | null
          website?: string | null
        }
        Update: {
          avatar_url?: string | null
          full_name?: string | null
          id?: string
          updated_at?: string | null
          username?: string | null
          website?: string | null
        }
        Relationships: []
      }
      schools: {
        Row: {
          address: string | null
          contact_email: string | null
          contact_number: string | null
          created_at: string
          currency: string
          id: string
          logo_url: string | null
          name: string | null
          status: string
          user_id: string
        }
        Insert: {
          address?: string | null
          contact_email?: string | null
          contact_number?: string | null
          created_at?: string
          currency?: string
          id?: string
          logo_url?: string | null
          name?: string | null
          status?: string
          user_id?: string
        }
        Update: {
          address?: string | null
          contact_email?: string | null
          contact_number?: string | null
          created_at?: string
          currency?: string
          id?: string
          logo_url?: string | null
          name?: string | null
          status?: string
          user_id?: string
        }
        Relationships: []
      }
      specialises: {
        Row: {
          created_at: string
          id: number
          name: string
          school_id: string
        }
        Insert: {
          created_at?: string
          id?: number
          name: string
          school_id: string
        }
        Update: {
          created_at?: string
          id?: number
          name?: string
          school_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "specialises_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "schools"
            referencedColumns: ["id"]
          },
        ]
      }
      student_class_assignments: {
        Row: {
          class_id: number
          created_at: string
          id: number
          reason: string | null
          school_id: string
          student_id: number
        }
        Insert: {
          class_id: number
          created_at?: string
          id?: number
          reason?: string | null
          school_id: string
          student_id: number
        }
        Update: {
          class_id?: number
          created_at?: string
          id?: number
          reason?: string | null
          school_id?: string
          student_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "student_class_assignments_class_id_fkey"
            columns: ["class_id"]
            isOneToOne: false
            referencedRelation: "classes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "student_class_assignments_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "schools"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "student_class_assignments_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
        ]
      }
      student_subscription: {
        Row: {
          created_at: string
          id: number
          school_id: string
          status: string
          student_id: number
        }
        Insert: {
          created_at?: string
          id?: number
          school_id: string
          status?: string
          student_id: number
        }
        Update: {
          created_at?: string
          id?: number
          school_id?: string
          status?: string
          student_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "student_payment_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "schools"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "student_payment_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
        ]
      }
      student_subscription_classes: {
        Row: {
          class_id: number | null
          created_at: string
          end_date: string | null
          id: number
          last_amount_paid: number
          student_payment_id: number
          subscription_total: number
        }
        Insert: {
          class_id?: number | null
          created_at?: string
          end_date?: string | null
          id?: number
          last_amount_paid: number
          student_payment_id: number
          subscription_total?: number
        }
        Update: {
          class_id?: number | null
          created_at?: string
          end_date?: string | null
          id?: number
          last_amount_paid?: number
          student_payment_id?: number
          subscription_total?: number
        }
        Relationships: [
          {
            foreignKeyName: "student_payment_classes_class_id_fkey"
            columns: ["class_id"]
            isOneToOne: false
            referencedRelation: "classes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "student_payment_classes_student_payment_id_fkey"
            columns: ["student_payment_id"]
            isOneToOne: false
            referencedRelation: "student_subscription"
            referencedColumns: ["id"]
          },
        ]
      }
      students: {
        Row: {
          contact_email: string | null
          contact_phone: string | null
          created_at: string
          first_name: string
          id: number
          last_name: string
          school_id: string
        }
        Insert: {
          contact_email?: string | null
          contact_phone?: string | null
          created_at?: string
          first_name: string
          id?: number
          last_name: string
          school_id: string
        }
        Update: {
          contact_email?: string | null
          contact_phone?: string | null
          created_at?: string
          first_name?: string
          id?: number
          last_name?: string
          school_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "students_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "schools"
            referencedColumns: ["id"]
          },
        ]
      }
      sub_fields: {
        Row: {
          assigned_table_id: number
          created_at: string
          field: string
          id: number
          school_id: string
          value: string
        }
        Insert: {
          assigned_table_id: number
          created_at?: string
          field: string
          id?: number
          school_id: string
          value: string
        }
        Update: {
          assigned_table_id?: number
          created_at?: string
          field?: string
          id?: number
          school_id?: string
          value?: string
        }
        Relationships: [
          {
            foreignKeyName: "sub_fields_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "schools"
            referencedColumns: ["id"]
          },
        ]
      }
      subscriptions: {
        Row: {
          created_at: string
          id: number
          plan: Database["public"]["Enums"]["plan"] | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: number
          plan?: Database["public"]["Enums"]["plan"] | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: number
          plan?: Database["public"]["Enums"]["plan"] | null
          user_id?: string | null
        }
        Relationships: []
      }
      teachers: {
        Row: {
          contact_email: string | null
          contact_phone: string | null
          created_at: string
          date_of_hire: string
          first_name: string
          id: number
          last_name: string
          resume_files: string[] | null
          school_id: string
          specialty: string | null
        }
        Insert: {
          contact_email?: string | null
          contact_phone?: string | null
          created_at?: string
          date_of_hire?: string
          first_name: string
          id?: number
          last_name: string
          resume_files?: string[] | null
          school_id: string
          specialty?: string | null
        }
        Update: {
          contact_email?: string | null
          contact_phone?: string | null
          created_at?: string
          date_of_hire?: string
          first_name?: string
          id?: number
          last_name?: string
          resume_files?: string[] | null
          school_id?: string
          specialty?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "teachers_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "schools"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      create_student_subscription: {
        Args: {
          ag_school_id: string
          ag_student_id: number
          ag_auto_assign_student_to_classes: boolean
          ag_is_paid: boolean
          student_subscription_class: Database["public"]["CompositeTypes"]["class_record"][]
        }
        Returns: number
      }
      get_classes_enrollment_for_student: {
        Args: {
          ag_school_id: string
          ag_student_id: number
        }
        Returns: {
          created_at: string
          id: number
          is_started: boolean
          level_id: number
          name: string
          price: number
          school_id: string | null
          start_at: string | null
        }[]
      }
      get_student_enrollment_in_class: {
        Args: {
          ag_school_id: string
          ag_class_id: number
        }
        Returns: {
          contact_email: string | null
          contact_phone: string | null
          created_at: string
          first_name: string
          id: number
          last_name: string
          school_id: string
        }[]
      }
      requesting_user_id: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
    }
    Enums: {
      plan: "FREE" | "PRO"
    }
    CompositeTypes: {
      class_record: {
        ag_class_id: number | null
        ag_end_date: string | null
        ag_period: number | null
        ag_automatically_assign_start_date: boolean | null
      }
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

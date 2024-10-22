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
          name: string
          school_id: string | null
        }
        Insert: {
          created_at?: string
          id?: number
          name: string
          school_id?: string | null
        }
        Update: {
          created_at?: string
          id?: number
          name?: string
          school_id?: string | null
        }
        Relationships: [
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
          school_id: number
          team_size: string | null
          user_id: string | null
          where_did_u_find_us: string | null
        }
        Insert: {
          created_at?: string
          id?: number
          position?: string | null
          school_id: number
          team_size?: string | null
          user_id?: string | null
          where_did_u_find_us?: string | null
        }
        Update: {
          created_at?: string
          id?: number
          position?: string | null
          school_id?: number
          team_size?: string | null
          user_id?: string | null
          where_did_u_find_us?: string | null
        }
        Relationships: []
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
          id?: string
          logo_url?: string | null
          name?: string | null
          status: string
          user_id?: string
        }
        Update: {
          address?: string | null
          contact_email?: string | null
          contact_number?: string | null
          created_at?: string
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
      requesting_user_id: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
    }
    Enums: {
      plan: "FREE" | "PRO"
    }
    CompositeTypes: {
      [_ in never]: never
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

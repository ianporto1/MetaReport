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
      meta_accounts: {
        Row: {
          access_token_encrypted: string
          created_at: string | null
          id: string
          meta_account_id: string
          name: string
          token_expiration: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          access_token_encrypted: string
          created_at?: string | null
          id?: string
          meta_account_id: string
          name: string
          token_expiration?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          access_token_encrypted?: string
          created_at?: string | null
          id?: string
          meta_account_id?: string
          name?: string
          token_expiration?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      reports: {
        Row: {
          compare_end_date: string | null
          compare_start_date: string | null
          created_at: string | null
          data: Json
          end_date: string
          id: string
          meta_account_id: string
          start_date: string
          user_id: string
        }
        Insert: {
          compare_end_date?: string | null
          compare_start_date?: string | null
          created_at?: string | null
          data: Json
          end_date: string
          id?: string
          meta_account_id: string
          start_date: string
          user_id: string
        }
        Update: {
          compare_end_date?: string | null
          compare_start_date?: string | null
          created_at?: string | null
          data?: Json
          end_date?: string
          id?: string
          meta_account_id?: string
          start_date?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "reports_meta_account_id_fkey"
            columns: ["meta_account_id"]
            isOneToOne: false
            referencedRelation: "meta_accounts"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row']
export type TablesInsert<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Insert']
export type TablesUpdate<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Update']

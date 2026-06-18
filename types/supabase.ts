export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      credits: {
        Row: {
          created_at: string
          credits: number
          id: number
          tier: string          // ⭐ 新增：starter | professional | executive
          user_id: string
        }
        Insert: {
          created_at?: string
          credits?: number
          id?: number
          tier?: string         // ⭐ 新增
          user_id: string
        }
        Update: {
          created_at?: string
          credits?: number
          id?: number
          tier?: string         // ⭐ 新增
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "credits_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      images: {
        Row: {
          created_at: string
          id: number
          modelId: number
          uri: string
        }
        Insert: {
          created_at?: string
          id?: number
          modelId: number
          uri: string
        }
        Update: {
          created_at?: string
          id?: number
          modelId?: number
          uri?: string
        }
        Relationships: [
          {
            foreignKeyName: "images_modelId_fkey"
            columns: ["modelId"]
            referencedRelation: "models"
            referencedColumns: ["id"]
          }
        ]
      }
      models: {
        Row: {
          created_at: string
          id: number
          images_generated: number  // 已生成图片数
          modelId: string | null
          name: string | null
          status: string
          tier: string          // ⭐ 新增：starter | professional | executive
          total_images: number  // 预计总图片数
          type: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: number
          images_generated?: number  // 已生成图片数，默认 0
          modelId?: string | null
          name?: string | null
          status?: string
          tier?: string         // ⭐ 新增
          total_images?: number  // 预计总图片数
          type?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: number
          images_generated?: number
          modelId?: string | null
          name?: string | null
          status?: string
          tier?: string         // ⭐ 新增
          total_images?: number
          type?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "models_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      // ⭐ orders 表（新增）
      orders: {
        Row: {
          id: number
          user_id: string
          creem_checkout_id: string | null
          creem_product_id: string
          tier: string
          amount_cents: number
          currency: string
          status: string
          credits_granted: boolean
          raw_payload: Json | null
          created_at: string
        }
        Insert: {
          id?: number
          user_id: string
          creem_checkout_id?: string | null
          creem_product_id: string
          tier: string
          amount_cents: number
          currency?: string
          status?: string
          credits_granted?: boolean
          raw_payload?: Json | null
          created_at?: string
        }
        Update: {
          id?: number
          user_id?: string
          creem_checkout_id?: string | null
          creem_product_id?: string
          tier?: string
          amount_cents?: number
          currency?: string
          status?: string
          credits_granted?: boolean
          raw_payload?: Json | null
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "orders_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      samples: {
        Row: {
          created_at: string
          id: number
          modelId: number
          uri: string
        }
        Insert: {
          created_at?: string
          id?: number
          modelId: number
          uri: string
        }
        Update: {
          created_at?: string
          id?: number
          modelId?: number
          uri?: string
        }
        Relationships: [
          {
            foreignKeyName: "samples_modelId_fkey"
            columns: ["modelId"]
            referencedRelation: "models"
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

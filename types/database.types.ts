export type Json = string | number | boolean | null | { [key: string]: Json } | Json[]

export interface Database {
  public: {
    Tables: {
      alerts: {
        Row: Alert
        Insert: Pick<Alert, 'event' | 'target' | 'site' | 'user' | 'text' | 'enabled'>
        Update: Pick<Alert, 'event' | 'target' | 'site' | 'text' | 'enabled' | 'updated_at'>
      }
      events: {
        Row: Event
      }
      providers: {
        Row: Provider
      }
      sites: {
        Row: Site
        Insert: Pick<Site, 'url' | 'user'>
        Update: Pick<Site, 'url' | 'enabled'>
      }
      targets: {
        Row: Target
        Insert: Pick<Target, 'user' | 'provider' | 'target' | 'meta'>
        Update: Pick<Target, 'provider' | 'target' | 'confirmed' | 'meta'>
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

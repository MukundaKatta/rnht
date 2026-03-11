export type Database = {
  public: {
    Tables: {
      service_categories: {
        Row: {
          id: string;
          name: string;
          slug: string;
          description: string | null;
          icon: string | null;
          sort_order: number;
          created_at: string;
        };
        Insert: Omit<
          Database["public"]["Tables"]["service_categories"]["Row"],
          "id" | "created_at"
        >;
        Update: Partial<
          Database["public"]["Tables"]["service_categories"]["Insert"]
        >;
      };
      services: {
        Row: {
          id: string;
          category_id: string;
          name: string;
          slug: string;
          short_description: string;
          full_description: string | null;
          significance: string | null;
          items_to_bring: string[] | null;
          whats_included: string[] | null;
          image_url: string | null;
          price: number | null;
          price_type: "fixed" | "tiered" | "custom" | "donation";
          price_tiers: PriceTier[] | null;
          suggested_donation: number | null;
          duration_minutes: number;
          location_type: "at_temple" | "outside_temple" | "both";
          is_active: boolean;
          sort_order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<
          Database["public"]["Tables"]["services"]["Row"],
          "id" | "created_at" | "updated_at"
        >;
        Update: Partial<
          Database["public"]["Tables"]["services"]["Insert"]
        >;
      };
      bookings: {
        Row: {
          id: string;
          service_id: string;
          booking_date: string;
          booking_time: string;
          status: "pending" | "confirmed" | "completed" | "cancelled";
          devotee_name: string;
          devotee_email: string;
          devotee_phone: string | null;
          gotra: string | null;
          nakshatra: string | null;
          rashi: string | null;
          special_instructions: string | null;
          family_members: FamilyMember[] | null;
          total_amount: number;
          payment_status: "pending" | "paid" | "refunded";
          payment_intent_id: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<
          Database["public"]["Tables"]["bookings"]["Row"],
          "id" | "created_at" | "updated_at"
        >;
        Update: Partial<
          Database["public"]["Tables"]["bookings"]["Insert"]
        >;
      };
      events: {
        Row: {
          id: string;
          title: string;
          description: string | null;
          event_type: "festival" | "regular_pooja" | "community" | "class";
          start_date: string;
          end_date: string | null;
          start_time: string | null;
          end_time: string | null;
          location: string | null;
          image_url: string | null;
          is_recurring: boolean;
          recurrence_rule: string | null;
          rsvp_enabled: boolean;
          rsvp_count: number;
          created_at: string;
        };
        Insert: Omit<
          Database["public"]["Tables"]["events"]["Row"],
          "id" | "created_at" | "rsvp_count"
        >;
        Update: Partial<
          Database["public"]["Tables"]["events"]["Insert"]
        >;
      };
      donations: {
        Row: {
          id: string;
          donor_name: string;
          donor_email: string;
          amount: number;
          fund_type: string;
          payment_method: "stripe" | "paypal" | "zelle";
          payment_status: "pending" | "completed" | "failed";
          is_recurring: boolean;
          message: string | null;
          is_anonymous: boolean;
          created_at: string;
        };
        Insert: Omit<
          Database["public"]["Tables"]["donations"]["Row"],
          "id" | "created_at"
        >;
        Update: Partial<
          Database["public"]["Tables"]["donations"]["Insert"]
        >;
      };
    };
  };
};

export type PriceTier = {
  name: string;
  price: number;
  description: string;
};

export type FamilyMember = {
  name: string;
  gotra?: string;
  nakshatra?: string;
  relationship?: string;
};

export type Service = Database["public"]["Tables"]["services"]["Row"];
export type ServiceCategory =
  Database["public"]["Tables"]["service_categories"]["Row"];
export type Booking = Database["public"]["Tables"]["bookings"]["Row"];
export type Event = Database["public"]["Tables"]["events"]["Row"];
export type Donation = Database["public"]["Tables"]["donations"]["Row"];

export interface User {
  id: string;
  email: string;
  token_balance: number;
  created_at: string;
  updated_at: string;
}

export interface Room {
  id: string;
  name: string;
  created_by: string;
  token_cost: number;
  status: "active" | "completed" | "cancelled";
  created_at: string;
  updated_at: string;
}

export interface RoomParticipant {
  id: string;
  room_id: string;
  user_id: string;
  joined_at: string;
}

export interface WhiteboardEvent {
  id: string;
  room_id: string;
  user_id: string;
  event_type: "draw" | "erase" | "clear" | "add_object" | "modify_object" | "delete_object";
  event_data: Record<string, any>;
  created_at: string;
}

export interface TokenTransaction {
  id: string;
  user_id: string;
  amount: number;
  type: "purchase" | "spend" | "refund";
  stripe_payment_intent_id?: string;
  description?: string;
  created_at: string;
}




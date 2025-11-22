// Database entity types matching Supabase schema

export interface Bill {
  id: string;
  title: string;
  code: string;
  status: string;
  location: string;
  author: string;
  summary: string | null;
  tags: string[];
  views: number;
  comments_count: number;
  supports_count: number;
  created_at: string | null;
  updated_at: string | null;
}

export type ReactionType = "apoio" | "nao-apoio" | "nao-entendi" | "impacta";

export interface BillReaction {
  id: string;
  bill_id: string;
  user_id: string;
  type: ReactionType;
  created_at: string;
}

export interface Profile {
  id: string;
  name: string | null;
  avatar_url: string | null;
}

export interface BillCommentReply {
  id: string;
  comment_id: string;
  user_id: string;
  text: string;
  upvotes: number;
  created_at: string;
  author: Profile;
}

export interface BillComment {
  id: string;
  bill_id: string;
  user_id: string;
  text: string;
  upvotes: number;
  created_at: string;
  author: Profile;
  replies: BillCommentReply[];
}

// Aggregated data types for the UI
export interface ReactionCounts {
  apoio: number;
  "nao-apoio": number;
  "nao-entendi": number;
  impacta: number;
}

export interface EngagementMetrics {
  views: number;
  comments: number;
  supports: number;
}

export interface BillWithDetails extends Bill {
  reactionCounts: ReactionCounts;
  relatedBills: Bill[];
}

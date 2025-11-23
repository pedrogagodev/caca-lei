"use server";

import { createClient } from "@/supabase/server";
import type { ReactionType } from "@/types/database.types";

export async function saveBillReaction(
  billId: number,
  reactionType: ReactionType,
): Promise<boolean> {
  const supabase = await createClient();

  try {
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      console.error("User not authenticated:", userError);
      return false;
    }

    const { error } = await supabase
      .from("bill_reactions")
      .upsert(
        {
          bill_id: billId,
          user_id: user.id,
          type: reactionType,
        },
        {
          onConflict: "bill_id,user_id",
        },
      );

    if (error) {
      console.error("Error saving reaction:", error);
      return false;
    }

    return true;
  } catch (error) {
    console.error("Error in saveBillReaction:", error);
    return false;
  }
}

export async function removeBillReaction(billId: number): Promise<boolean> {
  const supabase = await createClient();

  try {
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      console.error("User not authenticated:", userError);
      return false;
    }

    const { error } = await supabase
      .from("bill_reactions")
      .delete()
      .eq("bill_id", billId)
      .eq("user_id", user.id);

    if (error) {
      console.error("Error removing reaction:", error);
      return false;
    }

    return true;
  } catch (error) {
    console.error("Error in removeBillReaction:", error);
    return false;
  }
}


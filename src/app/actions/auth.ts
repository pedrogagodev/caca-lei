"use server";

import { createClient } from "@/supabase/server";
import { redirect } from "next/navigation";

export async function getUser() {
  const supabase = await createClient();

  try {
    const { data: { user }, error } = await supabase.auth.getUser();

    if (error) {
      console.error("Error fetching user:", error);
      return null;
    }

    return user;
  } catch (error) {
    console.error("Error in getUser:", error);
    return null;
  }
}

export async function getProfile() {
  const supabase = await createClient();

  try {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return null;
    }

    const { data: profile, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    if (error) {
      console.error("Error fetching profile:", error);
      return null;
    }

    return { user, profile };
  } catch (error) {
    console.error("Error in getProfile:", error);
    return null;
  }
}

export async function signOut() {
  const supabase = await createClient();

  const { error } = await supabase.auth.signOut();

  if (error) {
    console.error("Error signing out:", error);
    return { success: false, error: error.message };
  }

  redirect("/");
}

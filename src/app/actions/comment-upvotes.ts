"use server";

import { createClient } from "@/supabase/server";

export async function upvoteComment(
  commentId: string,
): Promise<{ success: boolean; newCount?: number; error?: string }> {
  const supabase = await createClient();

  try {
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return { success: false, error: "Você precisa estar autenticado para dar upvote" };
    }

    const { data: existingUpvote } = await supabase
      .from("comment_upvotes")
      .select("id")
      .eq("comment_id", commentId)
      .eq("user_id", user.id)
      .single();

    if (existingUpvote) {
      return { success: false, error: "Você já deu upvote neste comentário" };
    }

    const { data: currentComment, error: fetchError } = await supabase
      .from("bill_comments")
      .select("upvotes")
      .eq("id", commentId)
      .single();

    if (fetchError || !currentComment) {
      console.error("Error fetching comment:", fetchError);
      return {
        success: false,
        error: "Comentário não encontrado",
      };
    }

    const { error: upvoteError } = await supabase
      .from("comment_upvotes")
      .insert({
        comment_id: commentId,
        user_id: user.id,
      });

    if (upvoteError) {
      console.error("Error creating upvote record:", upvoteError);
      return {
        success: false,
        error: "Erro ao dar upvote. Tente novamente.",
      };
    }

    const newUpvotes = (currentComment.upvotes || 0) + 1;
    const { data: comment, error: updateError } = await supabase
      .from("bill_comments")
      .update({ upvotes: newUpvotes })
      .eq("id", commentId)
      .select("upvotes")
      .single();

    if (updateError || !comment) {
      console.error("Error updating comment upvotes:", updateError);
      await supabase
        .from("comment_upvotes")
        .delete()
        .eq("comment_id", commentId)
        .eq("user_id", user.id);
      return {
        success: false,
        error: "Erro ao atualizar upvote. Tente novamente.",
      };
    }

    return { success: true, newCount: comment.upvotes };
  } catch (error) {
    console.error("Error in upvoteComment:", error);
    return {
      success: false,
      error: "Erro inesperado ao dar upvote",
    };
  }
}

export async function removeCommentUpvote(
  commentId: string,
): Promise<{ success: boolean; newCount?: number; error?: string }> {
  const supabase = await createClient();

  try {
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return { success: false, error: "Você precisa estar autenticado" };
    }

    const { data: existingUpvote } = await supabase
      .from("comment_upvotes")
      .select("id")
      .eq("comment_id", commentId)
      .eq("user_id", user.id)
      .single();

    if (!existingUpvote) {
      return { success: false, error: "Você não deu upvote neste comentário" };
    }

    const { data: currentComment, error: fetchError } = await supabase
      .from("bill_comments")
      .select("upvotes")
      .eq("id", commentId)
      .single();

    if (fetchError || !currentComment) {
      console.error("Error fetching comment:", fetchError);
      return {
        success: false,
        error: "Comentário não encontrado",
      };
    }

    const { error: deleteError } = await supabase
      .from("comment_upvotes")
      .delete()
      .eq("comment_id", commentId)
      .eq("user_id", user.id);

    if (deleteError) {
      console.error("Error deleting upvote record:", deleteError);
      return {
        success: false,
        error: "Erro ao remover upvote. Tente novamente.",
      };
    }

    const newUpvotes = Math.max((currentComment.upvotes || 0) - 1, 0);
    const { data: comment, error: updateError } = await supabase
      .from("bill_comments")
      .update({ upvotes: newUpvotes })
      .eq("id", commentId)
      .select("upvotes")
      .single();

    if (updateError || !comment) {
      console.error("Error updating comment upvotes:", updateError);
      return {
        success: false,
        error: "Erro ao atualizar contador. Tente novamente.",
      };
    }

    return { success: true, newCount: comment.upvotes };
  } catch (error) {
    console.error("Error in removeCommentUpvote:", error);
    return {
      success: false,
      error: "Erro inesperado ao remover upvote",
    };
  }
}

export async function upvoteCommentReply(
  replyId: string,
): Promise<{ success: boolean; newCount?: number; error?: string }> {
  const supabase = await createClient();

  try {
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return { success: false, error: "Você precisa estar autenticado para dar upvote" };
    }

    const { data: existingUpvote } = await supabase
      .from("comment_reply_upvotes")
      .select("id")
      .eq("reply_id", replyId)
      .eq("user_id", user.id)
      .single();

    if (existingUpvote) {
      return { success: false, error: "Você já deu upvote nesta resposta" };
    }

    const { data: currentReply, error: fetchError } = await supabase
      .from("bill_comment_replies")
      .select("upvotes")
      .eq("id", replyId)
      .single();

    if (fetchError || !currentReply) {
      console.error("Error fetching reply:", fetchError);
      return {
        success: false,
        error: "Resposta não encontrada",
      };
    }

    const { error: upvoteError } = await supabase
      .from("comment_reply_upvotes")
      .insert({
        reply_id: replyId,
        user_id: user.id,
      });

    if (upvoteError) {
      console.error("Error creating upvote record:", upvoteError);
      return {
        success: false,
        error: "Erro ao dar upvote. Tente novamente.",
      };
    }

    const newUpvotes = (currentReply.upvotes || 0) + 1;
    const { data: reply, error: updateError } = await supabase
      .from("bill_comment_replies")
      .update({ upvotes: newUpvotes })
      .eq("id", replyId)
      .select("upvotes")
      .single();

    if (updateError || !reply) {
      console.error("Error updating reply upvotes:", updateError);
      await supabase
        .from("comment_reply_upvotes")
        .delete()
        .eq("reply_id", replyId)
        .eq("user_id", user.id);
      return {
        success: false,
        error: "Erro ao atualizar upvote. Tente novamente.",
      };
    }

    return { success: true, newCount: reply.upvotes };
  } catch (error) {
    console.error("Error in upvoteCommentReply:", error);
    return {
      success: false,
      error: "Erro inesperado ao dar upvote",
    };
  }
}

export async function removeCommentReplyUpvote(
  replyId: string,
): Promise<{ success: boolean; newCount?: number; error?: string }> {
  const supabase = await createClient();

  try {
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return { success: false, error: "Você precisa estar autenticado" };
    }

    const { data: existingUpvote } = await supabase
      .from("comment_reply_upvotes")
      .select("id")
      .eq("reply_id", replyId)
      .eq("user_id", user.id)
      .single();

    if (!existingUpvote) {
      return { success: false, error: "Você não deu upvote nesta resposta" };
    }

    const { data: currentReply, error: fetchError } = await supabase
      .from("bill_comment_replies")
      .select("upvotes")
      .eq("id", replyId)
      .single();

    if (fetchError || !currentReply) {
      console.error("Error fetching reply:", fetchError);
      return {
        success: false,
        error: "Resposta não encontrada",
      };
    }

    const { error: deleteError } = await supabase
      .from("comment_reply_upvotes")
      .delete()
      .eq("reply_id", replyId)
      .eq("user_id", user.id);

    if (deleteError) {
      console.error("Error deleting upvote record:", deleteError);
      return {
        success: false,
        error: "Erro ao remover upvote. Tente novamente.",
      };
    }

    const newUpvotes = Math.max((currentReply.upvotes || 0) - 1, 0);
    const { data: reply, error: updateError } = await supabase
      .from("bill_comment_replies")
      .update({ upvotes: newUpvotes })
      .eq("id", replyId)
      .select("upvotes")
      .single();

    if (updateError || !reply) {
      console.error("Error updating reply upvotes:", updateError);
      return {
        success: false,
        error: "Erro ao atualizar contador. Tente novamente.",
      };
    }

    return { success: true, newCount: reply.upvotes };
  } catch (error) {
    console.error("Error in removeCommentReplyUpvote:", error);
    return {
      success: false,
      error: "Erro inesperado ao remover upvote",
    };
  }
}


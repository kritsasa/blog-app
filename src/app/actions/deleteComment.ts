"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

type State = {
  error?: string;
  success?: boolean;
};

export async function deleteComment(
  prevState: State,
  formData: FormData,
): Promise<State> {
  const commentId = Number(formData.get("commentId"));
  const slug = formData.get("postSlug");
  const userId = Number(formData.get("payloadId"));
  const postId = Number(formData.get("postId"));


  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if(!user) {
      return { error: "User not found" }
    }

    const comment = await prisma.comment.findUnique({
      where: { id: commentId }
    })

    if(!comment) {
      return { error: "Comment not found" }
    }

    const post = await prisma.post.findUnique({
      where: { id: postId }
    })

    const isAdmin = user.role === "ADMIN";
    const isOwnerPost = user.id === post?.authorId;
    const isOwnerCommnet = user.id === comment.userId

    if(!isAdmin && !(isOwnerPost || isOwnerCommnet)) {
      return { error: "คุณไม่มีสิทธิ์ลบ" }
    }

    await prisma.comment.delete({
      where: { id: commentId },
    });

    revalidatePath(`/posts/${slug}`);

    return { success: true };
  } catch (error) {
    return { error: (error as Error)?.message ?? "Failed to delete comment" };
  }
}

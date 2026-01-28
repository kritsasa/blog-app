"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

type State = {
  error?: string;
  success?: boolean;
};

export async function editComment(
  prevState: State,
  formData: FormData,
): Promise<State> {
  const content = formData.get("content") as string;
  const slug = formData.get("postSlug");
  const userId = Number(formData.get("payloadId"));
  const commentId = Number(formData.get("commentId"));

  try {
    if (!userId) {
      return { error: "กรุณาเข้าสู่ระบบก่อน" };
    }

    if (!content?.trim()) {
      return { error: "ห้ามส่งคอมเมนต์ว่าง" };
    }

    if (content.length > 1000) {
      return { error: "คอมเมนต์ยาวเกินไป" };
    }

    const user = await prisma.user.findUnique({
        where: { id: userId}
    })

    if(!user) {
        return { error: "User not found" }
    }

    const comment = await prisma.comment.findUnique({
      where: { id: commentId }
    })

    if(!comment) {
      return { error: "Comment not found" }
    }

    const isAdmin = user.role === "ADMIN";
    const isOwnerCommnet = user.id === comment.userId

    if(!isAdmin && !isOwnerCommnet) {
      return { error: "คุณไม่มีสิทธิ์แก้ไข" }
    }

    await prisma.comment.update({
      where: {
        id: commentId,
      },
      data: {
        content,
      },
    });

    revalidatePath(`/posts/${slug}`);

    return { success: true };
  } catch (error) {
    return { error: (error as Error)?.message ?? "Failed to post comment" };
  }
}

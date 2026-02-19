"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

type State = {
  error?: string;
  success?: boolean;
};

export async function createComment(
  prevState: State,
  formData: FormData,
): Promise<State> {
  const content = formData.get("content") as string;
  const postId = Number(formData.get("postId"));
  const slug = formData.get("postSlug");
  const userId = Number(formData.get("payloadId"));

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
  
    await prisma.comment.create({
      data: {
        content,
        postId,
        userId,
      },
    });
  
    revalidatePath(`/posts/${slug}`);
  
    return { success: true };
  } catch (error) {
    return { error: (error as Error)?.message ?? "Failed to post comment" };
  }
}

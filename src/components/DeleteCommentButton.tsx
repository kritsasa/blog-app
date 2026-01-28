"use client"

import { deleteComment } from "@/app/actions/deleteComment";
import { useActionState } from "react"

type Props = {
  commentId: number;
  postSlug: string;
  payloadId: number;
  postId: number;
}

const initialState: { error?: string } = {};

export default function DeleteCommentButton({
  commentId,
  postSlug,
  payloadId,
  postId
}: Props) {
  const [state, formAction] = useActionState(deleteComment, initialState);

  return (
    <form action={formAction}>
      <input type="hidden" name="commentId" value={commentId} />
      <input type="hidden" name="postSlug" value={postSlug} />
      <input type="hidden" name="payloadId" value={payloadId} />
      <input type="hidden" name="postId" value={postId} />

      {state?.error && (
        <p className="text-red-500 text-sm mb-2">
          {state.error}
        </p>
      )}

      <button
        type="submit"
        className="text-red-600"
      >
        ลบ
      </button>
    </form>
  );
}

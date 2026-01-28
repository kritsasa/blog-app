"use client";

import { createComment } from "@/app/actions/createCommnet";
import { useActionState } from "react"

type Props = {
    postId: number;
    postSlug: string;
    payloadId: number;
}

const initialState: { error?: string } = {};

export default function CreateComment({
    postId,
    postSlug,
    payloadId,
}: Props) {
    const [state, formAction] = useActionState(createComment, initialState);

    return (
        <form action={formAction}>
            <input type="hidden" name="postId" value={postId} />
            <input type="hidden" name="postSlug" value={postSlug} />
            <input type="hidden" name="payloadId" value={payloadId} />

            <textarea
                name="content"
                placeholder="เขียนความคิดเห็น..."
                required
                className="w-full border rounded px-3 py-2 mb-2"
                rows={4}
            />

            {state?.error && (
                <p className="text-red-500 text-sm mb-2">
                    {state.error}
                </p>
            )}

            <button
                type="submit"
                className="bg-blue-500 text-white px-4 py-2 rounded"
            >
                ส่งความคิดเห็น
            </button>
        </form>
    );
}
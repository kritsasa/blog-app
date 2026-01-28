/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { editComment } from "@/app/actions/editComment";
import { useActionState, useState, useEffect } from "react"

type Props = {
    commentId: number;
    postSlug: string;
    payloadId: number;
}

const initialState: { error?: string; success?: boolean } = {};

export default function EditCommentButton({
    postSlug,
    payloadId,
    commentId
}: Props) {
    const [state, formAction] = useActionState(editComment, initialState);
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        if (state?.success) {
            setIsEditing(false);
        }
    }, [state])

    return (
        <>
            <button
                type="button"
                className="text-blue-600 mr-2"
                onClick={() => setIsEditing(!isEditing)}
            >
                {isEditing ? "ยกเลิก" : "แก้ไข"}
            </button>

            {isEditing && (
                <form action={formAction}>
                    <input type="hidden" name="postSlug" value={postSlug} />
                    <input type="hidden" name="payloadId" value={payloadId} />
                    <input type="hidden" name="commentId" value={commentId} />

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
                        บันทึการแก้ไข
                    </button>
                </form>
            )}
        </>
    );
}
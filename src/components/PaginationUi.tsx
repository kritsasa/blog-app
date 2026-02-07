import React from "react";

interface Props {
  page: number;
  hasPrev: boolean;
  hasNext: boolean;
  onPrev?: () => void;
  onNext?: () => void;
  prevHref?: string;
  nextHref?: string;
}

export default function PaginationUi({
  page,
  hasPrev,
  hasNext,
  onPrev,
  onNext,
  prevHref,
  nextHref,
}: Props) {
  return (
    <div className="mt-8 flex items-center justify-center gap-4">
      {hasPrev &&
        (prevHref ? (
          <a
            href={prevHref}
            className="rounded-full border border-emerald-500/30 px-4 py-2 text-sm font-medium text-emerald-400 hover:bg-emerald-500 hover:text-black transition"
          >
            Prev
          </a>
        ) : (
          <button
            onClick={onPrev}
            className="
              rounded-full border border-emerald-500/30
              px-4 py-2
              text-sm font-medium text-emerald-400
              hover:bg-emerald-500 hover:text-black
              transition
            "
          >
            Prev
          </button>
        ))}

      <span
        className="rounded-full bg-zinc-900 px-4 py-2 text-sm font-medium text-zinc-300 border border-zinc-700"
      >
        Page {page}
      </span>

      {hasNext &&
        (nextHref ? (
          <a
            href={nextHref}
            className="
              rounded-full border border-emerald-500/30
              px-4 py-2
              text-sm font-medium text-emerald-400
              hover:bg-emerald-500 hover:text-black
              transition
            "
          >
            Next
          </a>
        ) : (
          <button
            onClick={onNext}
            className="
              rounded-full border border-emerald-500/30
              px-4 py-2
              text-sm font-medium text-emerald-400
              hover:bg-emerald-500 hover:text-black
              transition
            "
          >
            Next
          </button>
        ))}
    </div>
  );
}

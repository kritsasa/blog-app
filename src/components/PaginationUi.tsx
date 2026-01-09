import React from 'react'

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
    <div className="flex items-center gap-4 mt-6">
      {hasPrev &&
        (prevHref ? (
          <a href={prevHref}>Prev</a>
        ) : (
          <button onClick={onPrev}>Prev</button>
        ))}

      <span>Page {page}</span>

      {hasNext &&
        (nextHref ? (
          <a href={nextHref}>Next</a>
        ) : (
          <button onClick={onNext}>Next</button>
        ))}
    </div>
  );
}

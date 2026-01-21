"use client";

import PaginationUi from "./PaginationUi";

export default function CsrPagination({
    page,
    totalPages,
    onPageChange,
}: {
    page: number;
    totalPages: number;
    onPageChange: (newPage: number) => void;
}) {
    return (
        <PaginationUi
            page={page}
            hasPrev={page > 1}
            hasNext={page < totalPages}
            onPrev={() => onPageChange(page - 1)}
            onNext={() => onPageChange(page + 1)}
        />
    )
}

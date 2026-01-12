import PaginationUi from "./PaginationUi";

export default function IsrPagination({
    page,
    totalPages
}: {
    page: number;
    totalPages: number;
}) {
    return (
        <PaginationUi
            page={page}
            hasPrev={page > 1}
            hasNext={page < totalPages}
            prevHref={`?page=${page - 1}`}
            nextHref={`?page=${page + 1}`}
        />
    )
}
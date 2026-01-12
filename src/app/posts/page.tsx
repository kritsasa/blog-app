import PostList from "@/components/PostList";
import IsrPagination from "@/components/IsrPagination";

async function getPosts(page: number) {
    const res = await fetch(
        `http://localhost:3000/api/auth/post?page=${page}&limit=10`, {

        next: {
            revalidate: 60,
        },
    }
    );

    if (!res.ok) throw new Error("Failed to fetch posts");
    return res.json();
}

interface PageProps {
    searchParams: {
        page?: string;
    };
}

export default async function Posts({ searchParams }: PageProps) {
    const pagePromise = await searchParams
    const page = Number(pagePromise.page ?? 1);

    if (!Number.isInteger(page) || page < 1) {
        throw new Error("Invalid page number");
    }

    console.log("Current page:", page);

    const posts = await getPosts(page);

    return (
        <>
            <h1 className="text-3xl font-bold mb-6">
                Blog Posts – Page {page}
            </h1>
            <PostList posts={posts.postsData} />
            <IsrPagination page={page} totalPages={posts.pagination.totalPages} />
        </>
    );
}

import PostDetail from '@/components/PostDetail';

async function fetchPostDetail(slug: string) {
    const res = await fetch(`http://localhost:3000/api/auth/post/${slug}`, {
        next: {
            revalidate: 60,
        },
    });
    if (!res.ok) {
        throw new Error("Failed to fetch post detail");
    }
    return res.json();
}

async function PostDetailPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params as { slug: string };
    const post = await fetchPostDetail(slug);
    return (
        <>
            <PostDetail post={post}/>
        </>
    )
}

export default PostDetailPage
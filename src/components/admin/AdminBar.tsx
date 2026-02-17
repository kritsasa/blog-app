"use client"
import { useFetch } from '@/hooks/useFetch'
import Link from 'next/link';

interface AdminData {
    usersCount: number;
    postsCount: number;
    commentsCount: number;
    categoriesCount: number;
    tagsCount: number;
}

function AdminBar() {
    const { data } = useFetch<AdminData>('/api/admin/dashboard');

    const listItems = [
        { name: 'Users', count: data?.usersCount || 0, href: '/admin/users' },
        { name: 'Posts', count: data?.postsCount || 0, href: '/admin/posts' },
        { name: 'Comments', count: data?.commentsCount || 0, href: '/admin/comments' },
        { name: 'Categories', count: data?.categoriesCount || 0, href: '/admin/categories' },
        { name: 'Tags', count: data?.tagsCount || 0, href: '/admin/tags' }
    ];

    return (
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 mb-6">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                {listItems.map((item) => (
                    <Link
                        key={item.name}
                        href={item.href}
                        className="group bg-gray-800 hover:bg-gray-700 transition rounded-lg px-4 py-3 flex flex-col items-start border border-gray-700"
                    >
                        <span className="text-xs uppercase tracking-wider text-gray-400 group-hover:text-gray-300">
                            {item.name}
                        </span>

                        <span className="text-xl font-semibold text-emerald-400 mt-1">
                            {item.count}
                        </span>

                        <span className="text-[11px] text-gray-500 mt-1 group-hover:text-gray-400">
                            Manage <span className='group-hover:ml-2 duration-500'>→</span>
                        </span>
                    </Link>
                ))}
            </div>
        </div>
    )
}

export default AdminBar

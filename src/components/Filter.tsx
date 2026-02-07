// components/Filter.tsx
import Link from "next/link";

type Category = {
  id: number;
  name: string;
};

async function getCategories(): Promise<Category[]> {
  const res = await fetch(`http://localhost:3000/api/auth/category`, {
    next: { revalidate: 300 },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch categories");
  }

  return res.json();
}

interface FilterProps {
  currentCategory?: string;
}

export default async function Filter({ currentCategory }: FilterProps) {
  const categories = await getCategories();

  return (
    <div className="mb-6 flex flex-wrap gap-2">
      {/* all */}
      <Link
        href="/posts"
        className={`rounded-full px-4 py-1.5 text-sm font-medium transition
          ${
            !currentCategory
              ? "bg-emerald-500 text-black"
              : "bg-neutral-900 text-gray-300 hover:bg-neutral-800"
          }`}
      >
        ทั้งหมด
      </Link>

      {categories.map((cat) => (
        <Link
          key={cat.id}
          href={`?categoryId=${cat.id}`}
          className={`rounded-full px-4 py-1.5 text-sm font-medium transition
            ${
              currentCategory === String(cat.id)
                ? "bg-emerald-500 text-black"
                : "bg-neutral-900 text-gray-300 hover:bg-neutral-800"
            }`}
        >
          {cat.name}
        </Link>
      ))}
    </div>
  );
}

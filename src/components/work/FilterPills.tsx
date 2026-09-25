import Link from "next/link";
import { projectTypes, typeLabels } from "@/data/content";
export default function FilterPills({ active }: { active?: string }) {
  return (
    <nav className="filter-pills" aria-label="Filter projects">
      <Link
        href="/work"
        className={!active ? "active" : ""}
        aria-current={!active ? "page" : undefined}
      >
        All
      </Link>
      {projectTypes.map((type) => (
        <Link
          key={type}
          href={`/work?type=${type}`}
          className={active === type ? "active" : ""}
          aria-current={active === type ? "page" : undefined}
        >
          {typeLabels[type]}
        </Link>
      ))}
    </nav>
  );
}

// app/useful_tools/ToolGroupList.tsx
import Link from "next/link";
import { ToolGroup } from "./tools";

export default function ToolGroupList({ groups }: { groups: ToolGroup[] }) {
  return (
    <div className="space-y-6">
      {groups.map((group) => (
        <section
          key={group.title}
          className="border rounded-lg bg-white shadow-sm p-4 md:p-6"
        >
          <h2 className="text-lg font-semibold text-gray-800">{group.title}</h2>

          {group.description && (
            <p className="mt-1 mb-4 text-sm text-gray-500">
              {group.description}
            </p>
          )}

          <div className="grid gap-3 sm:grid-cols-2">
            {group.items.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="block rounded-md border border-gray-200 p-3 hover:bg-gray-50 transition"
              >
                <div className="font-semibold text-gray-800">{item.title}</div>
                <div className="mt-1 text-sm text-gray-500">
                  {item.description}
                </div>
              </Link>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}

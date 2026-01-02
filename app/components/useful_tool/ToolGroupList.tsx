import Link from "next/link";
import { ToolGroup } from "./tools";

export default function ToolGroupList({ groups }: { groups: ToolGroup[] }) {
  return (
    <div className="space-y-10">
      {groups.map((group) => (
        <section key={group.title}>
          <div className="flex items-baseline justify-between">
            <h2 className="text-[11px] font-semibold tracking-wider text-zinc-500">
              {group.title}
            </h2>
          </div>

          {group.description && (
            <p className="mt-2 text-sm text-zinc-500 leading-relaxed">
              {group.description}
            </p>
          )}

          <div className="mt-4 border-t border-white/10" />

          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            {group.items.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="
                  group flex flex-col gap-1
                  rounded-md px-3 py-2
                  border border-white/10 bg-white/[0.02]
                  hover:bg-white/[0.05] hover:border-white/20
                  transition-colors
                "
                title={item.title}
              >
                <div className="flex items-center gap-2">
                  <span className="text-zinc-500 group-hover:text-zinc-300">
                    #
                  </span>
                  <div className="font-medium text-zinc-100">{item.title}</div>
                </div>

                {item.description && (
                  <div className="text-sm text-zinc-500 leading-relaxed">
                    {item.description}
                  </div>
                )}
              </Link>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}

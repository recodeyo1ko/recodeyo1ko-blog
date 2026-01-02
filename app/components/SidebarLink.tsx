import Link from "next/link";
import { ReactNode } from "react";

type Props = {
  href: string;
  children: ReactNode;
  className?: string;
  icon?: ReactNode;
};

export default function SidebarLink({
  href,
  children,
  className = "",
  icon,
}: Props) {
  return (
    <Link
      href={href}
      className={[
        "group flex items-center gap-2",
        "rounded-md px-2 py-1.5",
        "text-sm text-zinc-200",
        "hover:bg-white/5 active:bg-white/10",
        "transition-colors select-none",
        className,
      ].join(" ")}
    >
      {icon ? (
        <span className="w-5 shrink-0 text-zinc-500 group-hover:text-zinc-300">
          {icon}
        </span>
      ) : null}

      <span className="min-w-0 flex-1 truncate">{children}</span>
    </Link>
  );
}

import Link from "next/link";
import { ReactNode } from "react";

type Props = {
  href: string;
  children: ReactNode;
  className?: string;
  icon?: ReactNode;
  title?: string;
};

export default function SidebarLink({
  href,
  children,
  className = "",
  icon,
  title,
}: Props) {
  return (
    <Link
      href={href}
      title={title}
      className={[
        "group flex items-center gap-2",
        "rounded-md px-2 py-1.5",
        "text-sm text-zinc-100",
        "hover:bg-white/[0.06] active:bg-white/10",
        "transition-colors select-none",
        className,
      ].join(" ")}
    >
      {icon && (
        <span className="w-5 shrink-0 text-zinc-400 group-hover:text-zinc-200">
          {icon}
        </span>
      )}

      <span className="min-w-0 flex-1 truncate">{children}</span>
    </Link>
  );
}

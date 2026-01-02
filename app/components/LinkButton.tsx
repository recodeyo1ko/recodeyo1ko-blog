import Link from "next/link";
import { ReactNode } from "react";

type Props = {
  href: string;
  children: ReactNode;
  className?: string;
  variant?: "tag" | "category" | "sidebar";
  icon?: ReactNode;
};

export default function LinkButton({
  href,
  children,
  className = "",
  variant = "tag",
  icon,
}: Props) {
  if (variant === "sidebar") {
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

  const base =
    "inline-flex items-center px-2 py-1 rounded-md font-medium text-white " +
    "hover:bg-indigo-600 focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition";

  const styles =
    variant === "category"
      ? "bg-indigo-500 mr-2 my-2"
      : "bg-indigo-500 m-2 text-sm";

  return (
    <Link href={href} className={`${base} ${styles} ${className}`}>
      {children}
    </Link>
  );
}

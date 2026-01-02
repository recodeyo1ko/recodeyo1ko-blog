import Link from "next/link";
import { ReactNode } from "react";

type Props = {
  href: string;
  children: ReactNode;
  className?: string;
};

export default function PillLink({ href, children, className = "" }: Props) {
  return (
    <Link
      href={href}
      className={[
        "inline-flex items-center",
        "rounded-md px-2 py-0.5",
        "text-xs text-zinc-200",
        "border border-white/10 bg-white/[0.03]",
        "hover:bg-white/[0.06] hover:border-white/20",
        "transition-colors whitespace-nowrap",
        className,
      ].join(" ")}
    >
      {children}
    </Link>
  );
}

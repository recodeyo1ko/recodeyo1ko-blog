import Link from "next/link";
import { ReactNode } from "react";

type Props = {
  href: string;
  children: ReactNode;
  className?: string;
  variant?: "tag" | "category";
};

export default function LinkButton({
  href,
  children,
  className = "",
  variant = "tag",
}: Props) {
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

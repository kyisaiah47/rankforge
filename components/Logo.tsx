import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

export function LogoMark({ size = 24, className }: { size?: number; className?: string }) {
  return (
    <Image
      src="/logo.svg"
      alt="RankForge"
      width={size}
      height={size}
      className={cn("invert", className)}
    />
  );
}

export function LogoFull({ className, href = "/" }: { className?: string; href?: string }) {
  return (
    <Link href={href} className={cn("flex items-center gap-2.5", className)}>
      <LogoMark size={22} />
      <span className="font-bold tracking-tight text-foreground">RankForge</span>
    </Link>
  );
}

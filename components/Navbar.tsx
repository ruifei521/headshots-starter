import { Camera } from "lucide-react";
import Link from "next/link";
import NavbarClient from "./NavbarClient";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-[100] w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 sm:h-16 items-center justify-between gap-2 px-4">
        <Link href="/" className="flex items-center gap-2 font-bold text-base sm:text-xl min-w-0 shrink-0">
          <Camera className="h-5 w-5 text-primary shrink-0" />
          <span className="truncate">SnapProHead</span>
        </Link>

        <NavbarClient />
      </div>
    </header>
  );
}

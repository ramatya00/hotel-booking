import Image from "next/image";
import Link from "next/link";
import NavLink from "./navlink";

export default function Navbar() {
  return (
    <div className="fixed top-0 w-full bg-white shadow-sm z-20 py-3 px-3">
      <div className="max-w-screen-xl mx-auto flex flex-wrap items-center justify-between">
        <Link href="/">
          <Image src="/logo.png" alt="Logo" width={128} height={49} priority />
        </Link>
        <NavLink />
      </div>
    </div>
  );
}

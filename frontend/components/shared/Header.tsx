"use client";

import Image from "next/image";
import Link from "next/link";
import { ChevronDown, Menu, X } from "lucide-react";
import { useState } from "react";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => {
    setMenuOpen(false);
  };

  return (
    <header  >
    

      <div  >

        {/* LOGO */}
        <Link href="/" onClick={closeMenu}>
          <Image
            src="/logo.png"
            alt="My Carer"
            width={100}
            height={65}
            priority
          />
        </Link>

        {/* MOBILE MENU BUTTON */}
        <button
          type="button"

          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle navigation"
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* NAVIGATION */}
        <nav className={`max-[1050px]:gap-[20px] max-[768px]:hidden ${menuOpen ? "" : ""}`}>

          <Link className="max-[1050px]:text-[11px]" href="/" onClick={closeMenu}>
            Home
          </Link>

          <Link className="max-[1050px]:text-[11px]" href="#about" onClick={closeMenu}>
            About
          </Link>

          <Link className="max-[1050px]:text-[11px]"
            href="#platform"

            onClick={closeMenu}
          >
            Platform
            <ChevronDown size={12} />
          </Link>

          <Link className="max-[1050px]:text-[11px]" href="#jobs" onClick={closeMenu}>
            Job Listing
          </Link>

          <Link className="max-[1050px]:text-[11px]" href="#technology" onClick={closeMenu}>
            Care Technology
          </Link>

          <Link className="max-[1050px]:text-[11px]" href="#contact" onClick={closeMenu}>
            Contact
          </Link>

          <div  >

            <Link className="max-[1050px]:text-[11px]"
              href="#signin"

              onClick={closeMenu}
            >
              Sign In
            </Link>

            <Link className="max-[1050px]:text-[11px]"
              href="#register"

              onClick={closeMenu}
            >
              Register Today
              <span>›</span>
            </Link>

          </div>

        </nav>
      </div>
    </header>
  );
}
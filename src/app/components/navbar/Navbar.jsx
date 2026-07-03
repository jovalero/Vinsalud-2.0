"use client";
import Link from "next/link";
import React, { useState } from "react";
import Links from "./links/Links";
import LinksBurger from "./links/LinksBurger";

export default function Navbar() {
  const [isClick, setIsClick] = useState(false);

  const toggleNavbar = () => {
    setIsClick(!isClick);
  };

  const closeMenu = () => {
    setIsClick(false);
  };

  return (
    <header className="w-full bg-sky-600 border-b border-sky-500 shadow-md relative z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0 relative w-64 h-16 flex items-center">
            <Link href="/" className="absolute left-0 top-1/2 -translate-y-1/2 hover:opacity-90 transition block z-50">
              <img
                src="/logo.png"
                alt="Logo VinSalud"
                style={{ height: '140px', width: 'auto', maxHeight: 'none', maxWidth: 'none' }}
                className="object-contain"
              />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:block">
            <Links />
          </nav>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={toggleNavbar}
              type="button"
              className="inline-flex items-center justify-center p-2.5 rounded-xl text-white hover:text-sky-100 hover:bg-sky-700/50 focus:outline-none transition duration-200"
              aria-controls="mobile-menu"
              aria-expanded={isClick}
            >
              <span className="sr-only">Abrir menú principal</span>
              {isClick ? (
                <svg
                  className="h-6 w-6"
                  xmlns="https://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              ) : (
                <svg
                  className="h-6 w-6"
                  xmlns="https://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16m-7 6h7"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Dropdown */}
      <div
        id="mobile-menu"
        className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out border-sky-500 bg-sky-650 ${
          isClick ? "max-h-[400px] opacity-100 border-b p-4 bg-sky-600" : "max-h-0 opacity-0"
        }`}
      >
        <LinksBurger closeMenu={closeMenu} />
      </div>
    </header>
  );
}

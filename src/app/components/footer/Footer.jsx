"use client";
import { useAuth } from "@/app/context/AuthContext";
import Link from "next/link";
import React from "react";

export default function Footer() {
  const { isLoggedIn, logout } = useAuth();

  return (
    <footer className="bg-slate-900 border-t border-slate-800 text-slate-400">
      <div className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="md:flex md:justify-between md:items-start gap-8">
          {/* Brand/Logo Info */}
          <div className="mb-8 md:mb-0 max-w-sm">
            <Link href="/" className="flex items-center gap-2 mb-4 hover:opacity-90 transition">
              <img
                src="/logo.png"
                alt="Logo VinSalud"
                className="h-10 w-auto object-contain rounded"
              />
              <span className="font-extrabold text-xl tracking-tight text-white">
                VinSalud
              </span>
            </Link>
            <p className="text-sm text-slate-400 leading-relaxed">
              Centro Médico especializado en brindar atención de excelencia con tecnología avanzada y profesionales dedicados a cuidar de tu salud y la de tu familia.
            </p>
          </div>

          {/* Links Grid */}
          <div className="grid grid-cols-2 gap-8 sm:gap-6 sm:grid-cols-3">
            <div>
              <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white">
                Servicios
              </h2>
              <ul className="text-sm space-y-3">
                <li><span className="hover:text-sky-400 transition">Medicina General</span></li>
                <li><span className="hover:text-sky-400 transition">Pediatría</span></li>
                <li><span className="hover:text-sky-400 transition">Cardiología</span></li>
                <li><span className="hover:text-sky-400 transition">Ginecología</span></li>
              </ul>
            </div>
            <div>
              <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white">
                Navegación
              </h2>
              <ul className="text-sm space-y-3">
                <li>
                  <Link href="/" className="hover:text-sky-400 transition">
                    Inicio
                  </Link>
                </li>
                <li>
                  {isLoggedIn ? (
                    <button
                      onClick={logout}
                      className="text-left hover:text-sky-400 transition"
                    >
                      Cerrar Sesión
                    </button>
                  ) : (
                    <Link href="/Login" className="hover:text-sky-400 transition">
                      Iniciar Sesión
                    </Link>
                  )}
                </li>
              </ul>
            </div>
            <div>
              <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white">
                Contacto
              </h2>
              <ul className="text-sm space-y-3">
                <li><span className="block text-slate-300">Dirección:</span> Av. Amazonas N32-154, Quito, Ecuador</li>
                <li><span className="block text-slate-300">Teléfono:</span> +593 2-3456-789</li>
                <li><span className="block text-slate-300">Email:</span> contacto@vinsalud.com</li>
              </ul>
            </div>
          </div>
        </div>

        <hr className="my-8 border-slate-800" />

        <div className="sm:flex sm:items-center sm:justify-between">
          <span className="text-xs text-slate-500 sm:text-center">
            © {new Date().getFullYear()}{" "}
            <Link href="/" className="hover:underline text-slate-400">
              VinSalud
            </Link>
            . Todos los derechos reservados.
          </span>
          <div className="flex mt-4 sm:justify-center sm:mt-0 space-x-5">
            <span className="text-xs text-slate-600">
              Desarrollado con excelencia médica.
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}

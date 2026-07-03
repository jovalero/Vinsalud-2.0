import React from "react";
import { useAuth } from "@/app/context/AuthContext";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function LinksBurger({ closeMenu }) {
  const { isLoggedIn, logout, role } = useAuth();
  const pathname = usePathname();

  const routes = isLoggedIn
    ? [
        { path: "/", name: "Inicio" },
        ...(role === "medico"
          ? [
              { path: "/pacientes", name: "Pacientes" },
              { path: "/turnos", name: "Turnos" },
              { path: "/historial", name: "Historial" },
              { path: "/agenda", name: "Agenda" },
            ]
          : []),
        ...(role === "paciente"
          ? [
              { path: "/Contacto", name: "Contacto" },
              { path: "/proximo-turno", name: "Próximos Turnos" },
              { path: "/recetas", name: "Recetas" },
              { path: "/historial", name: "Mi Historial" },
            ]
          : []),
        ...(role === "admin"
          ? [
              { path: "/admin", name: "Panel Admin" },
            ]
          : []),
      ]
    : [
        { path: "/", name: "Inicio" },
        { path: "/#especialidades", name: "Especialidades" },
        { path: "/#instalaciones", name: "Instalaciones" },
        { path: "/Contacto", name: "Contacto" },
        { path: "/Login", name: "Iniciar Sesión" },
      ];

  return (
    <div className="flex flex-col space-y-2 py-2">
      {routes.map((route) => {
        const isActive = pathname === route.path;
        return (
          <Link
            key={route.name}
            href={route.path}
            onClick={closeMenu}
            className={`px-4 py-2.5 rounded-xl text-base font-semibold transition duration-200 block ${
              isActive
                ? "bg-sky-700 text-white border-l-4 border-white pl-3"
                : "text-sky-100 hover:bg-sky-700 hover:text-white"
            }`}
          >
            {route.name}
          </Link>
        );
      })}
      {isLoggedIn && (
        <button
          onClick={() => {
            logout();
            if (closeMenu) closeMenu();
          }}
          className="text-left w-full px-4 py-2.5 text-red-200 hover:bg-sky-700 hover:text-white rounded-xl text-base font-bold transition duration-200"
        >
          Cerrar Sesión
        </button>
      )}
    </div>
  );
}

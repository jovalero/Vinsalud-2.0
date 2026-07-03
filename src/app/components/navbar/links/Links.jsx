"use client";
import { useAuth } from "@/app/context/AuthContext";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";

export default function Links() {
  const { isLoggedIn, logout, role } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = () => {
    logout();
    router.push("/");
  };

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
    <div className="flex items-center space-x-2">
      {routes.map((route) => {
        const isActive = pathname === route.path;
        return (
          <Link
            key={route.name}
            href={route.path}
            className={`px-3 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
              isActive
                ? "bg-sky-700 text-white shadow-inner border border-sky-500"
                : "text-sky-100 hover:text-white hover:bg-sky-500/50"
            }`}
          >
            {route.name}
          </Link>
        );
      })}
      {isLoggedIn && (
        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 active:bg-red-700 text-white text-sm font-bold px-4 py-2 rounded-xl shadow-sm hover:shadow transition duration-200"
        >
          Cerrar Sesión
        </button>
      )}
    </div>
  );
}

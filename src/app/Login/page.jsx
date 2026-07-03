"use client";

import { useAuth } from "../context/AuthContext";
import { useRouter } from "next/navigation";
import { useState } from "react";
import React from "react";

const LoginPage = () => {
  const { login, register } = useAuth();
  const router = useRouter();
  const [isRegister, setIsRegister] = useState(false);

  // Campos para login y registro
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nombre, setNombre] = useState("");
  const [edad, setEdad] = useState("");
  const [telefono, setTelefono] = useState("");

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (isRegister) {
        if (!nombre || !email || !password || !edad || !telefono) {
          setError("Por favor, completa todos los campos.");
          setLoading(false);
          return;
        }

        const res = await register(email, password, nombre, edad, telefono);
        if (res.success) {
          alert(`Registro exitoso. ¡Bienvenido, ${nombre}!`);
          router.push("/");
        } else {
          setError(res.message);
        }
      } else {
        if (!email || !password) {
          setError("Por favor, completa el correo y la contraseña.");
          setLoading(false);
          return;
        }

        const success = await login(email, password);
        if (success) {
          router.push("/");
        } else {
          setError("Credenciales incorrectas. Inténtalo de nuevo.");
        }
      }
    } catch (err) {
      setError("Ocurrió un error inesperado. Inténtalo más tarde.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[90vh] px-4 py-12 bg-slate-50">
      <div className="bg-white shadow-xl rounded-2xl p-8 max-w-md w-full border border-sky-100 transition-all duration-300">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            {isRegister ? "Crear Cuenta" : "Iniciar Sesión"}
          </h1>
          <p className="text-sm text-slate-500 mt-2">
            {isRegister
              ? "Regístrate para ver tu historial y recetas digitales"
              : "Ingresa tus credenciales para acceder al sistema"}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {isRegister && (
            <>
              <div>
                <label
                  htmlFor="nombre"
                  className="block text-sm font-semibold text-slate-700"
                >
                  Nombre Completo
                </label>
                <input
                  type="text"
                  id="nombre"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  className="mt-1 block w-full px-4 py-2.5 border border-slate-200 rounded-xl shadow-sm focus:ring-2 focus:ring-sky-500 focus:border-sky-500 text-slate-800 placeholder-slate-400 transition"
                  placeholder="Juan Pérez"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="edad"
                    className="block text-sm font-semibold text-slate-700"
                  >
                    Edad
                  </label>
                  <input
                    type="number"
                    id="edad"
                    value={edad}
                    onChange={(e) => setEdad(e.target.value)}
                    className="mt-1 block w-full px-4 py-2.5 border border-slate-200 rounded-xl shadow-sm focus:ring-2 focus:ring-sky-500 focus:border-sky-500 text-slate-800 placeholder-slate-400 transition"
                    placeholder="30"
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="telefono"
                    className="block text-sm font-semibold text-slate-700"
                  >
                    Teléfono
                  </label>
                  <input
                    type="tel"
                    id="telefono"
                    value={telefono}
                    onChange={(e) => setTelefono(e.target.value)}
                    className="mt-1 block w-full px-4 py-2.5 border border-slate-200 rounded-xl shadow-sm focus:ring-2 focus:ring-sky-500 focus:border-sky-500 text-slate-800 placeholder-slate-400 transition"
                    placeholder="123456789"
                    required
                  />
                </div>
              </div>
            </>
          )}

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-semibold text-slate-700"
            >
              Correo Electrónico
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full px-4 py-2.5 border border-slate-200 rounded-xl shadow-sm focus:ring-2 focus:ring-sky-500 focus:border-sky-500 text-slate-800 placeholder-slate-400 transition"
              placeholder="correo@ejemplo.com"
              required
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-semibold text-slate-700"
            >
              Contraseña
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full px-4 py-2.5 border border-slate-200 rounded-xl shadow-sm focus:ring-2 focus:ring-sky-500 focus:border-sky-500 text-slate-800 placeholder-slate-400 transition"
              placeholder="••••••••"
              required
            />
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 text-sm px-4 py-2.5 rounded-xl border border-red-100">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-sky-600 text-white font-semibold py-3 px-4 rounded-xl hover:bg-sky-700 active:bg-sky-800 shadow-md hover:shadow-lg transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading
              ? "Cargando..."
              : isRegister
              ? "Registrarse y Entrar"
              : "Iniciar Sesión"}
          </button>
        </form>

        <div className="text-center mt-6">
          <button
            type="button"
            onClick={() => {
              setIsRegister(!isRegister);
              setError(null);
            }}
            className="text-sm font-semibold text-sky-600 hover:text-sky-700 hover:underline transition"
          >
            {isRegister
              ? "¿Ya tienes una cuenta? Inicia Sesión"
              : "¿No tienes cuenta? Regístrate aquí"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;

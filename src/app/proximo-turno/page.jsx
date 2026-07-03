"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";

export default function ProximosTurnosPage() {
  const { role, user } = useAuth();
  const [turnos, setTurnos] = useState([]);
  const [loading, setLoading] = useState(true);

  // Campos para agendar nuevo turno (paciente)
  const [fecha, setFecha] = useState("");
  const [hora, setHora] = useState("");
  const [guardando, setGuardando] = useState(false);

  const fetchMisTurnos = async () => {
    if (user?.email) {
      try {
        const res = await fetch(`/api/turnos?email=${user.email}`);
        if (res.ok) {
          const data = await res.json();
          setTurnos(data);
        }
      } catch (err) {
        console.error("Error al obtener mis turnos:", err);
      } finally {
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (role === "paciente") {
      fetchMisTurnos();
    }
  }, [role, user]);

  const handleAgendarTurno = async (e) => {
    e.preventDefault();
    if (!fecha || !hora) {
      alert("Por favor selecciona una fecha y una hora.");
      return;
    }

    setGuardando(true);
    try {
      const res = await fetch("/api/turnos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          pacienteNombre: user.nombre || "Paciente Registrado",
          email: user.email,
          fecha,
          hora,
        }),
      });

      if (res.ok) {
        alert("Turno solicitado con éxito.");
        setFecha("");
        setHora("");
        fetchMisTurnos();
      } else {
        alert("Error al solicitar el turno.");
      }
    } catch (err) {
      console.error("Error al agendar turno:", err);
    } finally {
      setGuardando(false);
    }
  };

  const handleCancelarTurno = async (id) => {
    if (!confirm("¿Estás seguro de que deseas cancelar este turno?")) {
      return;
    }

    try {
      const res = await fetch(`/api/turnos?id=${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        alert("Turno cancelado con éxito.");
        fetchMisTurnos();
      } else {
        alert("Error al cancelar turno.");
      }
    } catch (err) {
      console.error("Error al cancelar turno:", err);
    }
  };

  if (role !== "paciente") {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <div className="text-center p-8 bg-white border border-slate-100 shadow-md rounded-2xl max-w-sm">
          <p className="text-slate-500 font-medium">Esta sección está disponible únicamente para pacientes registrados.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-12">
      <div className="max-w-5xl mx-auto space-y-8">
        
        <div className="text-center md:text-left space-y-2">
          <div className="inline-block px-3 py-1 bg-sky-100 text-sky-700 text-xs font-bold uppercase tracking-wider rounded-full">
            Turnos en Línea
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Gestión de Mis Turnos
          </h1>
          <p className="text-slate-500 text-sm">
            Solicita nuevas citas médicas y visualiza o cancela tus consultas agendadas de forma instantánea.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* Formulario para agendar */}
          <div className="bg-white shadow-md border border-slate-100 rounded-2xl p-6 lg:col-span-1">
            <h2 className="text-xl font-bold text-slate-800 mb-4">Solicitar Nuevo Turno</h2>
            <form onSubmit={handleAgendarTurno} className="space-y-4">
              <div>
                <label htmlFor="fecha" className="block text-xs font-bold text-slate-600 uppercase">
                  Fecha Deseada
                </label>
                <input
                  type="date"
                  id="fecha"
                  value={fecha}
                  onChange={(e) => setFecha(e.target.value)}
                  className="mt-1 block w-full px-4 py-2 border border-slate-200 rounded-xl text-slate-800 text-sm focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition"
                  required
                />
              </div>

              <div>
                <label htmlFor="hora" className="block text-xs font-bold text-slate-600 uppercase">
                  Hora Deseada
                </label>
                <input
                  type="time"
                  id="hora"
                  value={hora}
                  onChange={(e) => setHora(e.target.value)}
                  className="mt-1 block w-full px-4 py-2 border border-slate-200 rounded-xl text-slate-800 text-sm focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition"
                  required
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={guardando}
                  className="w-full bg-sky-600 hover:bg-sky-700 text-white font-semibold py-2.5 px-4 rounded-xl shadow-sm hover:shadow transition duration-200"
                >
                  {guardando ? "Procesando..." : "Reservar Turno"}
                </button>
              </div>
            </form>
          </div>

          {/* Listado de próximos turnos */}
          <div className="bg-white shadow-md border border-slate-100 rounded-2xl p-6 lg:col-span-2 space-y-4">
            <h2 className="text-xl font-bold text-slate-800">Citas Programadas</h2>

            {loading ? (
              <p className="text-slate-500 text-sm py-4">Cargando turnos agendados...</p>
            ) : turnos.length > 0 ? (
              <div className="space-y-4">
                {turnos.map((turno) => (
                  <div
                    key={turno._id}
                    className="bg-slate-50 p-5 rounded-2xl border border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:shadow-sm transition"
                  >
                    <div className="space-y-1 text-left">
                      <span className="text-[10px] font-extrabold text-sky-600 uppercase tracking-wider block">
                        Cita Médica Confirmada
                      </span>
                      <h4 className="font-extrabold text-slate-800 text-lg">
                        Clínica General - VinSalud
                      </h4>
                      <div className="flex gap-4 text-xs text-slate-500">
                        <span><strong>Fecha:</strong> {turno.fecha}</span>
                        <span><strong>Hora:</strong> {turno.hora}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end border-t sm:border-t-0 pt-3 sm:pt-0 border-slate-100">
                      <span className="inline-block px-2.5 py-1 text-xs font-bold rounded-full bg-sky-100 text-sky-700">
                        {turno.estado || "Pendiente"}
                      </span>
                      <button
                        onClick={() => handleCancelarTurno(turno._id)}
                        className="bg-rose-50 border border-rose-100 text-rose-600 hover:bg-rose-100 font-semibold px-3 py-1.5 rounded-lg text-xs transition"
                      >
                        Cancelar
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                <p className="text-slate-500 text-sm">No tienes turnos programados en el sistema.</p>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}

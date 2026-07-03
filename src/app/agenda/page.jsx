"use client";
import { useState, useEffect } from "react";

const Agenda = () => {
  const [turnos, setTurnos] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchTurnos = async () => {
    try {
      const res = await fetch("/api/turnos");
      if (res.ok) {
        const data = await res.json();
        setTurnos(data);
      }
    } catch (err) {
      console.error("Error al obtener agenda:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTurnos();
  }, []);

  const actualizarEstado = async (id, nuevoEstado) => {
    try {
      const res = await fetch("/api/turnos", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ _id: id, estado: nuevoEstado }),
      });
      if (res.ok) {
        alert(`Turno marcado como ${nuevoEstado.toLowerCase()}.`);
        fetchTurnos();
      } else {
        alert("Error al actualizar el estado.");
      }
    } catch (err) {
      console.error("Error al actualizar turno:", err);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-12">
      <div className="max-w-4xl mx-auto space-y-8">
        
        <div className="text-center md:text-left space-y-2">
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Agenda del Día (Médico)
          </h1>
          <p className="text-slate-500 text-sm">
            Control de asistencia y seguimiento en tiempo real de los pacientes citados hoy.
          </p>
        </div>

        <div className="bg-white shadow-md border border-slate-100 rounded-2xl p-6 space-y-4">
          <h2 className="text-xl font-bold text-slate-800">Citas Programadas</h2>

          {loading ? (
            <p className="text-slate-500 text-sm py-4">Cargando agenda...</p>
          ) : turnos.length > 0 ? (
            <div className="overflow-x-auto rounded-xl border border-slate-100">
              <table className="min-w-full divide-y divide-slate-100">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase">Hora</th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase">Paciente</th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase">Fecha</th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase">Asistencia</th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {turnos.map((turno) => (
                    <tr key={turno._id} className="hover:bg-slate-50/50 transition">
                      <td className="px-6 py-4 text-sm font-bold text-slate-800">{turno.hora}</td>
                      <td className="px-6 py-4 text-sm font-semibold text-slate-700">{turno.pacienteNombre}</td>
                      <td className="px-6 py-4 text-sm text-slate-500">{turno.fecha}</td>
                      <td className="px-6 py-4 text-sm">
                        <span
                          className={`inline-block px-2.5 py-1 text-xs font-bold rounded-full ${
                            turno.estado === "Presente"
                              ? "bg-green-100 text-green-700"
                              : turno.estado === "Ausente"
                              ? "bg-red-100 text-red-700"
                              : "bg-amber-100 text-amber-700"
                          }`}
                        >
                          {turno.estado || "Pendiente"}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => actualizarEstado(turno._id, "Presente")}
                            className="bg-green-50 border border-green-100 text-green-600 hover:bg-green-100 font-semibold px-2.5 py-1.5 rounded-lg text-xs transition"
                          >
                            Presente
                          </button>
                          <button
                            onClick={() => actualizarEstado(turno._id, "Ausente")}
                            className="bg-rose-50 border border-rose-100 text-rose-600 hover:bg-rose-100 font-semibold px-2.5 py-1.5 rounded-lg text-xs transition"
                          >
                            Ausente
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
              <p className="text-slate-500 text-sm">No hay pacientes citados para hoy.</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default Agenda;

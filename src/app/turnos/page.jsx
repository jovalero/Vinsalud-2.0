"use client";
import { useState, useEffect } from "react";

const Turnos = () => {
  const [turnos, setTurnos] = useState([]);
  const [loading, setLoading] = useState(true);

  const [paciente, setPaciente] = useState("");
  const [fecha, setFecha] = useState("");
  const [hora, setHora] = useState("");

  const fetchTurnos = async () => {
    try {
      const res = await fetch("/api/turnos");
      if (res.ok) {
        const data = await res.json();
        setTurnos(data);
      }
    } catch (err) {
      console.error("Error al obtener turnos:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTurnos();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!paciente || !fecha || !hora) {
      alert("Por favor complete todos los campos.");
      return;
    }

    try {
      const res = await fetch("/api/turnos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          pacienteNombre: paciente,
          fecha,
          hora,
        }),
      });

      if (res.ok) {
        alert(`Turno para ${paciente} agendado con éxito.`);
        setPaciente("");
        setFecha("");
        setHora("");
        fetchTurnos();
      } else {
        alert("Error al agendar turno.");
      }
    } catch (err) {
      console.error("Error en submit de turno:", err);
    }
  };

  const eliminarTurno = async (id) => {
    if (!confirm("¿Deseas cancelar y eliminar este turno?")) {
      return;
    }
    try {
      const res = await fetch(`/api/turnos?id=${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        alert("Turno cancelado con éxito.");
        fetchTurnos();
      } else {
        alert("Error al cancelar turno.");
      }
    } catch (err) {
      console.error("Error al eliminar turno:", err);
    }
  };

  const marcarCompletado = async (id) => {
    try {
      const res = await fetch("/api/turnos", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ _id: id, estado: "Completado" }),
      });
      if (res.ok) {
        alert("Turno marcado como completado.");
        fetchTurnos();
      }
    } catch (err) {
      console.error("Error al actualizar turno:", err);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-12">
      <div className="max-w-5xl mx-auto space-y-8">
        
        <div className="text-center md:text-left space-y-2">
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Gestión de Turnos Médicos
          </h1>
          <p className="text-slate-500 text-sm">
            Panel del médico para programar, reprogramar, cancelar y registrar las citas diarias.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* Formulario de registro */}
          <div className="bg-white shadow-md border border-slate-100 rounded-2xl p-6 lg:col-span-1">
            <h2 className="text-xl font-bold text-slate-800 mb-4">
              Agendar Turno
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="paciente" className="block text-xs font-bold text-slate-600 uppercase">
                  Nombre del Paciente
                </label>
                <input
                  type="text"
                  id="paciente"
                  placeholder="Ej. Juan Pérez"
                  value={paciente}
                  onChange={(e) => setPaciente(e.target.value)}
                  className="mt-1 block w-full px-4 py-2 border border-slate-200 rounded-xl text-slate-800 text-sm focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition"
                  required
                />
              </div>

              <div>
                <label htmlFor="fecha" className="block text-xs font-bold text-slate-600 uppercase">
                  Fecha
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
                  Hora de Turno
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
                  className="w-full bg-sky-600 hover:bg-sky-700 text-white font-semibold py-2.5 px-4 rounded-xl shadow-sm hover:shadow transition duration-200"
                >
                  Confirmar Turno
                </button>
              </div>
            </form>
          </div>

          {/* Listado de turnos */}
          <div className="bg-white shadow-md border border-slate-100 rounded-2xl p-6 lg:col-span-2 space-y-4">
            <h2 className="text-xl font-bold text-slate-800">
              Turnos Registrados
            </h2>

            {loading ? (
              <p className="text-slate-500 text-sm py-4">Cargando turnos...</p>
            ) : turnos.length > 0 ? (
              <div className="overflow-x-auto rounded-xl border border-slate-100">
                <table className="min-w-full divide-y divide-slate-100">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase">Paciente</th>
                      <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase">Horario</th>
                      <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase">Estado</th>
                      <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {turnos.map((turno) => (
                      <tr key={turno._id} className="hover:bg-slate-50/50 transition">
                        <td className="px-6 py-4">
                          <span className="font-bold text-slate-800 text-sm">{turno.pacienteNombre}</span>
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-600">
                          <span className="block font-medium">{turno.fecha}</span>
                          <span className="text-xs text-slate-400">{turno.hora}</span>
                        </td>
                        <td className="px-6 py-4 text-sm">
                          <span
                            className={`inline-block px-2.5 py-1 text-xs font-bold rounded-full ${
                              turno.estado === "Completado"
                                ? "bg-green-100 text-green-700"
                                : "bg-sky-100 text-sky-700"
                            }`}
                          >
                            {turno.estado || "Pendiente"}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex gap-2">
                            {turno.estado !== "Completado" && (
                              <button
                                onClick={() => marcarCompletado(turno._id)}
                                className="bg-green-50 border border-green-100 text-green-600 hover:bg-green-100 font-semibold px-2 py-1 rounded-lg text-xs transition"
                              >
                                Completar
                              </button>
                            )}
                            <button
                              onClick={() => eliminarTurno(turno._id)}
                              className="bg-rose-50 border border-rose-100 text-rose-600 hover:bg-rose-100 font-semibold px-2 py-1 rounded-lg text-xs transition"
                            >
                              Cancelar
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
                <p className="text-slate-500 text-sm">No hay citas programadas actualmente.</p>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default Turnos;

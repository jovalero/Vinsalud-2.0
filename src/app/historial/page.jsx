"use client";

import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";

const Historial = () => {
  const { role, user } = useAuth();

  // Estados del Médico
  const [pacientes, setPacientes] = useState([]);
  const [pacienteSeleccionado, setPacienteSeleccionado] = useState(null);
  const [nota, setNota] = useState("");

  // Estados del Historial (Notas)
  const [historialNotas, setHistorialNotas] = useState([]);
  const [loading, setLoading] = useState(true);

  // 1. Cargar lista de pacientes (solo si es Médico)
  useEffect(() => {
    if (role === "medico") {
      const fetchPacientes = async () => {
        try {
          const res = await fetch("/api/pacientes");
          if (res.ok) {
            const data = await res.json();
            setPacientes(data);
          }
        } catch (err) {
          console.error("Error al obtener pacientes:", err);
        } finally {
          setLoading(false);
        }
      };
      fetchPacientes();
    }
  }, [role]);

  // 2. Cargar notas de historial (para el Médico cuando selecciona a un paciente)
  const seleccionarPaciente = async (paciente) => {
    setPacienteSeleccionado(paciente);
    setLoading(true);
    try {
      const res = await fetch(`/api/historial?pacienteId=${paciente._id}`);
      if (res.ok) {
        const data = await res.json();
        setHistorialNotas(data);
      }
    } catch (err) {
      console.error("Error al obtener historial del paciente:", err);
    } finally {
      setLoading(false);
    }
  };

  // 3. Cargar notas de historial (para el Paciente directamente al montar)
  useEffect(() => {
    if (role === "paciente" && user?.email) {
      const fetchMiHistorial = async () => {
        try {
          const res = await fetch(`/api/historial?email=${user.email}`);
          if (res.ok) {
            const data = await res.json();
            setHistorialNotas(data);
          }
        } catch (err) {
          console.error("Error al obtener mi historial:", err);
        } finally {
          setLoading(false);
        }
      };
      fetchMiHistorial();
    }
  }, [role, user]);

  const handleChange = (e) => {
    setNota(e.target.value);
  };

  // 4. Agregar nueva nota clínica (solo Médico)
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!nota.trim() || !pacienteSeleccionado) {
      alert("Por favor, selecciona un paciente y escribe una observación.");
      return;
    }

    try {
      const res = await fetch("/api/historial", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          pacienteId: pacienteSeleccionado._id,
          notas: nota.trim(),
          medicoId: user?._id || "u-ana",
        }),
      });

      if (res.ok) {
        alert(`Nota guardada para ${pacienteSeleccionado.nombre}.`);
        setNota("");
        // Recargar notas del paciente actual
        const resHistorial = await fetch(`/api/historial?pacienteId=${pacienteSeleccionado._id}`);
        if (resHistorial.ok) {
          const data = await resHistorial.json();
          setHistorialNotas(data);
        }
      } else {
        alert("Error al guardar nota clínica.");
      }
    } catch (err) {
      console.error("Error en submit de nota:", err);
    }
  };

  // Render para el Paciente
  if (role === "paciente") {
    return (
      <div className="min-h-screen bg-slate-50 px-4 py-12">
        <div className="max-w-3xl mx-auto space-y-8">
          
          <div className="text-center space-y-2">
            <div className="inline-block px-3 py-1 bg-sky-100 text-sky-700 text-xs font-bold uppercase tracking-wider rounded-full">
              Historial del Paciente
            </div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Mi Historial Médico
            </h1>
            <p className="text-slate-500 text-sm">
              Consulta las observaciones clínicas y evolución médica registrada por tus profesionales.
            </p>
          </div>

          <div className="bg-white shadow-md border border-slate-100 rounded-2xl p-6 md:p-8 space-y-6">
            <h2 className="text-xl font-bold text-slate-800 border-b border-slate-100 pb-4">
              Línea de Tiempo de Consultas
            </h2>

            {loading ? (
              <p className="text-slate-500 text-sm py-4">Cargando historial clínico...</p>
            ) : historialNotas.length > 0 ? (
              <div className="relative pl-6 border-l-2 border-sky-100 space-y-8">
                {historialNotas.map((h) => (
                  <div key={h._id} className="relative">
                    {/* Bullet */}
                    <span className="absolute -left-[31px] top-1.5 bg-sky-500 border-4 border-white rounded-full w-4 h-4 shadow-sm"></span>
                    
                    <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 space-y-2">
                      <div className="flex justify-between items-center flex-wrap gap-2">
                        <span className="text-xs font-extrabold text-sky-600 tracking-wide uppercase">
                          Consulta Médica
                        </span>
                        <span className="text-xs text-slate-400 font-semibold">{h.fecha}</span>
                      </div>
                      <p className="text-sm text-slate-700 leading-relaxed font-medium">
                        {h.notas}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                <p className="text-slate-500 text-sm">Aún no se registran notas clínicas en tu historial.</p>
              </div>
            )}
          </div>

        </div>
      </div>
    );
  }

  // Render para el Médico
  return (
    <div className="min-h-screen bg-slate-50 px-4 py-12">
      <div className="max-w-5xl mx-auto space-y-8">
        
        <div className="text-center md:text-left space-y-2">
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Historiales Clínicos de Pacientes
          </h1>
          <p className="text-slate-500 text-sm">
            Visualización del historial cronológico y registro de nuevas observaciones médicas.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* Seleccionar paciente */}
          <div className="bg-white shadow-md border border-slate-100 rounded-2xl p-6 lg:col-span-1 space-y-4">
            <h2 className="text-xl font-bold text-slate-800 border-b border-slate-100 pb-2">
              Pacientes
            </h2>
            
            {loading && pacientes.length === 0 ? (
              <p className="text-slate-500 text-sm">Cargando pacientes...</p>
            ) : pacientes.length > 0 ? (
              <div className="flex flex-col gap-2 max-h-[400px] overflow-y-auto pr-1">
                {pacientes.map((paciente) => (
                  <button
                    key={paciente._id}
                    onClick={() => seleccionarPaciente(paciente)}
                    className={`w-full text-left px-4 py-3 rounded-xl text-sm font-semibold transition duration-200 ${
                      pacienteSeleccionado?._id === paciente._id
                        ? "bg-sky-600 text-white shadow"
                        : "bg-slate-50 text-slate-700 hover:bg-slate-100"
                    }`}
                  >
                    <span className="block">{paciente.nombre}</span>
                    <span className={`text-xs block ${
                      pacienteSeleccionado?._id === paciente._id ? "text-sky-100" : "text-slate-400"
                    }`}>
                      {paciente.correo}
                    </span>
                  </button>
                ))}
              </div>
            ) : (
              <p className="text-slate-500 text-sm">No hay pacientes cargados.</p>
            )}
          </div>

          {/* Área de notas del historial */}
          <div className="bg-white shadow-md border border-slate-100 rounded-2xl p-6 lg:col-span-2 space-y-6">
            {pacienteSeleccionado ? (
              <>
                <div className="border-b border-slate-100 pb-4">
                  <h3 className="text-2xl font-extrabold text-slate-800">
                    Historial de {pacienteSeleccionado.nombre}
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Correo: {pacienteSeleccionado.correo} | Teléfono: {pacienteSeleccionado.telefono}
                  </p>
                </div>

                {/* Formulario para añadir Nota */}
                <form onSubmit={handleSubmit} className="bg-slate-50 p-5 rounded-2xl border border-slate-100 space-y-4">
                  <label htmlFor="nota" className="block text-sm font-bold text-slate-700">
                    Registrar Evolución / Nota Médica
                  </label>
                  <textarea
                    id="nota"
                    rows="3"
                    value={nota}
                    onChange={handleChange}
                    placeholder="Escriba aquí los detalles de la consulta, síntomas, examen físico o plan de tratamiento..."
                    className="w-full p-4 border border-slate-200 rounded-xl text-slate-800 text-sm focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition"
                    required
                  ></textarea>
                  <button
                    type="submit"
                    className="bg-sky-600 hover:bg-sky-700 text-white font-semibold py-2 px-6 rounded-xl shadow-sm hover:shadow transition duration-200"
                  >
                    Guardar Nota Clínica
                  </button>
                </form>

                {/* Mostrar notas guardadas */}
                <div className="space-y-4">
                  <h4 className="text-lg font-bold text-slate-800">Evoluciones Clínicas</h4>
                  
                  {loading ? (
                    <p className="text-slate-500 text-sm">Cargando evoluciones...</p>
                  ) : historialNotas.length > 0 ? (
                    <div className="relative pl-6 border-l-2 border-sky-100 space-y-6">
                      {historialNotas.map((item) => (
                        <div key={item._id} className="relative">
                          {/* Bullet */}
                          <span className="absolute -left-[31px] top-1.5 bg-sky-500 border-4 border-white rounded-full w-4 h-4"></span>
                          
                          <div className="bg-slate-50/50 p-4 rounded-xl border border-slate-100 space-y-1">
                            <span className="text-xs text-slate-400 font-bold block">{item.fecha}</span>
                            <p className="text-sm text-slate-700 leading-relaxed font-medium">
                              {item.notas}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-slate-400 text-sm italic">No hay notas registradas para este paciente.</p>
                  )}
                </div>
              </>
            ) : (
              <div className="text-center py-20 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                <div className="p-4 bg-sky-50 rounded-full inline-block text-sky-500 mb-3">
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h4 className="font-extrabold text-slate-800 text-lg">Historial Clínico</h4>
                <p className="text-sm text-slate-500 max-w-xs mx-auto mt-1">
                  Por favor, seleccione un paciente de la lista lateral para visualizar o registrar evoluciones clínicas.
                </p>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default Historial;

"use client";
import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";

const Pacientes = () => {
  const { user } = useAuth();
  const [pacientes, setPacientes] = useState([]);
  const [loading, setLoading] = useState(true);

  // Campos de paciente
  const [nombre, setNombre] = useState("");
  const [edad, setEdad] = useState("");
  const [telefono, setTelefono] = useState("");
  const [correo, setCorreo] = useState("");
  const [editando, setEditando] = useState(null);

  // Estados de Receta Digital (Modal)
  const [pacienteParaReceta, setPacienteParaReceta] = useState(null);
  const [medicamento, setMedicamento] = useState("");
  const [dosis, setDosis] = useState("");
  const [indicaciones, setIndicaciones] = useState("");
  const [guardandoReceta, setGuardandoReceta] = useState(false);

  // Obtener pacientes de la API
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

  useEffect(() => {
    fetchPacientes();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!nombre || !edad || !telefono || !correo) {
      alert("Por favor complete todos los campos.");
      return;
    }

    try {
      if (editando) {
        const res = await fetch("/api/pacientes", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ _id: editando, nombre, edad, telefono, correo }),
        });
        if (res.ok) {
          alert(`Paciente ${nombre} actualizado con éxito.`);
          setEditando(null);
          fetchPacientes();
        } else {
          alert("Error al actualizar paciente.");
        }
      } else {
        const res = await fetch("/api/pacientes", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ nombre, edad, telefono, correo }),
        });
        if (res.ok) {
          alert(`Paciente ${nombre} registrado con éxito.`);
          fetchPacientes();
        } else {
          alert("Error al registrar paciente.");
        }
      }

      setNombre("");
      setEdad("");
      setTelefono("");
      setCorreo("");
    } catch (err) {
      console.error("Error en submit de paciente:", err);
    }
  };

  const eliminarPaciente = async (id, nombrePaciente) => {
    if (!confirm(`¿Estás seguro de que deseas eliminar al paciente ${nombrePaciente}?`)) {
      return;
    }
    try {
      const res = await fetch(`/api/pacientes?id=${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        alert("Paciente eliminado con éxito.");
        fetchPacientes();
      } else {
        alert("Error al eliminar paciente.");
      }
    } catch (err) {
      console.error("Error al eliminar paciente:", err);
    }
  };

  const editarPaciente = (paciente) => {
    setNombre(paciente.nombre);
    setEdad(paciente.edad);
    setTelefono(paciente.telefono);
    setCorreo(paciente.correo);
    setEditando(paciente._id);
  };

  // Guardar receta digital en API
  const handleGuardarReceta = async (e) => {
    e.preventDefault();
    if (!medicamento || !dosis || !pacienteParaReceta) {
      alert("Por favor completa los campos principales de la receta.");
      return;
    }

    setGuardandoReceta(true);
    try {
      const res = await fetch("/api/recetas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          pacienteId: pacienteParaReceta._id,
          medicamento,
          dosis,
          indicaciones,
          medicoId: user?._id || "u-ana",
        }),
      });

      if (res.ok) {
        alert(`Receta emitida con éxito para ${pacienteParaReceta.nombre}.`);
        setPacienteParaReceta(null);
        setMedicamento("");
        setDosis("");
        setIndicaciones("");
      } else {
        alert("Error al emitir la receta digital.");
      }
    } catch (err) {
      console.error("Error al emitir receta:", err);
    } finally {
      setGuardandoReceta(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-12">
      <div className="max-w-6xl mx-auto space-y-8">
        
        <div className="text-center md:text-left space-y-2">
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Gestión de Fichas de Pacientes
          </h1>
          <p className="text-slate-500 text-sm">
            Panel clínico de registro, edición de datos personales y emisión de recetas digitales.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* Formulario de registro/edición */}
          <div className="bg-white shadow-md border border-slate-100 rounded-2xl p-6 lg:col-span-1">
            <h2 className="text-xl font-bold text-slate-800 mb-4">
              {editando ? "Editar Paciente" : "Registrar Nuevo Paciente"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="nombre" className="block text-xs font-bold text-slate-600 uppercase">
                  Nombre Completo
                </label>
                <input
                  type="text"
                  id="nombre"
                  placeholder="Nombre completo"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  className="mt-1 block w-full px-4 py-2 border border-slate-200 rounded-xl text-slate-800 text-sm focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition"
                  required
                />
              </div>

              <div>
                <label htmlFor="edad" className="block text-xs font-bold text-slate-600 uppercase">
                  Edad
                </label>
                <input
                  type="number"
                  id="edad"
                  placeholder="Edad"
                  value={edad}
                  onChange={(e) => setEdad(e.target.value)}
                  className="mt-1 block w-full px-4 py-2 border border-slate-200 rounded-xl text-slate-800 text-sm focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition"
                  required
                />
              </div>

              <div>
                <label htmlFor="telefono" className="block text-xs font-bold text-slate-600 uppercase">
                  Teléfono
                </label>
                <input
                  type="text"
                  id="telefono"
                  placeholder="Teléfono"
                  value={telefono}
                  onChange={(e) => setTelefono(e.target.value)}
                  className="mt-1 block w-full px-4 py-2 border border-slate-200 rounded-xl text-slate-800 text-sm focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition"
                  required
                />
              </div>

              <div>
                <label htmlFor="correo" className="block text-xs font-bold text-slate-600 uppercase">
                  Correo Electrónico
                </label>
                <input
                  type="email"
                  id="correo"
                  placeholder="Correo electrónico"
                  value={correo}
                  onChange={(e) => setCorreo(e.target.value)}
                  className="mt-1 block w-full px-4 py-2 border border-slate-200 rounded-xl text-slate-800 text-sm focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition"
                  required
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full bg-sky-600 hover:bg-sky-700 text-white font-semibold py-2.5 px-4 rounded-xl shadow-sm hover:shadow transition duration-200"
                >
                  {editando ? "Guardar Cambios" : "Añadir Ficha"}
                </button>
                {editando && (
                  <button
                    type="button"
                    onClick={() => {
                      setEditando(null);
                      setNombre("");
                      setEdad("");
                      setTelefono("");
                      setCorreo("");
                    }}
                    className="w-full border border-slate-200 text-slate-500 hover:bg-slate-50 font-semibold py-2.5 px-4 rounded-xl mt-2 transition duration-200"
                  >
                    Cancelar Edición
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* Tabla de pacientes */}
          <div className="bg-white shadow-md border border-slate-100 rounded-2xl p-6 lg:col-span-2 space-y-4">
            <h2 className="text-xl font-bold text-slate-800">
              Listado de Pacientes
            </h2>

            {loading ? (
              <p className="text-slate-500 text-sm py-4">Cargando registros...</p>
            ) : pacientes.length > 0 ? (
              <div className="overflow-x-auto rounded-xl border border-slate-100">
                <table className="min-w-full divide-y divide-slate-100">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase">Nombre</th>
                      <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase">Edad</th>
                      <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase">Contacto</th>
                      <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {pacientes.map((paciente) => (
                      <tr key={paciente._id} className="hover:bg-slate-50/50 transition">
                        <td className="px-6 py-4">
                          <span className="font-bold text-slate-800 text-sm block">{paciente.nombre}</span>
                          <span className="text-xs text-slate-400">{paciente.correo}</span>
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-600">{paciente.edad} años</td>
                        <td className="px-6 py-4 text-sm text-slate-600">{paciente.telefono}</td>
                        <td className="px-6 py-4">
                          <div className="flex flex-wrap gap-1.5">
                            <button
                              onClick={() => setPacienteParaReceta(paciente)}
                              className="bg-sky-50 border border-sky-100 text-sky-600 hover:bg-sky-100 font-semibold px-2.5 py-1.5 rounded-lg text-xs transition"
                            >
                              Receta
                            </button>
                            <button
                              onClick={() => editarPaciente(paciente)}
                              className="bg-amber-50 border border-amber-100 text-amber-600 hover:bg-amber-100 font-semibold px-2.5 py-1.5 rounded-lg text-xs transition"
                            >
                              Editar
                            </button>
                            <button
                              onClick={() => eliminarPaciente(paciente._id, paciente.nombre)}
                              className="bg-rose-50 border border-rose-100 text-rose-600 hover:bg-rose-100 font-semibold px-2.5 py-1.5 rounded-lg text-xs transition"
                            >
                              Baja
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
                <p className="text-slate-500 text-sm">No hay fichas de pacientes registradas.</p>
              </div>
            )}
          </div>
        </div>

        {/* Modal para emitir Receta Digital */}
        {pacienteParaReceta && (
          <div className="fixed inset-0 bg-slate-900/40 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-xl border border-slate-100 max-w-md w-full overflow-hidden transition-all duration-300">
              <div className="bg-sky-600 text-white px-6 py-4 flex justify-between items-center">
                <h3 className="font-bold text-lg">Emitir Receta Digital</h3>
                <button
                  onClick={() => setPacienteParaReceta(null)}
                  className="text-white hover:opacity-80 transition"
                >
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <form onSubmit={handleGuardarReceta} className="p-6 space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase">Paciente Receptor</label>
                  <p className="font-extrabold text-slate-800 text-base mt-1">{pacienteParaReceta.nombre}</p>
                  <p className="text-xs text-slate-400">{pacienteParaReceta.correo}</p>
                </div>

                <div>
                  <label htmlFor="medicamento" className="block text-xs font-bold text-slate-600 uppercase">
                    Medicamento / Fármaco
                  </label>
                  <input
                    type="text"
                    id="medicamento"
                    placeholder="Ej. Paracetamol 500mg, Amoxicilina"
                    value={medicamento}
                    onChange={(e) => setMedicamento(e.target.value)}
                    className="mt-1 block w-full px-4 py-2 border border-slate-200 rounded-xl text-slate-800 text-sm focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="dosis" className="block text-xs font-bold text-slate-600 uppercase">
                    Dosificación
                  </label>
                  <input
                    type="text"
                    id="dosis"
                    placeholder="Ej. 1 comprimido cada 8 horas"
                    value={dosis}
                    onChange={(e) => setDosis(e.target.value)}
                    className="mt-1 block w-full px-4 py-2 border border-slate-200 rounded-xl text-slate-800 text-sm focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="indicaciones" className="block text-xs font-bold text-slate-600 uppercase">
                    Indicaciones Adicionales
                  </label>
                  <textarea
                    id="indicaciones"
                    rows="3"
                    placeholder="Ej. Tomar después de las comidas principales durante 7 días."
                    value={indicaciones}
                    onChange={(e) => setIndicaciones(e.target.value)}
                    className="mt-1 block w-full px-4 py-2 border border-slate-200 rounded-xl text-slate-800 text-sm focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition"
                  ></textarea>
                </div>

                <div className="flex gap-3 pt-3">
                  <button
                    type="button"
                    onClick={() => setPacienteParaReceta(null)}
                    className="w-1/2 border border-slate-200 text-slate-500 hover:bg-slate-50 font-semibold py-2.5 rounded-xl transition"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={guardandoReceta}
                    className="w-1/2 bg-sky-600 hover:bg-sky-700 disabled:opacity-50 text-white font-semibold py-2.5 rounded-xl transition shadow-sm hover:shadow"
                  >
                    {guardandoReceta ? "Guardando..." : "Emitir Receta"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default Pacientes;

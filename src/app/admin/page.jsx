"use client";
import React, { useEffect, useState } from "react";
import { useAuth } from "@/app/context/AuthContext";
import { useRouter } from "next/navigation";

export default function AdminPage() {
  const { isLoggedIn, role, user } = useAuth();
  const router = useRouter();
  
  // Tabs: overview | create | users | turnos | recetas | historial
  const [activeTab, setActiveTab] = useState("overview");

  // State collections
  const [users, setUsers] = useState([]);
  const [pacientes, setPacientes] = useState([]);
  const [turnos, setTurnos] = useState([]);
  const [recetas, setRecetas] = useState([]);
  const [historial, setHistorial] = useState([]);

  // Loadings
  const [loading, setLoading] = useState(true);

  // Forms - Create User
  const [newUserRole, setNewUserRole] = useState("paciente");
  const [newUserData, setNewUserData] = useState({
    nombre: "",
    email: "",
    password: "",
    edad: "",
    telefono: "",
    especialidad: ""
  });
  const [formStatus, setFormStatus] = useState({ type: "", message: "" });

  // Modal - Edit States
  const [editModal, setEditModal] = useState({
    isOpen: false,
    type: "", // user | paciente | turno | receta | historial
    data: null
  });
  const [modalStatus, setModalStatus] = useState({ type: "", message: "" });

  // Fetch all databases
  const fetchData = async () => {
    setLoading(true);
    try {
      const [uRes, pRes, tRes, rRes, hRes] = await Promise.all([
        fetch("/api/users"),
        fetch("/api/pacientes"),
        fetch("/api/turnos"),
        fetch("/api/recetas"),
        fetch("/api/historial")
      ]);

      const [uData, pData, tData, rData, hData] = await Promise.all([
        uRes.json(),
        pRes.json(),
        tRes.json(),
        rRes.json(),
        hRes.json()
      ]);

      setUsers(Array.isArray(uData) ? uData : []);
      setPacientes(Array.isArray(pData) ? pData : []);
      setTurnos(Array.isArray(tData) ? tData : []);
      setRecetas(Array.isArray(rData) ? rData : []);
      setHistorial(Array.isArray(hData) ? hData : []);
    } catch (error) {
      console.error("Error al cargar colecciones de datos:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isLoggedIn || role !== "admin") {
      router.push("/Login");
      return;
    }
    fetchData();
  }, [isLoggedIn, role, router]);

  if (!isLoggedIn || role !== "admin") {
    return null;
  }

  // Handle register user
  const handleCreateUser = async (e) => {
    e.preventDefault();
    setFormStatus({ type: "", message: "" });
    
    try {
      const response = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: newUserData.email,
          password: newUserData.password,
          role: newUserRole,
          nombre: newUserData.nombre,
          edad: newUserRole === "paciente" ? newUserData.edad : undefined,
          telefono: newUserRole === "paciente" ? newUserData.telefono : undefined,
        })
      });

      const resData = await response.json();
      if (!response.ok) {
        throw new Error(resData.error || "Error al registrar usuario");
      }

      setFormStatus({ type: "success", message: `Usuario ${resData.nombre} creado correctamente.` });
      setNewUserData({ nombre: "", email: "", password: "", edad: "", telefono: "", especialidad: "" });
      fetchData(); // Recargar datos
    } catch (err) {
      setFormStatus({ type: "error", message: err.message });
    }
  };

  // Delete records handler
  const handleDeleteRecord = async (type, id) => {
    if (!confirm(`¿Está seguro que desea eliminar este registro? Esta acción es irreversible.`)) {
      return;
    }

    try {
      let endpoint = "";
      if (type === "user") endpoint = `/api/users/${id}`;
      else if (type === "paciente") endpoint = `/api/pacientes/${id}`;
      else if (type === "turno") endpoint = `/api/turnos/${id}`;
      else if (type === "receta") endpoint = `/api/recetas/${id}`;
      else if (type === "historial") endpoint = `/api/historial/${id}`;

      const res = await fetch(endpoint, { method: "DELETE" });
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Error al eliminar");
      fetchData(); // Recargar datos
    } catch (err) {
      alert(`Error al eliminar: ${err.message}`);
    }
  };

  // Open Edit Modal
  const openEdit = (type, data) => {
    setModalStatus({ type: "", message: "" });
    setEditModal({ isOpen: true, type, data: { ...data } });
  };

  // Submit Edit changes
  const handleSaveEdit = async (e) => {
    e.preventDefault();
    setModalStatus({ type: "", message: "" });
    const { type, data } = editModal;
    
    try {
      let endpoint = "";
      if (type === "user") endpoint = `/api/users/${data._id}`;
      else if (type === "paciente") endpoint = `/api/pacientes/${data._id}`;
      else if (type === "turno") endpoint = `/api/turnos/${data._id}`;
      else if (type === "receta") endpoint = `/api/recetas/${data._id}`;
      else if (type === "historial") endpoint = `/api/historial/${data._id}`;

      const res = await fetch(endpoint, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });
      const resData = await res.json();

      if (!res.ok) throw new Error(resData.error || "Error al guardar");

      setEditModal({ isOpen: false, type: "", data: null });
      fetchData(); // Recargar
    } catch (err) {
      setModalStatus({ type: "error", message: err.message });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Top Header Card */}
        <div className="bg-white rounded-3xl p-8 border border-sky-100 shadow-sm flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
          <div>
            <span className="text-xs font-bold text-sky-600 bg-sky-50 px-3 py-1 rounded-full uppercase tracking-wider">
              Panel Administrativo Global
            </span>
            <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight mt-2">
              Consola del Administrador
            </h1>
            <p className="text-slate-500 text-sm mt-1">
              Control clínico total: administración de cuentas, historiales médicos, recetas y turnos en VinSalud.
            </p>
          </div>
          <div className="flex gap-4">
            <button 
              onClick={fetchData}
              className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm rounded-2xl transition duration-200 shadow-sm"
            >
              🔄 Recargar Base de Datos
            </button>
            <div className="bg-sky-50 px-4 py-2.5 rounded-2xl border border-sky-100 flex items-center gap-3">
              <div className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-xs font-bold text-sky-800">Servidor NoSQL: Conectado</span>
            </div>
          </div>
        </div>

        {/* Tab Navigation Menu */}
        <div className="flex overflow-x-auto gap-2 bg-white p-2 rounded-2xl border border-sky-100/50 shadow-sm scrollbar-none">
          <button
            onClick={() => setActiveTab("overview")}
            className={`px-4 py-2.5 rounded-xl font-bold text-sm transition ${
              activeTab === "overview" ? "bg-sky-600 text-white shadow" : "text-slate-600 hover:bg-slate-50"
            }`}
          >
            📊 Resumen
          </button>
          <button
            onClick={() => setActiveTab("create")}
            className={`px-4 py-2.5 rounded-xl font-bold text-sm transition ${
              activeTab === "create" ? "bg-sky-600 text-white shadow" : "text-slate-600 hover:bg-slate-50"
            }`}
          >
            ➕ Registrar Médico/Paciente
          </button>
          <button
            onClick={() => setActiveTab("users")}
            className={`px-4 py-2.5 rounded-xl font-bold text-sm transition ${
              activeTab === "users" ? "bg-sky-600 text-white shadow" : "text-slate-600 hover:bg-slate-50"
            }`}
          >
            👥 Gestión Usuarios ({users.length})
          </button>
          <button
            onClick={() => setActiveTab("turnos")}
            className={`px-4 py-2.5 rounded-xl font-bold text-sm transition ${
              activeTab === "turnos" ? "bg-sky-600 text-white shadow" : "text-slate-600 hover:bg-slate-50"
            }`}
          >
            📅 Gestión Turnos ({turnos.length})
          </button>
          <button
            onClick={() => setActiveTab("recetas")}
            className={`px-4 py-2.5 rounded-xl font-bold text-sm transition ${
              activeTab === "recetas" ? "bg-sky-600 text-white shadow" : "text-slate-600 hover:bg-slate-50"
            }`}
          >
            💊 Gestión Recetas ({recetas.length})
          </button>
          <button
            onClick={() => setActiveTab("historial")}
            className={`px-4 py-2.5 rounded-xl font-bold text-sm transition ${
              activeTab === "historial" ? "bg-sky-600 text-white shadow" : "text-slate-600 hover:bg-slate-50"
            }`}
          >
            📁 Gestión Historial ({historial.length})
          </button>
        </div>

        {/* -------------------- TAB 1: OVERVIEW -------------------- */}
        {activeTab === "overview" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-white rounded-3xl p-6 border border-sky-100 shadow-sm space-y-2">
                <span className="text-slate-400 text-xs font-bold uppercase tracking-wider block">Usuarios</span>
                <span className="text-4xl font-extrabold text-slate-800 block">{users.length}</span>
                <span className="text-xs text-slate-500">Médicos, Pacientes y Administradores</span>
              </div>
              <div className="bg-white rounded-3xl p-6 border border-sky-100 shadow-sm space-y-2">
                <span className="text-slate-400 text-xs font-bold uppercase tracking-wider block">Turnos Agendados</span>
                <span className="text-4xl font-extrabold text-sky-600 block">{turnos.length}</span>
                <span className="text-xs text-slate-500">
                  {turnos.filter(t => t.estado === "Pendiente").length} citas pendientes
                </span>
              </div>
              <div className="bg-white rounded-3xl p-6 border border-sky-100 shadow-sm space-y-2">
                <span className="text-slate-400 text-xs font-bold uppercase tracking-wider block">Recetas Emitidas</span>
                <span className="text-4xl font-extrabold text-teal-600 block">{recetas.length}</span>
                <span className="text-xs text-slate-500">Recetas digitales activas</span>
              </div>
              <div className="bg-white rounded-3xl p-6 border border-sky-100 shadow-sm space-y-2">
                <span className="text-slate-400 text-xs font-bold uppercase tracking-wider block">Evoluciones Médicas</span>
                <span className="text-4xl font-extrabold text-purple-600 block">{historial.length}</span>
                <span className="text-xs text-slate-500">Registros en el historial clínico</span>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recientes */}
              <div className="bg-white rounded-3xl p-6 border border-sky-100 shadow-sm space-y-4">
                <h3 className="text-lg font-bold text-slate-800">Próximos Turnos</h3>
                <div className="space-y-3">
                  {turnos.slice(0, 4).map(t => (
                    <div key={t._id} className="flex justify-between items-center p-3.5 bg-slate-50 rounded-2xl">
                      <div>
                        <p className="text-sm font-bold text-slate-800">{t.pacienteNombre}</p>
                        <p className="text-xs text-slate-500">{t.fecha} - {t.hora}</p>
                      </div>
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase ${
                        t.estado === "Completado" ? "bg-green-100 text-green-700" :
                        t.estado === "Cancelado" ? "bg-red-100 text-red-700" : "bg-sky-100 text-sky-700"
                      }`}>{t.estado}</span>
                    </div>
                  ))}
                  {turnos.length === 0 && <p className="text-slate-400 text-sm py-4">No hay turnos registrados.</p>}
                </div>
              </div>
              {/* Ultimas Recetas */}
              <div className="bg-white rounded-3xl p-6 border border-sky-100 shadow-sm space-y-4">
                <h3 className="text-lg font-bold text-slate-800">Últimas Recetas</h3>
                <div className="space-y-3">
                  {recetas.slice(0, 4).map(r => {
                    const pac = pacientes.find(p => p._id === r.pacienteId);
                    return (
                      <div key={r._id} className="flex justify-between items-center p-3.5 bg-slate-50 rounded-2xl">
                        <div>
                          <p className="text-sm font-bold text-slate-800">{r.medicamento}</p>
                          <p className="text-xs text-slate-500">Paciente: {pac?.nombre || "Paciente General"}</p>
                        </div>
                        <span className="text-xs text-slate-400 font-medium">{r.fecha}</span>
                      </div>
                    );
                  })}
                  {recetas.length === 0 && <p className="text-slate-400 text-sm py-4">No hay recetas registradas.</p>}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* -------------------- TAB 2: REGISTRAR USUARIO -------------------- */}
        {activeTab === "create" && (
          <div className="bg-white rounded-3xl p-8 border border-sky-100 shadow-sm max-w-2xl mx-auto space-y-6">
            <div>
              <h2 className="text-xl font-bold text-slate-800">Registrar Médico o Paciente</h2>
              <p className="text-slate-500 text-sm mt-1">Crea nuevas credenciales. Los pacientes tendrán su ficha médica inicial creada de forma automática.</p>
            </div>

            <form onSubmit={handleCreateUser} className="space-y-6">
              <div>
                <label className="text-sm font-bold text-slate-700 block mb-2">Rol del Usuario</label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 cursor-pointer bg-slate-50 px-4 py-3 rounded-xl border border-sky-100/50 w-full">
                    <input
                      type="radio"
                      name="role"
                      value="paciente"
                      checked={newUserRole === "paciente"}
                      onChange={() => setNewUserRole("paciente")}
                      className="accent-sky-600"
                    />
                    <span className="text-sm font-semibold text-slate-700">Paciente</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer bg-slate-50 px-4 py-3 rounded-xl border border-sky-100/50 w-full">
                    <input
                      type="radio"
                      name="role"
                      value="medico"
                      checked={newUserRole === "medico"}
                      onChange={() => setNewUserRole("medico")}
                      className="accent-sky-600"
                    />
                    <span className="text-sm font-semibold text-slate-700">Médico</span>
                  </label>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-sm font-bold text-slate-700 block mb-2">Nombre Completo</label>
                  <input
                    type="text"
                    required
                    value={newUserData.nombre}
                    onChange={(e) => setNewUserData({ ...newUserData, nombre: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500 transition text-slate-800 text-sm"
                    placeholder="Ej. Dr. Juan Perez o Sofía Gómez"
                  />
                </div>
                <div>
                  <label className="text-sm font-bold text-slate-700 block mb-2">Correo Electrónico</label>
                  <input
                    type="email"
                    required
                    value={newUserData.email}
                    onChange={(e) => setNewUserData({ ...newUserData, email: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500 transition text-slate-800 text-sm"
                    placeholder="ejemplo@vinsalud.com"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-sm font-bold text-slate-700 block mb-2">Contraseña</label>
                  <input
                    type="password"
                    required
                    value={newUserData.password}
                    onChange={(e) => setNewUserData({ ...newUserData, password: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500 transition text-slate-800 text-sm"
                    placeholder="••••••••"
                  />
                </div>
                {newUserRole === "paciente" && (
                  <div>
                    <label className="text-sm font-bold text-slate-700 block mb-2">Edad</label>
                    <input
                      type="number"
                      required
                      value={newUserData.edad}
                      onChange={(e) => setNewUserData({ ...newUserData, edad: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500 transition text-slate-800 text-sm"
                      placeholder="Ej. 28"
                    />
                  </div>
                )}
                {newUserRole === "medico" && (
                  <div>
                    <label className="text-sm font-bold text-slate-700 block mb-2">Especialidad</label>
                    <select
                      value={newUserData.especialidad}
                      onChange={(e) => setNewUserData({ ...newUserData, especialidad: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500 transition text-slate-800 text-sm"
                    >
                      <option value="">Seleccione Especialidad</option>
                      <option value="Cardiología">Cardiología</option>
                      <option value="Pediatría">Pediatría</option>
                      <option value="Odontología">Odontología</option>
                      <option value="Medicina General">Medicina General</option>
                      <option value="Dermatología">Dermatología</option>
                    </select>
                  </div>
                )}
              </div>

              {newUserRole === "paciente" && (
                <div>
                  <label className="text-sm font-bold text-slate-700 block mb-2">Teléfono de Contacto</label>
                  <input
                    type="text"
                    required
                    value={newUserData.telefono}
                    onChange={(e) => setNewUserData({ ...newUserData, telefono: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500 transition text-slate-800 text-sm"
                    placeholder="Ej. 099887766"
                  />
                </div>
              )}

              {formStatus.message && (
                <div className={`p-4 rounded-2xl text-sm font-bold border ${
                  formStatus.type === "success" ? "bg-green-50 border-green-200 text-green-800" : "bg-red-50 border-red-200 text-red-800"
                }`}>
                  {formStatus.message}
                </div>
              )}

              <button
                type="submit"
                className="w-full py-3.5 bg-sky-600 hover:bg-sky-700 text-white font-bold rounded-2xl shadow transition duration-200"
              >
                💾 Registrar e Insertar en Base de Datos
              </button>
            </form>
          </div>
        )}

        {/* -------------------- TAB 3: GESTION USUARIOS -------------------- */}
        {activeTab === "users" && (
          <div className="bg-white rounded-3xl border border-sky-100 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-sky-50 bg-slate-50/50 flex justify-between items-center">
              <h2 className="text-lg font-bold text-slate-800">Listado de Usuarios Registrados</h2>
              <span className="text-xs text-slate-500 font-bold uppercase">users / pacientes</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-sky-50 text-slate-400 text-xs font-bold uppercase tracking-wider bg-slate-50/10">
                    <th className="py-4 px-6">ID</th>
                    <th className="py-4 px-6">Nombre</th>
                    <th className="py-4 px-6">Email</th>
                    <th className="py-4 px-6">Rol</th>
                    <th className="py-4 px-6">Contraseña</th>
                    <th className="py-4 px-6 text-center">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-sky-50">
                  {users.map(u => (
                    <tr key={u._id} className="hover:bg-slate-50/50 transition">
                      <td className="py-4 px-6 font-mono text-xs text-slate-500">{u._id}</td>
                      <td className="py-4 px-6 text-sm font-bold text-slate-800">{u.nombre}</td>
                      <td className="py-4 px-6 text-sm text-slate-600">{u.email}</td>
                      <td className="py-4 px-6">
                        <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wide border ${
                          u.role === "medico" ? "bg-sky-50 border-sky-100 text-sky-700" :
                          u.role === "paciente" ? "bg-teal-50 border-teal-100 text-teal-700" : "bg-purple-50 border-purple-100 text-purple-700"
                        }`}>{u.role}</span>
                      </td>
                      <td className="py-4 px-6 font-mono text-xs text-slate-400">{u.password}</td>
                      <td className="py-4 px-6">
                        <div className="flex justify-center gap-2">
                          <button
                            onClick={() => openEdit("user", u)}
                            className="px-3 py-1.5 bg-sky-50 hover:bg-sky-100 border border-sky-100 text-sky-700 text-xs font-bold rounded-lg transition"
                          >
                            ✏️ Editar
                          </button>
                          {u.role !== "admin" && (
                            <button
                              onClick={() => handleDeleteRecord("user", u._id)}
                              className="px-3 py-1.5 bg-red-50 hover:bg-red-100 border border-red-100 text-red-700 text-xs font-bold rounded-lg transition"
                            >
                              🗑️ Eliminar
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* -------------------- TAB 4: GESTION TURNOS -------------------- */}
        {activeTab === "turnos" && (
          <div className="bg-white rounded-3xl border border-sky-100 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-sky-50 bg-slate-50/50 flex justify-between items-center">
              <h2 className="text-lg font-bold text-slate-800">Listado de Turnos Médicos</h2>
              <span className="text-xs text-slate-500 font-bold uppercase">turnos</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-sky-50 text-slate-400 text-xs font-bold uppercase tracking-wider bg-slate-50/10">
                    <th className="py-4 px-6">ID</th>
                    <th className="py-4 px-6">Paciente</th>
                    <th className="py-4 px-6">Fecha</th>
                    <th className="py-4 px-6">Hora</th>
                    <th className="py-4 px-6">Estado</th>
                    <th className="py-4 px-6 text-center">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-sky-50">
                  {turnos.map(t => (
                    <tr key={t._id} className="hover:bg-slate-50/50 transition">
                      <td className="py-4 px-6 font-mono text-xs text-slate-500">{t._id}</td>
                      <td className="py-4 px-6 text-sm font-bold text-slate-800">{t.pacienteNombre}</td>
                      <td className="py-4 px-6 text-sm text-slate-600">{t.fecha}</td>
                      <td className="py-4 px-6 text-sm text-slate-600">{t.hora}</td>
                      <td className="py-4 px-6">
                        <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wide border ${
                          t.estado === "Completado" ? "bg-green-50 border-green-100 text-green-700" :
                          t.estado === "Cancelado" ? "bg-red-50 border-red-100 text-red-700" : "bg-sky-50 border-sky-100 text-sky-700"
                        }`}>{t.estado}</span>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex justify-center gap-2">
                          <button
                            onClick={() => openEdit("turno", t)}
                            className="px-3 py-1.5 bg-sky-50 hover:bg-sky-100 border border-sky-100 text-sky-700 text-xs font-bold rounded-lg transition"
                          >
                            ✏️ Reprogramar
                          </button>
                          <button
                            onClick={() => handleDeleteRecord("turno", t._id)}
                            className="px-3 py-1.5 bg-red-50 hover:bg-red-100 border border-red-100 text-red-700 text-xs font-bold rounded-lg transition"
                          >
                            🗑️ Eliminar
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* -------------------- TAB 5: GESTION RECETAS -------------------- */}
        {activeTab === "recetas" && (
          <div className="bg-white rounded-3xl border border-sky-100 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-sky-50 bg-slate-50/50 flex justify-between items-center">
              <h2 className="text-lg font-bold text-slate-800">Listado de Recetas Digitales</h2>
              <span className="text-xs text-slate-500 font-bold uppercase">recetas</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-sky-50 text-slate-400 text-xs font-bold uppercase tracking-wider bg-slate-50/10">
                    <th className="py-4 px-6">ID</th>
                    <th className="py-4 px-6">Paciente</th>
                    <th className="py-4 px-6">Fecha</th>
                    <th className="py-4 px-6">Medicamento</th>
                    <th className="py-4 px-6">Dosis</th>
                    <th className="py-4 px-6">Indicaciones</th>
                    <th className="py-4 px-6 text-center">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-sky-50">
                  {recetas.map(r => {
                    const pac = pacientes.find(p => p._id === r.pacienteId);
                    return (
                      <tr key={r._id} className="hover:bg-slate-50/50 transition">
                        <td className="py-4 px-6 font-mono text-xs text-slate-500">{r._id}</td>
                        <td className="py-4 px-6 text-sm font-bold text-slate-800">{pac?.nombre || "Paciente General"}</td>
                        <td className="py-4 px-6 text-sm text-slate-600">{r.fecha}</td>
                        <td className="py-4 px-6 text-sm font-bold text-sky-700">{r.medicamento}</td>
                        <td className="py-4 px-6 text-sm text-slate-600">{r.dosis}</td>
                        <td className="py-4 px-6 text-sm text-slate-500 max-w-xs truncate">{r.indicaciones}</td>
                        <td className="py-4 px-6">
                          <div className="flex justify-center gap-2">
                            <button
                              onClick={() => openEdit("receta", r)}
                              className="px-3 py-1.5 bg-sky-50 hover:bg-sky-100 border border-sky-100 text-sky-700 text-xs font-bold rounded-lg transition"
                            >
                              ✏️ Editar
                            </button>
                            <button
                              onClick={() => handleDeleteRecord("receta", r._id)}
                              className="px-3 py-1.5 bg-red-50 hover:bg-red-100 border border-red-100 text-red-700 text-xs font-bold rounded-lg transition"
                            >
                              🗑️ Eliminar
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* -------------------- TAB 6: GESTION HISTORIAL -------------------- */}
        {activeTab === "historial" && (
          <div className="bg-white rounded-3xl border border-sky-100 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-sky-50 bg-slate-50/50 flex justify-between items-center">
              <h2 className="text-lg font-bold text-slate-800">Notas de Historial Clínico</h2>
              <span className="text-xs text-slate-500 font-bold uppercase">historial</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-sky-50 text-slate-400 text-xs font-bold uppercase tracking-wider bg-slate-50/10">
                    <th className="py-4 px-6">ID</th>
                    <th className="py-4 px-6">Paciente</th>
                    <th className="py-4 px-6">Fecha</th>
                    <th className="py-4 px-6">Notas Evolutivas</th>
                    <th className="py-4 px-6 text-center">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-sky-50">
                  {historial.map(h => {
                    const pac = pacientes.find(p => p._id === h.pacienteId);
                    return (
                      <tr key={h._id} className="hover:bg-slate-50/50 transition">
                        <td className="py-4 px-6 font-mono text-xs text-slate-500">{h._id}</td>
                        <td className="py-4 px-6 text-sm font-bold text-slate-800">{pac?.nombre || "Paciente General"}</td>
                        <td className="py-4 px-6 text-sm text-slate-600">{h.fecha}</td>
                        <td className="py-4 px-6 text-sm text-slate-600 max-w-md truncate">{h.notas}</td>
                        <td className="py-4 px-6">
                          <div className="flex justify-center gap-2">
                            <button
                              onClick={() => openEdit("historial", h)}
                              className="px-3 py-1.5 bg-sky-50 hover:bg-sky-100 border border-sky-100 text-sky-700 text-xs font-bold rounded-lg transition"
                            >
                              ✏️ Editar
                            </button>
                            <button
                              onClick={() => handleDeleteRecord("historial", h._id)}
                              className="px-3 py-1.5 bg-red-50 hover:bg-red-100 border border-red-100 text-red-700 text-xs font-bold rounded-lg transition"
                            >
                              🗑️ Eliminar
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </div>

      {/* -------------------- DYNAMIC EDIT MODAL -------------------- */}
      {editModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl border border-sky-100 shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6 bg-slate-50 border-b border-sky-50 flex justify-between items-center">
              <h3 className="text-lg font-bold text-slate-800">
                Editar Registro ({editModal.type.toUpperCase()})
              </h3>
              <button
                onClick={() => setEditModal({ isOpen: false, type: "", data: null })}
                className="text-slate-400 hover:text-slate-600 text-xl font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="p-6 space-y-6">
              
              {/* EDIT USER */}
              {editModal.type === "user" && (
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Nombre Completo</label>
                    <input
                      type="text"
                      required
                      value={editModal.data.nombre}
                      onChange={(e) => setEditModal({
                        ...editModal,
                        data: { ...editModal.data, nombre: e.target.value }
                      })}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500 transition text-sm"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Email</label>
                    <input
                      type="email"
                      required
                      value={editModal.data.email}
                      onChange={(e) => setEditModal({
                        ...editModal,
                        data: { ...editModal.data, email: e.target.value }
                      })}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500 transition text-sm"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Contraseña</label>
                    <input
                      type="text"
                      required
                      value={editModal.data.password}
                      onChange={(e) => setEditModal({
                        ...editModal,
                        data: { ...editModal.data, password: e.target.value }
                      })}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500 transition text-sm"
                    />
                  </div>
                </div>
              )}

              {/* EDIT TURNO */}
              {editModal.type === "turno" && (
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Paciente</label>
                    <input
                      type="text"
                      disabled
                      value={editModal.data.pacienteNombre}
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-100 border border-slate-200 text-slate-500 text-sm cursor-not-allowed"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">Fecha</label>
                      <input
                        type="date"
                        required
                        value={editModal.data.fecha}
                        onChange={(e) => setEditModal({
                          ...editModal,
                          data: { ...editModal.data, fecha: e.target.value }
                        })}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500 transition text-sm"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">Hora</label>
                      <input
                        type="text"
                        required
                        value={editModal.data.hora}
                        onChange={(e) => setEditModal({
                          ...editModal,
                          data: { ...editModal.data, hora: e.target.value }
                        })}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500 transition text-sm"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Estado del Turno</label>
                    <select
                      value={editModal.data.estado}
                      onChange={(e) => setEditModal({
                        ...editModal,
                        data: { ...editModal.data, estado: e.target.value }
                      })}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500 transition text-sm"
                    >
                      <option value="Pendiente">Pendiente</option>
                      <option value="Completado">Completado</option>
                      <option value="Cancelado">Cancelado</option>
                    </select>
                  </div>
                </div>
              )}

              {/* EDIT RECETA */}
              {editModal.type === "receta" && (
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Medicamento</label>
                    <input
                      type="text"
                      required
                      value={editModal.data.medicamento}
                      onChange={(e) => setEditModal({
                        ...editModal,
                        data: { ...editModal.data, medicamento: e.target.value }
                      })}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500 transition text-sm"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Dosis</label>
                    <input
                      type="text"
                      required
                      value={editModal.data.dosis}
                      onChange={(e) => setEditModal({
                        ...editModal,
                        data: { ...editModal.data, dosis: e.target.value }
                      })}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500 transition text-sm"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Indicaciones</label>
                    <textarea
                      required
                      rows={3}
                      value={editModal.data.indicaciones}
                      onChange={(e) => setEditModal({
                        ...editModal,
                        data: { ...editModal.data, indicaciones: e.target.value }
                      })}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500 transition text-sm"
                    />
                  </div>
                </div>
              )}

              {/* EDIT HISTORIAL */}
              {editModal.type === "historial" && (
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Fecha de Visita</label>
                    <input
                      type="date"
                      required
                      value={editModal.data.fecha}
                      onChange={(e) => setEditModal({
                        ...editModal,
                        data: { ...editModal.data, fecha: e.target.value }
                      })}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500 transition text-sm"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Notas Clínicas</label>
                    <textarea
                      required
                      rows={4}
                      value={editModal.data.notas}
                      onChange={(e) => setEditModal({
                        ...editModal,
                        data: { ...editModal.data, notas: e.target.value }
                      })}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500 transition text-sm"
                    />
                  </div>
                </div>
              )}

              {modalStatus.message && (
                <div className="p-4 rounded-xl text-xs font-bold bg-red-50 border border-red-200 text-red-800">
                  {modalStatus.message}
                </div>
              )}

              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => setEditModal({ isOpen: false, type: "", data: null })}
                  className="w-full py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-2xl transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="w-full py-3 bg-sky-600 hover:bg-sky-700 text-white font-bold rounded-2xl shadow transition"
                >
                  Guardar Cambios
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

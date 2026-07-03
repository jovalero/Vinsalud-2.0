"use client";

import React, { useState } from "react";

export default function ContactoPage() {
  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    correo: "",
    telefono: "",
    mensaje: "",
  });
  const [enviado, setEnviado] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (formData.nombre && formData.apellido && formData.correo && formData.telefono && formData.mensaje) {
      setEnviado(true);
    } else {
      alert("Por favor, completa todos los campos.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[90vh] bg-slate-50 px-4 py-12">
      <div className="max-w-xl mx-auto w-full">
        
        <div className="text-center mb-8 space-y-2">
          <div className="inline-block px-3 py-1 bg-sky-100 text-sky-700 text-xs font-bold uppercase tracking-wider rounded-full">
            Contacto
          </div>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Ponte en Contacto
          </h2>
          <p className="text-sm text-slate-500 max-w-sm mx-auto">
            Si tienes dudas, consultas o necesitas asistencia, por favor completa el formulario y te responderemos a la brevedad.
          </p>
        </div>

        {enviado ? (
          <div className="flex flex-col items-center justify-center bg-white p-8 rounded-2xl border border-sky-100 shadow-lg text-center space-y-4">
            <div className="p-4 bg-green-50 text-green-500 rounded-full">
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-slate-900">¡Tu consulta ha sido enviada!</h3>
            <p className="text-sm text-slate-500 max-w-xs">
              Agradecemos tu comunicación. Nuestro equipo de soporte médico te responderá a tu correo electrónico pronto.
            </p>
            <button
              onClick={() => {
                setEnviado(false);
                setFormData({ nombre: "", apellido: "", correo: "", telefono: "", mensaje: "" });
              }}
              className="mt-2 text-sky-600 font-semibold hover:underline text-sm"
            >
              Enviar otro mensaje
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 bg-white p-8 rounded-2xl border border-slate-100 shadow-md">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="nombre" className="block text-xs font-bold text-slate-600 uppercase">
                  Nombre
                </label>
                <input
                  type="text"
                  id="nombre"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleChange}
                  className="mt-1 block w-full px-4 py-2.5 border border-slate-200 rounded-xl text-slate-800 text-sm focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition"
                  placeholder="Juan"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="apellido" className="block text-xs font-bold text-slate-600 uppercase">
                  Apellido
                </label>
                <input
                  type="text"
                  id="apellido"
                  name="apellido"
                  value={formData.apellido}
                  onChange={handleChange}
                  className="mt-1 block w-full px-4 py-2.5 border border-slate-200 rounded-xl text-slate-800 text-sm focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition"
                  placeholder="Pérez"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="correo" className="block text-xs font-bold text-slate-600 uppercase">
                Correo Electrónico
              </label>
              <input
                type="email"
                id="correo"
                name="correo"
                value={formData.correo}
                onChange={handleChange}
                className="mt-1 block w-full px-4 py-2.5 border border-slate-200 rounded-xl text-slate-800 text-sm focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition"
                placeholder="correo@ejemplo.com"
                required
              />
            </div>

            <div>
              <label htmlFor="telefono" className="block text-xs font-bold text-slate-600 uppercase">
                Teléfono de Contacto
              </label>
              <input
                type="tel"
                id="telefono"
                name="telefono"
                value={formData.telefono}
                onChange={handleChange}
                className="mt-1 block w-full px-4 py-2.5 border border-slate-200 rounded-xl text-slate-800 text-sm focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition"
                placeholder="123456789"
                required
              />
            </div>

            <div>
              <label htmlFor="mensaje" className="block text-xs font-bold text-slate-600 uppercase">
                Mensaje o Consulta
              </label>
              <textarea
                id="mensaje"
                name="mensaje"
                value={formData.mensaje}
                onChange={handleChange}
                className="mt-1 block w-full px-4 py-2.5 border border-slate-200 rounded-xl text-slate-800 text-sm focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition"
                rows="4"
                placeholder="Escribe tu consulta detallada aquí..."
                required
              ></textarea>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="w-full bg-sky-600 hover:bg-sky-700 text-white font-semibold py-3 rounded-xl shadow-md hover:shadow-lg transition duration-200"
              >
                Enviar Consulta
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
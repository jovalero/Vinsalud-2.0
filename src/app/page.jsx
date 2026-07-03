"use client";

import Carrusel from "./components/carrusel";
import Informacion from "./components/information";
import Link from "next/link";
import { useAuth } from "./context/AuthContext";
import React, { useState } from "react";

export default function Home() {
  const { isLoggedIn } = useAuth();
  const [activeFaq, setActiveFaq] = useState(null);

  const toggleFaq = (index) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  const especialidades = [
    {
      title: "Medicina General",
      description: "Atención primaria integral, diagnósticos precisos y prevención para toda la familia.",
      icon: (
        <svg className="w-8 h-8 text-sky-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      )
    },
    {
      title: "Pediatría",
      description: "Cuidado dedicado, control de crecimiento y atención médica experta para tus hijos.",
      icon: (
        <svg className="w-8 h-8 text-sky-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m0-12.728l.707.707m12.728 12.728l.707-.707M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    {
      title: "Cardiología",
      description: "Evaluación cardiovascular detallada, control de presión y cuidado cardíaco avanzado.",
      icon: (
        <svg className="w-8 h-8 text-sky-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      )
    },
    {
      title: "Ginecología",
      description: "Salud íntima de la mujer, control obstétrico y acompañamiento en cada etapa de la vida.",
      icon: (
        <svg className="w-8 h-8 text-sky-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      )
    },
    {
      title: "Traumatología",
      description: "Tratamiento de lesiones óseas, articulares y rehabilitación kinesiológica profesional.",
      icon: (
        <svg className="w-8 h-8 text-sky-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      )
    },
    {
      title: "Dermatología",
      description: "Cuidado de la piel, diagnóstico de afecciones cutáneas, alergias y estética clínica.",
      icon: (
        <svg className="w-8 h-8 text-sky-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-3" />
        </svg>
      )
    }
  ];

  const team = [
    {
      name: "Dr. Alejandro Ramos",
      specialty: "Cardiología & Hemodinamia",
      image: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?q=80&w=300&auto=format&fit=crop",
      reg: "M.N. 125.432"
    },
    {
      name: "Dra. Valentina Silva",
      specialty: "Pediatría & Neonatología",
      image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=300&auto=format&fit=crop",
      reg: "M.S. 98.765"
    },
    {
      name: "Dr. Carlos Mendoza",
      specialty: "Medicina Clínica & Preventiva",
      image: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?q=80&w=300&auto=format&fit=crop",
      reg: "M.N. 110.224"
    }
  ];

  const faqs = [
    {
      q: "¿Cómo reservo un turno médico?",
      a: "Puedes registrarte como paciente y agendar un turno online en nuestra sección de turnos. Si ya eres usuario registrado, solo inicia sesión, ve a 'Próximos Turnos' y selecciona la fecha y hora disponible con el médico de tu preferencia."
    },
    {
      q: "¿Cuáles son las obras sociales con las que trabajan?",
      a: "Aceptamos una amplia variedad de prepagas y obras sociales nacionales y provinciales (OSDE, Swiss Medical, Galeno, PAMI, IOMA, entre otras). Te recomendamos verificar con administración telefónicamente antes de tu consulta."
    },
    {
      q: "¿Cómo accedo a mis recetas digitales?",
      a: "Una vez que el médico te atienda e ingrese la prescripción en tu panel, podrás iniciar sesión con tu cuenta de paciente e ingresar a la pestaña 'Recetas'. Desde allí podrás ver las dosis detalladas e imprimirlas para presentarlas en la farmacia."
    },
    {
      q: "¿Puedo ver el historial clínico de mis consultas?",
      a: "Sí. Todo paciente registrado cuenta con un acceso exclusivo a 'Mi Historial' donde figuran las observaciones, notas de diagnóstico y evoluciones que los médicos guarden de forma segura y encriptada en nuestro sistema NoSQL."
    }
  ];

  return (
    <div className="space-y-0 bg-slate-50">
      
      {/* 1. Carousel Hero Section */}
      <Carrusel />

      {/* 2. Quick Action CTA Bar */}
      <section className="bg-white py-8 border-b border-sky-100/50 shadow-sm">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
          <div>
            <h3 className="text-2xl font-extrabold text-slate-900">¿Necesitas programar una consulta?</h3>
            <p className="text-slate-500 text-sm mt-1">Registra tu usuario hoy y reserva un turno en menos de 2 minutos.</p>
          </div>
          <div className="flex gap-4">
            {isLoggedIn ? (
              <Link
                href="/proximo-turno"
                className="bg-sky-600 hover:bg-sky-700 text-white font-semibold px-6 py-3 rounded-xl transition duration-200 shadow-md hover:shadow-lg"
              >
                Mis Turnos
              </Link>
            ) : (
              <>
                <Link
                  href="/Login"
                  className="bg-sky-600 hover:bg-sky-700 text-white font-semibold px-6 py-3 rounded-xl transition duration-200 shadow-md hover:shadow-lg"
                >
                  Reservar Turno
                </Link>
                <Link
                  href="/Login"
                  className="bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 font-semibold px-6 py-3 rounded-xl transition duration-200"
                >
                  Registrarse
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      {/* 3. Specialties Section */}
      <section id="especialidades" className="py-20 px-6 max-w-6xl mx-auto text-center space-y-16">
        <div className="space-y-4">
          <div className="inline-block px-3 py-1 bg-sky-100 text-sky-700 text-xs font-bold uppercase tracking-wider rounded-full">
            Especialidades Médicas
          </div>
          <h2 className="text-4xl font-extrabold text-slate-900 tracking-tight">
            Nuestros Servicios de Salud
          </h2>
          <p className="text-slate-500 max-w-xl mx-auto text-base">
            Contamos con médicos experimentados en diversas disciplinas clínicas para cuidar cada aspecto de tu bienestar físico y mental.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {especialidades.map((esp, i) => (
            <div
              key={i}
              className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm text-left space-y-4 medical-card-hover"
            >
              <div className="p-3 bg-sky-50 rounded-xl inline-block">
                {esp.icon}
              </div>
              <h3 className="text-xl font-bold text-slate-900">{esp.title}</h3>
              <p className="text-sm text-slate-500 leading-relaxed">{esp.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 4. Asymmetric Information Sections (Consultorio Moderno y Buena Atención) */}
      <Informacion />

      {/* 5. Medical Staff Section */}
      <section className="py-20 px-6 max-w-6xl mx-auto text-center space-y-16">
        <div className="space-y-4">
          <div className="inline-block px-3 py-1 bg-sky-100 text-sky-700 text-xs font-bold uppercase tracking-wider rounded-full">
            Equipo Médico
          </div>
          <h2 className="text-4xl font-extrabold text-slate-900 tracking-tight">
            Profesionales de Confianza
          </h2>
          <p className="text-slate-500 max-w-xl mx-auto text-base">
            Conoce a los especialistas dedicados a guiarte en tu recuperación y mantenimiento de una vida plena y saludable.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {team.map((doc, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm hover:shadow-md transition duration-300"
            >
              <img
                src={doc.image}
                alt={doc.name}
                className="w-full h-64 object-cover"
              />
              <div className="p-6 text-left space-y-2">
                <span className="text-xs font-bold text-sky-600 uppercase tracking-wider block">
                  {doc.specialty}
                </span>
                <h3 className="text-xl font-extrabold text-slate-900">{doc.name}</h3>
                <div className="flex justify-between items-center text-xs text-slate-400 pt-2 border-t border-slate-50">
                  <span>Matrícula Nacional</span>
                  <span className="font-semibold text-slate-600">{doc.reg}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6. FAQ Section */}
      <section className="py-20 px-6 max-w-4xl mx-auto space-y-12">
        <div className="text-center space-y-4">
          <div className="inline-block px-3 py-1 bg-sky-100 text-sky-700 text-xs font-bold uppercase tracking-wider rounded-full">
            Ayuda al Paciente
          </div>
          <h2 className="text-4xl font-extrabold text-slate-900 tracking-tight">
            Preguntas Frecuentes
          </h2>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              className="bg-white rounded-xl border border-slate-100 overflow-hidden shadow-sm transition"
            >
              <button
                onClick={() => toggleFaq(idx)}
                className="w-full px-6 py-5 flex items-center justify-between text-left font-bold text-slate-800 hover:text-sky-600 transition"
              >
                <span>{faq.q}</span>
                <svg
                  className={`w-5 h-5 text-slate-400 transform transition-transform duration-200 ${
                    activeFaq === idx ? "rotate-180 text-sky-500" : ""
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <div
                className={`transition-all duration-300 ease-in-out overflow-hidden ${
                  activeFaq === idx ? "max-h-[200px] border-t border-slate-50 p-6 bg-slate-50/50" : "max-h-0"
                }`}
              >
                <p className="text-sm text-slate-500 leading-relaxed">{faq.a}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 7. Contact Details and Hours */}
      <section className="py-20 px-6 bg-white border-t border-sky-100/50">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6 text-left">
            <h2 className="text-3xl font-extrabold text-slate-900">Ubicación y Horarios</h2>
            <p className="text-slate-500 leading-relaxed">
              Estamos ubicados en una zona accesible con facilidades de estacionamiento y transporte público cercano. Visítanos en nuestros horarios de atención regular.
            </p>
            
            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="p-2 bg-sky-50 rounded-lg text-sky-600 self-start">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-bold text-slate-800">Horario de Atención</h4>
                  <p className="text-sm text-slate-500 mt-1">Lunes a Viernes: 08:00 AM - 08:00 PM</p>
                  <p className="text-sm text-slate-500">Sábados: 09:00 AM - 01:00 PM</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="p-2 bg-sky-50 rounded-lg text-sky-600 self-start">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-bold text-slate-800">Dirección</h4>
                  <p className="text-sm text-slate-500 mt-1">Av. Amazonas N32-154 y La Granja, Quito, Ecuador</p>
                </div>
              </div>
            </div>
          </div>

          <div className="relative rounded-2xl overflow-hidden h-80 border border-slate-100 shadow-sm">
            <img
              src="/mapa_consultorio.png"
              alt="Ubicación de VinSalud en Quito, Ecuador"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>

    </div>
  );
}

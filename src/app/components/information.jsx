import React from "react";

const Information = () => {
  return (
    <section id="instalaciones" className="w-full py-16 px-6 bg-slate-50 border-t border-sky-100/50">
      <div className="max-w-6xl mx-auto space-y-20">
        
        {/* Section 1 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 items-center gap-12">
          <div className="space-y-6 text-left">
            <div className="inline-block px-3 py-1 bg-sky-100 text-sky-700 text-xs font-bold uppercase tracking-wider rounded-full">
              Instalaciones
            </div>
            <h2 className="text-4xl font-extrabold text-slate-900 leading-tight">
              Consultorio Moderno y Equipado
            </h2>
            <p className="text-lg text-slate-600 leading-relaxed">
              Nuestro consultorio cuenta con tecnología médica de última generación y espacios diseñados detalladamente para garantizar tu máxima comodidad y seguridad.
            </p>
            <p className="text-lg text-slate-600 leading-relaxed">
              Entendemos la importancia de un diagnóstico preciso, por lo que invertimos continuamente en actualizar nuestras herramientas de diagnóstico clínico, ofreciendo resultados rápidos y fiables bajo un ambiente higiénico y cálido.
            </p>
          </div>
          
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-sky-500 to-sky-400 rounded-2xl blur opacity-25 group-hover:opacity-30 transition duration-1000"></div>
            <img
              src="/consultorio.jpg"
              alt="Consultorio Moderno"
              className="relative w-full h-[380px] rounded-2xl shadow-lg object-cover"
            />
          </div>
        </div>

        {/* Section 2 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 items-center gap-12 lg:flex-row-reverse">
          <div className="relative group order-last lg:order-first">
            <div className="absolute -inset-1 bg-gradient-to-r from-sky-500 to-sky-400 rounded-2xl blur opacity-25 group-hover:opacity-30 transition duration-1000"></div>
            <img
              src="/medico.jpg"
              alt="Atención Médica Profesional"
              className="relative w-full h-[380px] rounded-2xl shadow-lg object-cover"
            />
          </div>
          
          <div className="space-y-6 text-left">
            <div className="inline-block px-3 py-1 bg-sky-100 text-sky-700 text-xs font-bold uppercase tracking-wider rounded-full">
              Nuestro Enfoque
            </div>
            <h2 className="text-4xl font-extrabold text-slate-900 leading-tight">
              Atención Médica Personalizada
            </h2>
            <p className="text-lg text-slate-600 leading-relaxed">
              Nos enorgullece ofrecer un servicio de salud excepcional enfocado en la prevención y el bienestar a largo plazo de cada paciente.
            </p>
            <p className="text-lg text-slate-600 leading-relaxed">
              Nuestro equipo de profesionales altamente calificados se asegura de brindar una atención cercana, escuchando cada detalle de tus síntomas para estructurar planes terapéuticos específicos que se adapten a tu estilo de vida.
            </p>
          </div>
        </div>

      </div>
    </section>
  );
};

export default Information;
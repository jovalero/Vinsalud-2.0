"use client";

import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";

export default function RecetasPage() {
  const { role, user } = useAuth();
  const [recetas, setRecetas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (role === "paciente" && user?.email) {
      const fetchMisRecetas = async () => {
        try {
          const res = await fetch(`/api/recetas?email=${user.email}`);
          if (res.ok) {
            const data = await res.json();
            setRecetas(data);
          }
        } catch (err) {
          console.error("Error al obtener recetas:", err);
        } finally {
          setLoading(false);
        }
      };
      fetchMisRecetas();
    } else {
      setLoading(false);
    }
  }, [role, user]);

  const handlePrint = (receta) => {
    // Simular impresión de receta
    const printWindow = window.open("", "_blank");
    printWindow.document.write(`
      <html>
        <head>
          <title>Receta Digital - VinSalud</title>
          <style>
            body { font-family: 'Helvetica Neue', Arial, sans-serif; padding: 40px; color: #333; }
            .header { text-align: center; border-bottom: 2px solid #0284c7; padding-bottom: 20px; margin-bottom: 30px; }
            .logo { font-size: 24px; font-weight: bold; color: #0284c7; }
            .subtitle { font-size: 14px; color: #666; margin-top: 5px; }
            .meta { display: flex; justify-content: space-between; margin-bottom: 35px; font-size: 14px; }
            .meta-item { margin-bottom: 8px; }
            .rx-title { font-size: 20px; font-weight: bold; margin-bottom: 15px; color: #0f172a; }
            .prescription { background-color: #f8fafc; border: 1px solid #e2e8f0; padding: 25px; border-radius: 12px; margin-bottom: 35px; }
            .prescription h3 { margin: 0 0 10px 0; font-size: 22px; color: #0284c7; }
            .prescription p { margin: 5px 0; font-size: 15px; line-height: 1.6; }
            .footer { border-top: 1px solid #e2e8f0; padding-top: 30px; display: flex; justify-content: space-between; align-items: flex-end; margin-top: 80px; }
            .signature { border-top: 1px solid #aaa; width: 200px; text-align: center; padding-top: 8px; font-size: 13px; }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="logo">VinSalud Centro Médico</div>
            <div class="subtitle">Salud de Excelencia a tu Alcance</div>
          </div>
          <div class="meta">
            <div>
              <div class="meta-item"><strong>Paciente:</strong> ${user?.nombre || "Paciente Registrado"}</div>
              <div class="meta-item"><strong>Email:</strong> ${user?.email || ""}</div>
            </div>
            <div>
              <div class="meta-item"><strong>Fecha Emisión:</strong> ${receta.fecha}</div>
              <div class="meta-item"><strong>ID Receta:</strong> ${receta._id}</div>
            </div>
          </div>
          <div class="prescription">
            <div class="rx-title">Rp / Prescripción Médica</div>
            <h3>${receta.medicamento}</h3>
            <p><strong>Dosis:</strong> ${receta.dosis}</p>
            ${receta.indicaciones ? `<p><strong>Indicaciones:</strong> ${receta.indicaciones}</p>` : ""}
          </div>
          <div class="footer">
            <div style="font-size: 11px; color: #999;">Receta Digital Firmada Electrónicamente.</div>
            <div class="signature">
              <strong>Firma Profesional</strong><br>
              Dra. Ana López (M.N. 98.765)<br>
              Especialista Neonatología
            </div>
          </div>
          <script>
            window.onload = function() { window.print(); }
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
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
      <div className="max-w-4xl mx-auto space-y-8">
        
        <div className="text-center space-y-2">
          <div className="inline-block px-3 py-1 bg-sky-100 text-sky-700 text-xs font-bold uppercase tracking-wider rounded-full">
            Recetario del Paciente
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Mis Recetas Digitales
          </h1>
          <p className="text-slate-500 text-sm">
            Visualiza, descarga e imprime las recetas médicas y dosificaciones válidas emitidas por tus doctores.
          </p>
        </div>

        <div className="bg-white shadow-md border border-slate-100 rounded-2xl p-6 md:p-8 space-y-6">
          <h2 className="text-xl font-bold text-slate-800 border-b border-slate-100 pb-4">
            Recetas Médicas Vigentes
          </h2>

          {loading ? (
            <p className="text-slate-500 text-sm py-4">Cargando recetas digitales...</p>
          ) : recetas.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {recetas.map((receta) => (
                <div
                  key={receta._id}
                  className="bg-slate-50 p-6 rounded-2xl border border-slate-100 flex flex-col justify-between hover:shadow-md transition-shadow duration-200"
                >
                  <div className="space-y-4">
                    <div className="flex justify-between items-start flex-wrap gap-2">
                      <span className="text-xs font-extrabold text-sky-600 bg-sky-50 border border-sky-100 px-2.5 py-1 rounded-lg">
                        Fórmula Rp
                      </span>
                      <span className="text-xs text-slate-400 font-semibold">{receta.fecha}</span>
                    </div>

                    <div className="space-y-1 text-left">
                      <h3 className="text-xl font-extrabold text-slate-900">{receta.medicamento}</h3>
                      <p className="text-sm text-slate-600">
                        <strong className="text-slate-700 font-semibold">Dosis:</strong> {receta.dosis}
                      </p>
                      {receta.indicaciones && (
                        <p className="text-sm text-slate-500 italic mt-2 bg-white/70 p-3 rounded-lg border border-slate-100/50">
                          {receta.indicaciones}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-slate-100/80 flex items-center justify-between">
                    <div className="text-left">
                      <span className="text-[10px] text-slate-400 block font-bold uppercase tracking-wider">Médico Emisor</span>
                      <span className="text-xs font-bold text-slate-700">Dra. Ana López (M.N. 98765)</span>
                    </div>
                    <button
                      onClick={() => handlePrint(receta)}
                      className="bg-sky-600 hover:bg-sky-700 text-white font-semibold text-xs px-3.5 py-2 rounded-xl shadow-sm hover:shadow transition duration-200"
                    >
                      Imprimir Rx
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
              <p className="text-slate-500 text-sm">No tienes recetas emitidas en el sistema actualmente.</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

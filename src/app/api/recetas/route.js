import { getCollection, insert, findOne } from '@/lib/db';

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const pacienteId = searchParams.get('pacienteId');
    const email = searchParams.get('email');

    let targetPacienteId = pacienteId;

    if (email) {
      const paciente = findOne('pacientes', p => p.correo === email);
      if (paciente) {
        targetPacienteId = paciente._id;
      } else {
        return new Response(JSON.stringify([]), {
          headers: { 'Content-Type': 'application/json' }
        });
      }
    }

    let recetas = getCollection('recetas');
    if (targetPacienteId) {
      recetas = recetas.filter(r => r.pacienteId === targetPacienteId);
    }

    // Ordenar de más reciente a más antigua
    recetas.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));

    return new Response(JSON.stringify(recetas), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Error al obtener recetas' }), { status: 500 });
  }
}

export async function POST(req) {
  try {
    const body = await req.json();
    const { pacienteId, medicamento, dosis, indicaciones, medicoId } = body;

    if (!pacienteId || !medicamento || !dosis) {
      return new Response(JSON.stringify({ error: 'Faltan campos obligatorios' }), { status: 400 });
    }

    const newReceta = insert('recetas', {
      pacienteId,
      fecha: new Date().toISOString().split('T')[0],
      medicamento,
      dosis,
      indicaciones: indicaciones || '',
      medicoId: medicoId || 'u-ana'
    });

    return new Response(JSON.stringify(newReceta), {
      status: 201,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Error al emitir receta' }), { status: 500 });
  }
}

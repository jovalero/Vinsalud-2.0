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

    let historial = getCollection('historial');
    if (targetPacienteId) {
      historial = historial.filter(h => h.pacienteId === targetPacienteId);
    }

    // Ordenar de más reciente a más antiguo
    historial.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));

    return new Response(JSON.stringify(historial), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Error al obtener historial clínico' }), { status: 500 });
  }
}

export async function POST(req) {
  try {
    const body = await req.json();
    const { pacienteId, notas, medicoId } = body;

    if (!pacienteId || !notas) {
      return new Response(JSON.stringify({ error: 'Faltan campos obligatorios' }), { status: 400 });
    }

    const newNota = insert('historial', {
      pacienteId,
      fecha: new Date().toISOString().split('T')[0],
      notas,
      medicoId: medicoId || 'u-ana'
    });

    return new Response(JSON.stringify(newNota), {
      status: 201,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Error al agregar nota al historial' }), { status: 500 });
  }
}

import { getCollection, saveCollection } from '@/lib/db';

export async function PUT(req, { params }) {
  try {
    const { id } = await params;
    const body = await req.json();
    const turnos = getCollection('turnos');
    
    const index = turnos.findIndex(t => t._id === id);
    if (index === -1) {
      return new Response(JSON.stringify({ error: 'Turno no encontrado' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Actualizar datos
    turnos[index] = {
      ...turnos[index],
      fecha: body.fecha || turnos[index].fecha,
      hora: body.hora || turnos[index].hora,
      estado: body.estado || turnos[index].estado, // Pendiente | Completado | Cancelado
    };

    saveCollection('turnos', turnos);

    return new Response(JSON.stringify(turnos[index]), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

export async function DELETE(req, { params }) {
  try {
    const { id } = await params;
    const turnos = getCollection('turnos');
    const index = turnos.findIndex(t => t._id === id);
    
    if (index === -1) {
      return new Response(JSON.stringify({ error: 'Turno no encontrado' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const updated = turnos.filter(t => t._id !== id);
    saveCollection('turnos', updated);

    return new Response(JSON.stringify({ success: true }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

import { getCollection, saveCollection } from '@/lib/db';

export async function PUT(req, { params }) {
  try {
    const { id } = await params;
    const body = await req.json();
    const historial = getCollection('historial');
    
    const index = historial.findIndex(h => h._id === id);
    if (index === -1) {
      return new Response(JSON.stringify({ error: 'Nota de historial no encontrada' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Actualizar datos
    historial[index] = {
      ...historial[index],
      notas: body.notas || historial[index].notas,
      fecha: body.fecha || historial[index].fecha,
    };

    saveCollection('historial', historial);

    return new Response(JSON.stringify(historial[index]), {
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
    const historial = getCollection('historial');
    const index = historial.findIndex(h => h._id === id);
    
    if (index === -1) {
      return new Response(JSON.stringify({ error: 'Nota de historial no encontrada' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const updated = historial.filter(h => h._id !== id);
    saveCollection('historial', updated);

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

import { getCollection, saveCollection } from '@/lib/db';

export async function PUT(req, { params }) {
  try {
    const { id } = await params;
    const body = await req.json();
    const recetas = getCollection('recetas');
    
    const index = recetas.findIndex(r => r._id === id);
    if (index === -1) {
      return new Response(JSON.stringify({ error: 'Receta no encontrada' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Actualizar datos
    recetas[index] = {
      ...recetas[index],
      medicamento: body.medicamento || recetas[index].medicamento,
      dosis: body.dosis || recetas[index].dosis,
      indicaciones: body.indicaciones || recetas[index].indicaciones,
      fecha: body.fecha || recetas[index].fecha,
    };

    saveCollection('recetas', recetas);

    return new Response(JSON.stringify(recetas[index]), {
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
    const recetas = getCollection('recetas');
    const index = recetas.findIndex(r => r._id === id);
    
    if (index === -1) {
      return new Response(JSON.stringify({ error: 'Receta no encontrada' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const updated = recetas.filter(r => r._id !== id);
    saveCollection('recetas', updated);

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

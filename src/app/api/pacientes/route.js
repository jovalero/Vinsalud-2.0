import { getCollection, insert, update, remove } from '@/lib/db';

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');
    const email = searchParams.get('email');

    let pacientes = getCollection('pacientes');

    if (userId) {
      pacientes = pacientes.filter(p => p.userId === userId);
    } else if (email) {
      pacientes = pacientes.filter(p => p.correo === email);
    }

    return new Response(JSON.stringify(pacientes), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Error al obtener pacientes' }), { status: 500 });
  }
}

export async function POST(req) {
  try {
    const body = await req.json();
    const { nombre, edad, telefono, correo, userId } = body;

    const newPaciente = insert('pacientes', {
      nombre,
      edad: parseInt(edad, 10) || 0,
      telefono,
      correo,
      userId: userId || null
    });

    return new Response(JSON.stringify(newPaciente), {
      status: 201,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Error al registrar paciente' }), { status: 500 });
  }
}

export async function PUT(req) {
  try {
    const body = await req.json();
    const { _id, nombre, edad, telefono, correo } = body;

    if (!_id) {
      return new Response(JSON.stringify({ error: 'ID de paciente requerido' }), { status: 400 });
    }

    const count = update('pacientes', p => p._id === _id, {
      nombre,
      edad: parseInt(edad, 10) || 0,
      telefono,
      correo
    });

    if (count > 0) {
      return new Response(JSON.stringify({ success: true, message: 'Paciente actualizado' }), {
        headers: { 'Content-Type': 'application/json' }
      });
    } else {
      return new Response(JSON.stringify({ error: 'Paciente no encontrado' }), { status: 404 });
    }
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Error al actualizar paciente' }), { status: 500 });
  }
}

export async function DELETE(req) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return new Response(JSON.stringify({ error: 'ID de paciente requerido' }), { status: 400 });
    }

    const count = remove('pacientes', p => p._id === id);

    if (count > 0) {
      return new Response(JSON.stringify({ success: true, message: 'Paciente eliminado' }), {
        headers: { 'Content-Type': 'application/json' }
      });
    } else {
      return new Response(JSON.stringify({ error: 'Paciente no encontrado o ya eliminado' }), { status: 404 });
    }
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Error al eliminar paciente' }), { status: 500 });
  }
}

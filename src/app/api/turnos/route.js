import { getCollection, insert, update, remove, findOne } from '@/lib/db';

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

    let turnos = getCollection('turnos');
    if (targetPacienteId) {
      turnos = turnos.filter(t => t.pacienteId === targetPacienteId);
    }

    // Ordenar por fecha y hora
    turnos.sort((a, b) => new Date(`${a.fecha} ${a.hora}`) - new Date(`${b.fecha} ${b.hora}`));

    return new Response(JSON.stringify(turnos), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Error al obtener turnos' }), { status: 500 });
  }
}

export async function POST(req) {
  try {
    const body = await req.json();
    const { pacienteNombre, fecha, hora, email } = body;

    if (!pacienteNombre || !fecha || !hora) {
      return new Response(JSON.stringify({ error: 'Faltan campos obligatorios' }), { status: 400 });
    }

    // Buscar o crear ID de paciente si tiene email
    let pacienteId = 'p-anon';
    if (email) {
      const paciente = findOne('pacientes', p => p.correo === email);
      if (paciente) {
        pacienteId = paciente._id;
      } else {
        // Registrar de forma implícita un paciente para este turno
        const nuevoPac = insert('pacientes', {
          nombre: pacienteNombre,
          edad: 0,
          telefono: '',
          correo: email
        });
        pacienteId = nuevoPac._id;
      }
    }

    const newTurno = insert('turnos', {
      pacienteId,
      pacienteNombre,
      fecha,
      hora,
      estado: 'Pendiente'
    });

    return new Response(JSON.stringify(newTurno), {
      status: 201,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Error al crear turno' }), { status: 500 });
  }
}

export async function PUT(req) {
  try {
    const body = await req.json();
    const { _id, estado, fecha, hora } = body;

    if (!_id) {
      return new Response(JSON.stringify({ error: 'ID de turno requerido' }), { status: 400 });
    }

    const updates = {};
    if (estado) updates.estado = estado;
    if (fecha) updates.fecha = fecha;
    if (hora) updates.hora = hora;

    const count = update('turnos', t => t._id === _id, updates);

    if (count > 0) {
      return new Response(JSON.stringify({ success: true, message: 'Turno actualizado' }), {
        headers: { 'Content-Type': 'application/json' }
      });
    } else {
      return new Response(JSON.stringify({ error: 'Turno no encontrado' }), { status: 404 });
    }
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Error al actualizar turno' }), { status: 500 });
  }
}

export async function DELETE(req) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return new Response(JSON.stringify({ error: 'ID de turno requerido' }), { status: 400 });
    }

    const count = remove('turnos', t => t._id === id);

    if (count > 0) {
      return new Response(JSON.stringify({ success: true, message: 'Turno eliminado' }), {
        headers: { 'Content-Type': 'application/json' }
      });
    } else {
      return new Response(JSON.stringify({ error: 'Turno no encontrado' }), { status: 404 });
    }
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Error al eliminar turno' }), { status: 500 });
  }
}

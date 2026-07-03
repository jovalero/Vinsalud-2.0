import { getCollection, saveCollection } from '@/lib/db';

export async function PUT(req, { params }) {
  try {
    const { id } = await params;
    const body = await req.json();
    const pacientes = getCollection('pacientes');
    
    const index = pacientes.findIndex(p => p._id === id);
    if (index === -1) {
      return new Response(JSON.stringify({ error: 'Paciente no encontrado' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Actualizar datos
    pacientes[index] = {
      ...pacientes[index],
      nombre: body.nombre || pacientes[index].nombre,
      edad: body.edad !== undefined ? Number(body.edad) : pacientes[index].edad,
      telefono: body.telefono || pacientes[index].telefono,
      correo: body.correo || pacientes[index].correo,
    };

    saveCollection('pacientes', pacientes);

    // Si tiene un userId, también actualizar el nombre y correo del usuario principal
    const userId = pacientes[index].userId;
    if (userId) {
      const users = getCollection('users');
      const userIndex = users.findIndex(u => u._id === userId);
      if (userIndex !== -1) {
        users[userIndex] = {
          ...users[userIndex],
          nombre: body.nombre || users[userIndex].nombre,
          email: body.correo || users[userIndex].email,
        };
        saveCollection('users', users);
      }
    }

    return new Response(JSON.stringify(pacientes[index]), {
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
    const pacientes = getCollection('pacientes');
    const index = pacientes.findIndex(p => p._id === id);
    
    if (index === -1) {
      return new Response(JSON.stringify({ error: 'Paciente no encontrado' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const paciente = pacientes[index];
    
    // Quitar paciente de la colección
    const updated = pacientes.filter(p => p._id !== id);
    saveCollection('pacientes', updated);

    // Si está ligado a un usuario, también remover el usuario
    if (paciente.userId) {
      const users = getCollection('users');
      const updatedUsers = users.filter(u => u._id !== paciente.userId);
      saveCollection('users', updatedUsers);
    }

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

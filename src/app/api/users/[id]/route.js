import { getCollection, saveCollection, remove } from '@/lib/db';

export async function PUT(req, { params }) {
  try {
    const { id } = await params;
    const body = await req.json();
    const users = getCollection('users');
    
    const userIndex = users.findIndex(u => u._id === id);
    if (userIndex === -1) {
      return new Response(JSON.stringify({ error: 'Usuario no encontrado' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Actualizar datos
    users[userIndex] = {
      ...users[userIndex],
      nombre: body.nombre || users[userIndex].nombre,
      email: body.email || users[userIndex].email,
      password: body.password || users[userIndex].password,
    };

    saveCollection('users', users);

    // Si es un paciente, también actualizar su ficha de paciente
    if (users[userIndex].role === 'paciente') {
      const pacientes = getCollection('pacientes');
      const pacIndex = pacientes.findIndex(p => p.userId === id);
      if (pacIndex !== -1) {
        pacientes[pacIndex] = {
          ...pacientes[pacIndex],
          nombre: body.nombre || pacientes[pacIndex].nombre,
          correo: body.email || pacientes[pacIndex].correo,
        };
        saveCollection('pacientes', pacientes);
      }
    }

    return new Response(JSON.stringify(users[userIndex]), {
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
    const users = getCollection('users');
    const user = users.find(u => u._id === id);
    
    if (!user) {
      return new Response(JSON.stringify({ error: 'Usuario no encontrado' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Eliminar de la colección users
    const updatedUsers = users.filter(u => u._id !== id);
    saveCollection('users', updatedUsers);

    // Si era paciente, eliminar ficha de paciente y todos sus registros asociados en cascada
    if (user.role === 'paciente') {
      const pacientes = getCollection('pacientes');
      const pacienteFicha = pacientes.find(p => p.userId === id);
      
      if (pacienteFicha) {
        const pacienteId = pacienteFicha._id;
        
        // Remover ficha paciente
        remove('pacientes', p => p._id === pacienteId);
        
        // Remover turnos asociados
        remove('turnos', t => t.pacienteId === pacienteId);
        
        // Remover recetas asociadas
        remove('recetas', r => r.pacienteId === pacienteId);
        
        // Remover historial clínico asociado
        remove('historial', h => h.pacienteId === pacienteId);
      }
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

import { findOne, insert } from '@/lib/db';

export async function POST(req) {
  try {
    const body = await req.json();
    const { action, email, password, nombre, edad, telefono } = body;

    if (action === 'login') {
      const user = findOne('users', u => u.email === email && u.password === password);
      if (user) {
        // Retornar información del usuario sin contraseña por seguridad
        const { password: _, ...userSafe } = user;
        return new Response(JSON.stringify({ success: true, user: userSafe }), {
          headers: { 'Content-Type': 'application/json' }
        });
      } else {
        return new Response(JSON.stringify({ success: false, message: 'Credenciales incorrectas' }), {
          status: 401,
          headers: { 'Content-Type': 'application/json' }
        });
      }
    }

    if (action === 'register') {
      // Verificar si ya existe
      const existingUser = findOne('users', u => u.email === email);
      if (existingUser) {
        return new Response(JSON.stringify({ success: false, message: 'El correo electrónico ya está registrado' }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        });
      }

      // Crear usuario
      const newUser = insert('users', {
        email,
        password,
        role: 'paciente',
        nombre
      });

      // Crear ficha del paciente correspondiente
      const newPaciente = insert('pacientes', {
        userId: newUser._id,
        nombre,
        edad: parseInt(edad, 10) || 0,
        telefono,
        correo: email
      });

      const { password: _, ...userSafe } = newUser;
      return new Response(JSON.stringify({ success: true, user: userSafe, paciente: newPaciente }), {
        status: 201,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    return new Response(JSON.stringify({ success: false, message: 'Acción no válida' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error en API Auth:', error);
    return new Response(JSON.stringify({ success: false, message: 'Error interno del servidor' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

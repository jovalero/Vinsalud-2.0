import { getCollection, insert } from '@/lib/db';

export async function GET(req) {
  const users = getCollection('users');
  return new Response(JSON.stringify(users), {
    headers: { 'Content-Type': 'application/json' },
  });
}

export async function POST(req) {
  try {
    const body = await req.json();
    const { email, password, role, nombre, edad, telefono } = body;

    if (!email || !password || !role || !nombre) {
      return new Response(JSON.stringify({ error: 'Faltan campos requeridos (email, password, role, nombre)' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const users = getCollection('users');
    const userExists = users.some(u => u.email.toLowerCase() === email.toLowerCase());
    if (userExists) {
      return new Response(JSON.stringify({ error: 'El correo electrónico ya está registrado' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Insertar usuario
    const newUser = insert('users', {
      email: email.toLowerCase(),
      password,
      role,
      nombre,
    });

    // Si es un paciente, crear también su ficha clínica en la colección pacientes
    if (role === 'paciente') {
      insert('pacientes', {
        userId: newUser._id,
        nombre,
        edad: edad ? Number(edad) : 30,
        telefono: telefono || '',
        correo: email.toLowerCase(),
      });
    }

    return new Response(JSON.stringify(newUser), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
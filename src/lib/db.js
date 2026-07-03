import fs from 'fs';
import path from 'path';

const DB_DIR = path.join(process.cwd(), 'data', 'db');

// Asegurar que la carpeta exista
if (!fs.existsSync(DB_DIR)) {
  fs.mkdirSync(DB_DIR, { recursive: true });
}

// Datos de semilla por defecto
const SEED_DATA = {
  users: [
    {
      _id: "u-juan",
      email: "juan@dominio.com",
      password: "1234",
      role: "paciente",
      nombre: "Juan Pérez"
    },
    {
      _id: "u-ana",
      email: "ana@dominio.com",
      password: "5678",
      role: "medico",
      nombre: "Dra. Ana López"
    },
    {
      _id: "u-medico",
      email: "medico@dominio.com",
      password: "medico123",
      role: "medico",
      nombre: "Dr. Carlos Mendoza"
    },
    {
      _id: "u-paciente",
      email: "paciente@dominio.com",
      password: "paciente123",
      role: "paciente",
      nombre: "Sofía Rodríguez"
    },
    {
      _id: "u-admin",
      email: "admin@dominio.com",
      password: "admin123",
      role: "admin",
      nombre: "Administrador General"
    }
  ],
  pacientes: [
    {
      _id: "p-juan",
      userId: "u-juan",
      nombre: "Juan Pérez",
      edad: 30,
      telefono: "123456789",
      correo: "juan@dominio.com"
    },
    {
      _id: "p-sofia",
      userId: "u-paciente",
      nombre: "Sofía Rodríguez",
      edad: 28,
      telefono: "0998877665",
      correo: "paciente@dominio.com"
    },
    {
      _id: "p-maria",
      nombre: "María López",
      edad: 25,
      telefono: "987654321",
      correo: "maria@example.com"
    }
  ],
  historial: [
    {
      _id: "h-1",
      pacienteId: "p-juan",
      fecha: "2026-06-15",
      notas: "Paciente presenta buen estado general. Control de rutina satisfactorio. Se aconseja continuar dieta equilibrada.",
      medicoId: "u-ana"
    },
    {
      _id: "h-2",
      pacienteId: "p-juan",
      fecha: "2026-07-01",
      notas: "Consulta por congestión nasal leve y carraspera. Se prescribe reposo y analgésicos comunes.",
      medicoId: "u-ana"
    }
  ],
  recetas: [
    {
      _id: "r-1",
      pacienteId: "p-juan",
      fecha: "2026-07-01",
      medicamento: "Ibuprofeno 600mg",
      dosis: "1 comprimido cada 8 horas",
      indicaciones: "Tomar después de las comidas principales por 3 días.",
      medicoId: "u-ana"
    }
  ],
  turnos: [
    {
      _id: "t-1",
      pacienteId: "p-juan",
      pacienteNombre: "Juan Pérez",
      fecha: "2026-07-10",
      hora: "10:00 AM",
      estado: "Pendiente"
    },
    {
      _id: "t-2",
      pacienteId: "p-maria",
      pacienteNombre: "María López",
      fecha: "2026-07-12",
      hora: "11:30 AM",
      estado: "Pendiente"
    }
  ]
};

export function getCollection(name) {
  const filePath = path.join(DB_DIR, `${name}.json`);
  if (!fs.existsSync(filePath)) {
    const seed = SEED_DATA[name] || [];
    fs.writeFileSync(filePath, JSON.stringify(seed, null, 2), 'utf-8');
    return seed;
  }
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(content);
  } catch (error) {
    console.error(`Error leyendo la colección NoSQL: ${name}`, error);
    return [];
  }
}

export function saveCollection(name, data) {
  const filePath = path.join(DB_DIR, `${name}.json`);
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
    return true;
  } catch (error) {
    console.error(`Error escribiendo la colección NoSQL: ${name}`, error);
    return false;
  }
}

export function insert(name, doc) {
  const collection = getCollection(name);
  const newDoc = {
    _id: `${name.substring(0, 1)}-${Date.now().toString()}-${Math.random().toString(36).substring(2, 7)}`,
    ...doc
  };
  collection.push(newDoc);
  saveCollection(name, collection);
  return newDoc;
}

export function find(name, queryFn = () => true) {
  const collection = getCollection(name);
  return collection.filter(queryFn);
}

export function findOne(name, queryFn = () => true) {
  const collection = getCollection(name);
  return collection.find(queryFn);
}

export function update(name, queryFn, updateData) {
  const collection = getCollection(name);
  let updatedCount = 0;
  const updatedCollection = collection.map(doc => {
    if (queryFn(doc)) {
      updatedCount++;
      return { ...doc, ...updateData };
    }
    return doc;
  });
  if (updatedCount > 0) {
    saveCollection(name, updatedCollection);
  }
  return updatedCount;
}

export function remove(name, queryFn) {
  const collection = getCollection(name);
  const initialLength = collection.length;
  const updatedCollection = collection.filter(doc => !queryFn(doc));
  const deletedCount = initialLength - updatedCollection.length;
  if (deletedCount > 0) {
    saveCollection(name, updatedCollection);
  }
  return deletedCount;
}

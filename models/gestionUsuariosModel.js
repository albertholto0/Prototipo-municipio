// gestionUsuariosModel.js
const db = require('../config/database');

class Usuarios {
    static async getAll() {
        try {
            const [rows] = await db.query(
                'SELECT id_usuario, nombres, apellido_paterno, apellido_materno, usuario, password_usuario, rol_usuario, estado FROM usuarios');
            return rows;
        } catch (err) {
            console.error('Error en la consulta:', err);
            throw new Error('Error al obtener usuarios');
        }
    }

    static async create(nombres, apellido_paterno, apellido_materno, usuario, password, rol_usuario) {
        try {
            const [result] = await db.query(
                'INSERT INTO usuarios (nombres, apellido_paterno, apellido_materno, usuario, password_usuario, rol_usuario, estado) VALUES (?, ?, ?, ?, ?, ?, ?)',
                [nombres, apellido_paterno, apellido_materno, usuario, password, rol_usuario, 'activo']
            );
            return result.insertId;
        } catch (err) {
            console.error('Error al crear usuario:', err);
        }
    }
}

module.exports = Usuarios;
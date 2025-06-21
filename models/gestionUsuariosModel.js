// gestionUsuariosModel.js
const db = require('../config/database');

class Usuarios {
    static async getAll() {
        try {
            const [rows] = await db.query(
                'SELECT id_usuario, nombres, apellido_paterno, apellido_materno, usuario, password_usuario, rol_usuario, fecha_acceso, hora_acceso, estado FROM usuarios');
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

    static async update(id_usuario, nombres, apellido_paterno, apellido_materno, usuario, rol_usuario) {
        try {
            const [result] = await db.query(
                'UPDATE usuarios SET nombres = ?, apellido_paterno = ?, apellido_materno = ?, usuario = ?, rol_usuario = ? WHERE id_usuario = ?',
                [nombres, apellido_paterno, apellido_materno, usuario, rol_usuario, id_usuario]
            );
            return result.affectedRows > 0;
        } catch (err) {
            console.error('Error al actualizar usuario:', err);
            throw err;
        }
    }

    static async resetPassword(id_usuario, newPassword) {
        try {
            const [result] = await db.query(
                'UPDATE usuarios SET password_usuario = ? WHERE id_usuario = ?',
                [newPassword, id_usuario]
            );
            return result.affectedRows > 0;
        } catch (err) {
            console.error('Error al resetear contraseña:', err);
            throw err;
        }
    }

    static async getByUsername(usuario) {
        try {
            const [rows] = await db.query(
                'SELECT id_usuario, nombres, apellido_paterno, apellido_materno, usuario, rol_usuario FROM usuarios WHERE usuario = ?',
                [usuario]
            );
            return rows[0];
        } catch (err) {
            console.error('Error al obtener usuario:', err);
            throw err;
        }
    }
}

module.exports = Usuarios;
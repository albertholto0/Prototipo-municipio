// gestionUsuariosModel.js
const db = require('../config/database');

class Usuarios {
    static async getAll() {
        try {
            const [rows] = await db.query(
                'SELECT id_usuario, nombres, apellido_paterno, apellido_materno, usuario, password_usuario, rol_usuario, estado, ultimo_acceso, foto_perfil FROM usuarios');
            return rows;
        } catch (err) {
            console.error('Error en la consulta:', err);
            throw new Error('Error al obtener usuarios');
        }
    }

    static async create(nombres, apellido_paterno, apellido_materno, usuario, password, rol_usuario, foto_perfil) {
        try {
            const [result] = await db.query(
                'INSERT INTO usuarios (nombres, apellido_paterno, apellido_materno, usuario, password_usuario, rol_usuario, estado, foto_perfil) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
                [nombres, apellido_paterno, apellido_materno, usuario, password, rol_usuario, 'activo', foto_perfil]
            );
            return result.insertId;
        } catch (err) {
            console.error('Error al crear usuario:', err);
        }
    }

    static async update(id_usuario, nombres, apellido_paterno, apellido_materno, usuario, rol_usuario, foto_perfil) {
        try {
            const [result] = await db.query(
                'UPDATE usuarios SET nombres = ?, apellido_paterno = ?, apellido_materno = ?, usuario = ?, rol_usuario = ?, foto_perfil = ? WHERE id_usuario = ?',
                [nombres, apellido_paterno, apellido_materno, usuario, rol_usuario, foto_perfil, id_usuario]
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
                'SELECT id_usuario, nombres, apellido_paterno, apellido_materno, usuario, rol_usuario, ultimo_acceso, estado FROM usuarios WHERE usuario = ?',
                [usuario]
            );
            return rows[0];
        } catch (err) {
            console.error('Error al obtener usuario:', err);
            throw err;
        }
    }

    static async toggleStatus(id_usuario) {
        try {
            // Primero obtenemos el estado actual
            const [current] = await db.query(
                'SELECT estado FROM usuarios WHERE id_usuario = ?',
                [id_usuario]
            );

            if (current.length === 0) {
                return false;
            }

            const nuevoEstado = current[0].estado === 'activo' ? 'inactivo' : 'activo';

            const [result] = await db.query(
                'UPDATE usuarios SET estado = ? WHERE id_usuario = ?',
                [nuevoEstado, id_usuario]
            );

            return result.affectedRows > 0;
        } catch (err) {
            console.error('Error al cambiar estado del usuario:', err);
            throw err;
        }
    }

    static async autenticar(usuario, password) {
        try {
            const [rows] = await db.query(
                'SELECT id_usuario, nombres, apellido_paterno, apellido_materno, usuario, rol_usuario, estado FROM usuarios WHERE usuario = ? AND password_usuario = ?',
                [usuario, password]
            );

            if (rows.length === 0) return null;
            return rows[0];
        } catch (err) {
            console.error('Error en autenticación:', err);
            throw err;
        }
    }

    static async actualizarUltimoAcceso(id_usuario) {
        const now = new Date();
        const fechaHora = now.toISOString().slice(0, 19).replace('T', ' ');
        await db.query(
            'UPDATE usuarios SET ultimo_acceso = ? WHERE id_usuario = ?',
            [fechaHora, id_usuario]
        );



    }
    static async getById(id_usuario) {
        try {
            const [rows] = await db.query(
                'SELECT id_usuario, nombres, apellido_paterno, apellido_materno, usuario, rol_usuario, ultimo_acceso, estado FROM usuarios WHERE id_usuario = ?',
                [id_usuario]
            );
            return rows[0];
        } catch (err) {
            console.error('Error al obtener usuario por ID:', err);
            throw err;
        }
    }
}

module.exports = Usuarios;
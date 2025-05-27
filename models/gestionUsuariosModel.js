const db = require('../config/database');
class Usuarios {
    static async getAll(){
        try {
            const [rows] = await db.query(
                'SELECT id_usuario, nombres, apellido_paterno, apellido_materno, estado, usuario, password, usuario, fecha_acceso, hora_acceso, rol_usuario FROM usuarios');
                return rows;
        } catch (err) {
            console.error('Error en la consulta:', err);
            throw new Error('Error al obtener usuarios');
        }
    }
}

module.exports = Usuarios;
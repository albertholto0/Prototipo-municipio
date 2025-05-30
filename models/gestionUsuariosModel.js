const db = require('../config/database');
class Usuarios {
    static async getAll(){
        try {
            const [rows] = await db.query(
                'SELECT nombres, apellido_paterno, apellido_materno, usuario, rol_usuario, fecha_acceso, hora_acceso, estado FROM usuarios');
                return rows;
        } catch (err) {
            console.error('Error en la consulta:', err);
            throw new Error('Error al obtener usuarios');
        }
    }
}

module.exports = Usuarios;
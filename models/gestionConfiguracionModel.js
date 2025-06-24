const db = require("../config/database");

class Configuracion {
  static async getAll() {
    const [rows] = await db.query("SELECT * FROM configuraciones_sistema");
    return rows;
  }

  static async create(config) {
    // Eliminar configuración previa
    await db.query("DELETE FROM configuraciones_sistema");

    // Insertar la nueva
    const { dependencia, logotipo, lema } = config;
    await db.query(
      "INSERT INTO configuraciones_sistema (dependencia, logotipo, lema) VALUES (?, ?, ?)",
      [dependencia, logotipo, lema]
    );
  }

  static async reset() {
    await db.query("DELETE FROM configuraciones_sistema");

    await db.query(
      `INSERT INTO configuraciones_sistema (dependencia, logotipo, lema)
       VALUES ('IXTLÁN DE JUÁREZ', '/Assets/logo_ixtlan.png', '"INNOVACIÓN Y TRANSFORMACIÓN EN COMUNIDAD"')`
    );
  }
}

module.exports = Configuracion;

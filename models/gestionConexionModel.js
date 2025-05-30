const db=require('../config/database');
class Conexion{
    static async getAll(){
        try{
            const[rows]= await db.query(`
                select 
                fecha_conexion, 
                nombre_completo, 
                cuenta, 
                tipo 
                from conexiones cx, contribuyentes cb 
                where cx.id_contribuyente=cb.id_contribuyente; `);
            return rows;

        } catch (err){
            console.error('Error en la consulta: ',err);
            throw new Error('Error al obtener conexiones');
        }
    }
}

module.exports= Conexion;
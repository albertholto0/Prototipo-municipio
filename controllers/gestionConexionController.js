const Conexion =require('../models/gestionConexionModel');
exports.getAllConexion =async (req, res)=>{
    try{
        const conexion =await Conexion.getAll();
        res.json(conexion);
    }
    catch(error){

        res.status(500).json({message:error.message});
    }
}
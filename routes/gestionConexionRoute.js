const express =require('express');
const Conexion =require('../models/gestionConexionModel');
const router= express.Router();
router.get('/', async(req, res)=>{
    try{
        const conexion =await Conexion.getAll();
        res.json(conexion);
    }
    catch(error){
        console.error('error al obtener conexion: ', error);

    }
});

module.exports= router;
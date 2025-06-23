// controllers/authController.js
const Usuario = require('../models/gestionUsuariosModel');

const authController = {
  login: async (req, res) => {
    try {
      const { nombre_usuario, contraseña } = req.body;
      
      // Validación básica
      if (!nombre_usuario || !contraseña) {
        return res.status(400).json({ error: 'Usuario y contraseña son requeridos' });
      }

      // Autenticar usuario
      const usuario = await Usuario.autenticar(nombre_usuario, contraseña);
      
      if (!usuario) {
        return res.status(401).json({ error: 'Credenciales inválidas' });
      }

       await Usuario.actualizarUltimoAcceso(usuario.id_usuario); 

      // Guardar datos relevantes en la sesión
      req.session.usuario = {
        id: usuario.id_usuario,
        nombre: usuario.nombre,
        rol: usuario.rol_usuario
      };

      res.json({ 
        success: true,
        usuario: {
          id: usuario.id,
          id_usuario: usuario.id_usuario,
          nombre: usuario.nombre,
          rol: usuario.rol_usuario
        }
      });
    } catch (error) {
      console.error('Error en login:', error);
      res.status(500).json({ error: 'Error en el servidor' });
    }
  },

  logout: (req, res) => {
    req.session.destroy(err => {
      if (err) {
        console.error('Error al cerrar sesión:', err);
        return res.status(500).json({ error: 'Error al cerrar sesión' });
      }
      res.json({ success: true });
    });
  },

  checkSession: (req, res) => {
    if (req.session.usuario) {
      res.json({ 
        isLoggedIn: true,
        usuario: req.session.usuario 
      });
    } else {
      res.json({ isLoggedIn: false });
    }
  }
};

module.exports = authController;
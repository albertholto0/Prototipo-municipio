const Configuracion = require("../models/gestionConfiguracionModel");
const path = require("path");
const fs = require("fs");

const saveLogoFile = (file) => {
  const uploadDir = path.join(__dirname, "../../public/Assets");
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  const logoPath = path.join(uploadDir, "logo_ixtlan.png");
  fs.writeFileSync(logoPath, file.buffer);
  return "/Assets/logo_ixtlan.png";
};

exports.getAllConfiguracion = async (req, res) => {
  try {
    const configs = await Configuracion.getAll();
    res.status(200).json(
      configs.length > 0
        ? configs
        : [
            {
              dependencia: "IXTLÁN DE JUÁREZ",
              lema: '"INNOVACIÓN Y TRANSFORMACIÓN EN COMUNIDAD"',
              logotipo: "/Assets/logo_ixtlan.png",
            },
          ]
    );
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.createConfiguracion = async (req, res) => {
  try {
    if (!req.file) {
      return res
        .status(400)
        .json({ success: false, message: "El logo es requerido" });
    }

    const logoPath = saveLogoFile(req.file);

    const config = {
      dependencia: req.body.dependencia,
      lema: req.body.lema,
      logotipo: logoPath,
    };

    await Configuracion.create(config);

    res.json({
      success: true,
      message: "Configuración guardada exitosamente",
      config,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.resetConfiguracion = async (req, res) => {
  try {
    await Configuracion.reset();

    const logoPath = path.join(
      __dirname,
      "../../public/Assets/logo_ixtlan.png"
    );
    if (fs.existsSync(logoPath)) fs.unlinkSync(logoPath);

    const defaultLogoPath = path.join(
      __dirname,
      "../../public/Assets/logo_default.png"
    );
    if (fs.existsSync(defaultLogoPath))
      fs.copyFileSync(defaultLogoPath, logoPath);

    res.json({
      success: true,
      message: "Configuración restablecida a los valores por defecto.",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

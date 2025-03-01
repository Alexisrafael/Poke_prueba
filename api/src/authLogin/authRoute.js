const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { User } = require("../db");

async function Register(req, res){
  try {
    const { name, lastName, email, password } = req.body;
  
    if (!name || !lastName || !email || !password) {
      return res.status(400).json({ error: "Todos los campos son obligatorios" });
    }
  
    const hashedPassword = await bcrypt.hash(password, 10);
  
    const [user, created] = await User.findOrCreate({
      where: { email },  // Busca un usuario con el mismo email
      defaults: { name, lastName, email, password: hashedPassword }, // Si no existe, lo crea con estos valores
    });
  
    if (!created) {
      return res.status(400).json({ error: "El correo ya está registrado" });
    }
  
    res.status(201).json({user, message: "Usuario registrado con éxito" });
  
  } catch (error) {
    console.error("Error en Register:", error);
    res.status(500).json({ error: "Error en el servidor" });
  }

};

async function Login(req, res) {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(401).json({ error: "Credenciales incorrectas" });
    }
    console.log(":", email, user.email);

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ error: "Credenciales incorrectas" });
    }

    const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, {
      expiresIn: "3h",
    });

    res.json({ message: "Inicio de sesión exitoso", token, user: `${user.name} ${user.lastName}` });
  } catch (error) {
    res.status(500).json({ error: "Error en el servidor" });
  }
}

module.exports = {Register, Login};
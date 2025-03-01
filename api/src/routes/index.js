const { Router } = require('express');
const {updateBase, updateBaseType} = require("../UpdateBase");
const { Register, Login } = require('../authLogin/authRoute');
const authJwt = require('../middlewares/authJwt');
const { getPokemonById, getPokemonByName} = require('./getPokemon');



// Importar todos los routers;
// Ejemplo: const authRouter = require('./auth.js');
const router = Router();

router.post("/register", Register);
router.post("/login", Login);
router.get("/poke", authJwt, updateBase);
router.get("/typeall", authJwt, updateBaseType);
router.get("/searchpokemon", authJwt, getPokemonById);
router.get("/searchpokemons", authJwt, getPokemonByName);

module.exports = router;

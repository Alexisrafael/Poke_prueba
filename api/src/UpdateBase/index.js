const axios = require("axios");
const {Pokemon, Type} = require("../db");

//Metodo encargado de cargar la base de datos con los pokemones
async function updateBase(req, res) {
  try {
    let allPokemons = (await axios("https://pokeapi.co/api/v2/pokemon?limit=1304")).data.results;

    const MAX_CONCURRENT_REQUESTS = 50;
    const dataApi = [];

    // Crear lotes de solicitudes para evitar sobrecarga
    for (let i = 0; i < allPokemons.length; i += MAX_CONCURRENT_REQUESTS) {
      const chunk = allPokemons.slice(i, i + MAX_CONCURRENT_REQUESTS);

      // Hacer solicitudes en lotes
      const promises = chunk.map(async e => {
        try {
          const pokemon = (await axios(e.url)).data;
          return pokemon;
        } catch (err) {
          console.error(`Error fetching ${e.url}: ${err.message}`);
          return null; // Manejar errores sin detener el proceso
        }
      });

      const results = await Promise.all(promises);
      dataApi.push(...results.filter(e => e)); // Eliminar nulos en caso de error
    }

    const pokemonFinal = dataApi.map(e => ({
      image: (e.sprites?.other?.["official-artwork"]?.front_default != null ? e.sprites?.other?.["official-artwork"]?.front_default : "https://res.cloudinary.com/dgo96kikm/image/upload/v1741629938/pngegg_kyiqwt.png"),
      identificate: e.id,
      name: e.name,
      attack: e.stats[1]?.base_stat,
      life: e.stats[0]?.base_stat,
      defense: e.stats[2]?.base_stat,
      speed: e.stats[5]?.base_stat,
      specialAttack: e.stats[3]?.base_stat,
      specialDefense: e.stats[4]?.base_stat,
      height: e.height,
      weight: e.weight,
      types: e?.types?.map(t => t?.type?.name)
    }));

    for (const p of pokemonFinal) {
      const [newPokemon] = await Pokemon.findOrCreate({
        where: { name: p.name },
        defaults: {
          identificate: p.identificate,
          life: p.life,
          attack: p.attack,
          defense: p.defense,
          speed: p.speed,
          specialAttack: p.specialAttack,
          specialDefense: p.specialDefense,
          height: p.height,
          weight: p.weight,
          image: p.image,
        }
      });

      // Buscar los tipos en la base de datos
      const types = await Type.findAll({ where: { name: p?.types } });

      // Asociar los tipos al Pokémon
      await newPokemon.setTypes(types);

    }
    res.send(pokemonFinal);
  } catch (error) {
    console.log(error.message)
    res.status(404).json({ error: error.message });
  }
}

//Metodo encargado de cargar la base de datos con los tipos pokemones
const updateBaseType = async (req, res) => {
  try {
    const typePokemon = (await axios('https://pokeapi.co/api/v2/type?limit=21')).data.results;

    for (const type of typePokemon) {
      await Type.findOrCreate({
        where: { name: type.name }
      });
    }

    const typeDb = await Type.findAll();
    res.send(typeDb);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};




module.exports = {updateBase, updateBaseType};
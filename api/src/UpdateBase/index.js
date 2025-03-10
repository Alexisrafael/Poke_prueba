const axios = require("axios");
const {Pokemon, Type} = require("../db");

//Metodo encargado de cargar la base de datos con los pokemones
async function updateBase(req, res) {
  try {
    let allPokemons = (await axios("https://pokeapi.co/api/v2/pokemon?limit=1304")).data.results;

    const dataApi = await Promise.all(allPokemons.map(async e => {
      const pokemon = (await axios(e.url)).data;
      return pokemon;
    }));

    const pokemonFinal = dataApi.map(e => ({
      image: e.sprites?.other?.["official-artwork"]?.front_default || "https://res.cloudinary.com/dgo96kikm/image/upload/v1741629938/pngegg_kyiqwt.png",
      id: e.id,
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
          life: p.life,
          identificate: p.id,
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
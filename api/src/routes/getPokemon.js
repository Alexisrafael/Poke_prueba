const axios = require("axios");
const {Pokemon, Type} = require("../db");
const { Op } = require("sequelize");

const searchpokemon = async (search) => {
  try {
    const allPokemons = await axios("https://pokeapi.co/api/v2/pokemon?limit=1304");
    const pokemons = allPokemons.data.results;
    const pokemonFilter = pokemons.filter((p) => p.name.toLowerCase().includes(search.toLowerCase()) );

    const dataApi = await Promise.all(pokemonFilter.map(async e => {
      const pokemon = (await axios(e.url)).data;
      return pokemon;
    }));

    const pokemonFinal = dataApi.map(e => ({
      image: e.sprites?.other?.["official-artwork"]?.front_default,
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
      types: e?.types?.map(t => t?.type?.name) || []
    }));


    return pokemonFinal
  } catch (error) {
    return{ error: "Pokemon not found" };
  }
}

// Método para buscar en la API si no existe en la base de datos
const searchPokemonApi = async (search) => {
  try {
    const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${search}`);
    const dataPokemon = response.data;

    // Formatear los datos obtenidos de la API
    const pokemonFinal = [{
      image: dataPokemon.sprites?.other?.dream_world?.front_default,
      identificate: dataPokemon.id.toString(), // Convertimos el ID a string
      name: dataPokemon.name,
      attack: dataPokemon.stats[1]?.base_stat,
      life: dataPokemon.stats[0]?.base_stat,
      defense: dataPokemon.stats[2]?.base_stat,
      speed: dataPokemon.stats[5]?.base_stat,
      specialAttack: dataPokemon.stats[3]?.base_stat,
      specialDefense: dataPokemon.stats[4]?.base_stat,
      height: dataPokemon.height,
      weight: dataPokemon.weight,
      types: dataPokemon?.types?.map(t => t?.type?.name) || []
    }];

    return pokemonFinal;
  } catch (error) {
    return []; // Si no encuentra en la API, devuelve un array vacío
  }
};

// Método para buscar en la base de datos por "identificate" y si no está, buscar en la API
const getPokemonById = async (req, res) => {
  const { search } = req.query;

  try {
    // Buscar en la base de datos por el campo "identificate"
    const pokemonWithTypes = await Pokemon.findOne({
      where: { identificate: search.toString() }, // Asegurar que el campo sea un string
      include: Type,
    });

    if (pokemonWithTypes) {
      return res.json([pokemonWithTypes]); // Devolver como array
    }

    // Si no está en la base de datos, buscar en la API
    const pokemonFromApi = await searchPokemonApi(search);
    
    if (pokemonFromApi.length === 0) {
      return res.status(404).json({ error: "Pokemon not found" });
    }

    // Verificar si ya existe en la base de datos antes de crearlo
    const [newPokemon] = await Pokemon.findOrCreate({
      where: { identificate: pokemonFromApi[0].identificate }, // Usar "identificate" como clave única
      defaults: {
        name: pokemonFromApi[0].name,
        life: pokemonFromApi[0].life,
        attack: pokemonFromApi[0].attack,
        defense: pokemonFromApi[0].defense,
        speed: pokemonFromApi[0].speed,
        specialAttack: pokemonFromApi[0].specialAttack,
        specialDefense: pokemonFromApi[0].specialDefense,
        height: pokemonFromApi[0].height,
        weight: pokemonFromApi[0].weight,
        image: pokemonFromApi[0].image,
      }
    });

    // Buscar o crear cada tipo individualmente
    const types = await Promise.all(
      pokemonFromApi[0]?.types.map(async (typeName) => {
        const [type] = await Type.findOrCreate({ where: { name: typeName } });
        return type;
      })
    );

    // Asociar los tipos al Pokémon
    await newPokemon.setTypes(types);

    // Recargar los datos del Pokémon con sus tipos
    const pokemonWithTypesFinal = await Pokemon.findOne({
      where: { identificate: newPokemon.identificate },
      include: Type,
    });

    return res.json([pokemonWithTypesFinal]); // Devolver en formato array
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const getPokemonByName = async (req, res) => {
  const { search } = req.query;
  
  try {

    // Buscamos en la base de datos por nombre
    const pokemonWithTypes = await Pokemon.findAll({
      where: {
        name: {
          [Op.iLike]: `%${search}%`
        }
      },
      include: Type,
    });

    if (pokemonWithTypes.length > 0) {
      return res.json(pokemonWithTypes);
    }

    // Buscar en la API si no se encuentra en la BD
    const pokemon = await searchpokemon(search);

    if (pokemon.length === 0) {
      return res.status(404).json({ error: "Pokemon not found" });
    }

    // Esperar a que todos los Pokémon se almacenen en la base de datos
    await Promise.all(
      pokemon.map(async (poke) => {
        const [newPokemon] = await Pokemon.findOrCreate({
          where: { name: poke.name },
          defaults: {
            identificate: poke.identificate,
            life: poke.life,
            attack: poke.attack,
            defense: poke.defense,
            speed: poke.speed,
            specialAttack: poke.specialAttack,
            specialDefense: poke.specialDefense,
            height: poke.height,
            weight: poke.weight,
            image: poke.image,
          }
        });

        // Buscar o crear los tipos asociados
        const types = await Promise.all(
          poke?.types?.map(async (typeName) => {
            const [type] = await Type.findOrCreate({ where: { name: typeName } });
            return type;
          })
        );

        // Asociar los tipos al Pokémon
        await newPokemon.setTypes(types);
      })
    );

    // Recargar los Pokémon con sus tipos después de insertarlos
    const finalPokemons = await Pokemon.findAll({
      where: { name: { [Op.iLike]: `%${search}%` } },
      include: Type,
    });

    return res.json(finalPokemons);
    
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};



module.exports = {getPokemonById, getPokemonByName};
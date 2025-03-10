import axios from "axios";

const API_URL = process.env.API; // Reemplázalo por tu API

export const loginUser = async (email, password) => {
  try {
    const response = await axios.post(`${API_URL}/login`, { email, password });
    if (response.data?.user && response.data?.token) {
      return response.data; // Devuelve el token y la info del usuario
    } else {
      throw new Error("Datos de autenticación incompletos");
    }
  } catch (error) {
    console.error("Error en el login:", error);
    throw error;
  }
};

export const registerUser = async (name, lastName, email, password) => {
  try {
    const response = await axios.post(`${API_URL}/register`, { name, lastName, email, password });
    if (response.data) {
      return response.data; // Devuelve el token y la info del usuario
    } else {
      throw new Error("Datos de registro incompletos");
    }
  } catch (error) {
    console.error("Error en el registro:", error);
    throw error;
  }
}

export const getPokemons = async (search) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("No se encontró el token");


    const response = await axios.get(`${API_URL}/searchpokemons`, {
      params: { search: encodeURIComponent(search) },
      headers: {
        Authorization: `Bearer ${token}`, 
        "Content-Type": "application/json",
      },
    });

    if (response.data) {
      return response.data; // Devuelve el token y la info del usuario
    } else {
      throw new Error("No hay datos del pokemon");
    }
  } catch (error) {
    console.error("Error en getPokemons:", error.response || error.message || error);
    throw error;
  }
};

export const getPokemonById = async (searchId) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("No se encontró el token");


    const response = await axios.get(`${API_URL}/searchpokemon`, {
      params: { search: encodeURIComponent(searchId) },
      headers: {
        Authorization: `Bearer ${token}`, 
        "Content-Type": "application/json",
      },
    });
    
    if (response.data) {
      return response.data; // Devuelve el token y la info del usuario
    } else {
      throw new Error("No hay datos del pokemon");
    }
  } catch (error) {
    console.error("Error en getPokemons:", error.response || error.message || error);
    throw error;
  }
}
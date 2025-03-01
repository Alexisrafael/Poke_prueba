import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  token: localStorage.getItem("token") || null,
  isAuthenticated: !!localStorage.getItem("token"),
  pokemons:[],
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
      localStorage.setItem("Use", JSON.stringify(action.payload.user));
      localStorage.setItem("token", action.payload.token);
    },
    loadUser: (state) => {
      const storedUser = localStorage.getItem("Use");
      if (storedUser) {
        state.user = JSON.parse(storedUser);
        state.isAuthenticated = true;
      }
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      localStorage.removeItem("Use");
      localStorage.removeItem("token");
    },
    register: (state, action) => {
      state.user = action.payload.user;
      state.isAuthenticated = true;
    },
    setPokemons: (state, action) => {
      state.pokemons = action.payload.pokemon;

    },
    setPokemonById: (state, action) => {
      state.pokemons = action.payload;
    }
  },
});

export const { login, logout, register, setPokemons, setPokemonById, loadUser  } = authSlice.actions;
export default authSlice.reducer;
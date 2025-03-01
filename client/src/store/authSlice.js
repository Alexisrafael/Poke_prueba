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
      console.log("Action en login:", action);
      if (action.payload) {
        state.user = action.payload.user || null;
        state.token = action.payload.token || null;
        state.isAuthenticated = true;
        localStorage.setItem("Use", JSON.stringify(action.payload.user));
        localStorage.setItem("token", action.payload.token);
      }
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
      if (action.payload) {
        state.user = action.payload.user || null;
        state.isAuthenticated = true;
      }
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
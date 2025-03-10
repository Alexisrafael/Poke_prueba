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
        localStorage.setItem("user", JSON.stringify(action.payload.user));
        localStorage.setItem("token", action.payload.token);
      }
    },
    loadUser: (state) => {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        state.user = JSON.parse(storedUser);
        state.isAuthenticated = true;
      }
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      localStorage.removeItem("user");
      localStorage.removeItem("token");
    },
    register: (state, action) => {
      if (action.payload) {
        state.user = action.payload.user ? `${action.payload.user.name} ${action.payload.user.lastName}` : null;
      }
    },
    setPokemons: (state, action) => {
      state.pokemons = action?.payload?.pokemon || [];

    },
    setPokemonById: (state, action) => {
      state.pokemons = action?.payload || [];
    }
  },
});
console.log("Estado inicial de Auth:", initialState);
export const { login, logout, register, setPokemons, setPokemonById, loadUser  } = authSlice.actions;
export default authSlice.reducer;
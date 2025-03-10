import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loadUser, logout } from "../store/authSlice";
import { useNavigate } from "react-router-dom";
import { getPokemonById, getPokemons } from "../services/authService";

const Pokemon = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);
  const [pokemons, setPokemons] = useState([]); // Traer los pokémon del estado global
  const [search, setSearch] = useState("");
  const [searchId, setSearchId] = useState("");

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  if (!user) {
    navigate("/login");
  }

  const handleSearch = async () => {
    setSearchId("");
    if (!search.trim()) {
      alert("Ingrese un nombre para buscar Pokémon.");
      return;
    }
  
    try {
      const data = await getPokemons(search);
      setPokemons(data);
      
    } catch (error) {
      alert("Error al buscar Pokémon.");
    }
  };

  const handleSearchId = async () => {
    setSearch("");
    if (!searchId.trim()) {
      alert("Ingrese un nombre para buscar Pokémon.");
      return;
    }
  
    try {
      const data = await getPokemonById(searchId);
      setPokemons(data);
      
    } catch (error) {
      alert("Error al buscar Pokémon.");
    }
  };

  useEffect(() => {
    console.log(loadUser())
    dispatch(loadUser()); 
  }, [dispatch]);

  return (
    
    <div>
      <nav style={{backgroundColor: "#696969"}}>
        <div style={{ display: "flex", justifyContent: "space-around" }}>
          <h1>Bienvenido {user || "Entrenador"} a la Búsqueda de Pokémon </h1>
          <div style={{ padding: "2.2%", borderRadius: "5px", border: "none" }}>
            <button  onClick={handleLogout}>Cerrar Sesión</button>
          </div>
        </div>
      </nav>
      <div>
        <section style={{ padding: "2%" }}>
          <h2>¡Encuentra a tu Pokémon favorito!</h2>
          <div style={{ display: "flex", justifyContent: "center", padding: "2%" }}>
            <div style={{ display: "flex", justifyContent: "center", padding: "2%" }}>
              <input type="text" placeholder="Buscar Pokémon por nombre" style={{ padding: "1%", width: "250px" }} value={search} onChange={(e) => setSearch(e.target.value)}/>
              <button style={{ marginLeft: "2%", padding: "1%", borderRadius: "5px", border: "none" , width: "80px", backgroundColor: "rgb(158, 153, 153)" }} onClick={handleSearch}>Buscar</button>
            </div>
            <div style={{ marginLeft: "2%", display: "flex", justifyContent: "center", padding: "2%" }}>
              <input type="text" placeholder="Buscar Pokémon por id" style={{ padding: "1%", width: "250px" }} value={searchId} onChange={(e) => setSearchId(e.target.value)}/>
              <button style={{ marginLeft: "2%", padding: "1%", borderRadius: "5px", border: "none", width: "80px", backgroundColor: "rgb(158, 153, 153)" }} onClick={handleSearchId}>Buscar</button>
            </div>
            
          </div>
        </section>
        <section>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <h3>{pokemons?.length > 0 ? pokemons?.length : ""} Resultado/s</h3>
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", alignItems: "stretch" }}>
            {pokemons.length > 0 ? (
              pokemons.map((poke) => (
                <div key={poke.id} style={{ width: "20%", margin: "1%", padding: "1%", borderRadius: "5px", boxShadow: "0 0 5px rgb(0, 0, 0)", backgroundColor: "rgb(201, 200, 169)" }}>
                  <div>
                    <label><b>ID:</b> {poke.identificate}</label>
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                    <img style={{ width: "70%", filter: "drop-shadow(5px 5px 10px rgba(0, 0, 0, 0.54))" }} src={poke.image} alt={poke.name} />
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                    <label><b>{poke.name.toUpperCase()}</b></label>
                  </div>
                    <div>
                      <label><b>Tipo:</b> {poke?.types?.map(a=> a?.name)?.join(" ")}</label>
                    </div>
                  </div>
                  
                  <div style={{ display: "flex" }}>
                    <span style={{ fontSize: "12px", fontWeight: "bold" }}>
                      Vida: {poke.life}
                    </span>
                    <div style={{width: "60%",backgroundColor: "#e0e0e0",borderRadius: "5px",overflow: "hidden",marginTop: "5px", marginLeft: "5px"}}>
                      <div style={{ height: "10px", width: `${(poke.life / 300) * 100}%`, background: "linear-gradient(90deg, #ff9800, #ff5722)", transition: "width 0.5s ease-in-out", }} >
                      </div>
                    </div>
                  </div>
                  <div style={{ display: "flex" }}>
                    <span style={{ fontSize: "12px", fontWeight: "bold" }}>
                      Ataque: {poke.attack}
                    </span>
                    <div style={{width: "60%",backgroundColor: "#e0e0e0",borderRadius: "5px",overflow: "hidden",marginTop: "5px", marginLeft: "5px"}}>
                      <div style={{ height: "10px", width: `${(poke.attack / 200) * 100}%`, background: "linear-gradient(90deg, #ff9800, #ff5722)", transition: "width 0.5s ease-in-out", }} >
                      </div>
                    </div>
                  </div>
                  
                  <div style={{ display: "flex" }}>
                    <span style={{ fontSize: "12px", fontWeight: "bold" }}>
                      Defensa: {poke.defense}
                    </span>
                    <div style={{width: "60%",backgroundColor: "#e0e0e0",borderRadius: "5px",overflow: "hidden",marginTop: "5px", marginLeft: "5px"}}>
                      <div style={{ height: "10px", width: `${(poke.defense / 200) * 100}%`, background: "linear-gradient(90deg, #ff9800, #ff5722)", transition: "width 0.5s ease-in-out", }} >
                      </div>
                    </div>
                  </div>
                  <div style={{ display: "flex" }}>
                    <span style={{ fontSize: "12px", fontWeight: "bold" }}>
                      velocidad: {poke.speed}
                    </span>
                    <div style={{width: "60%",backgroundColor: "#e0e0e0",borderRadius: "5px",overflow: "hidden",marginTop: "5px", marginLeft: "5px"}}>
                      <div style={{ height: "10px", width: `${(poke.speed / 200) * 100}%`, background: "linear-gradient(90deg, #ff9800, #ff5722)", transition: "width 0.5s ease-in-out", }} >
                      </div>
                    </div>
                  </div>
                  <div style={{ display: "flex" }}>
                    <span style={{ fontSize: "12px", fontWeight: "bold" }}>
                      Ataque Espec: {poke.specialAttack}
                    </span>
                    <div style={{width: "60%",backgroundColor: "#e0e0e0",borderRadius: "5px",overflow: "hidden",marginTop: "5px", marginLeft: "5px"}}>
                      <div style={{ height: "10px", width: `${(poke.specialAttack / 200) * 100}%`, background: "linear-gradient(90deg, #ff9800, #ff5722)", transition: "width 0.5s ease-in-out", }} >
                      </div>
                    </div>
                  </div>
                  <div style={{ display: "flex" }}>
                    <span style={{ fontSize: "12px", fontWeight: "bold" }}>
                      Defensa Espec: {poke.specialDefense}
                    </span>
                    <div style={{width: "55%",backgroundColor: "#e0e0e0",borderRadius: "5px",overflow: "hidden",marginTop: "5px", marginLeft: "5px"}}>
                      <div style={{ height: "10px", width: `${(poke.specialDefense / 200) * 100}%`, background: "linear-gradient(90deg, #ff9800, #ff5722)", transition: "width 0.5s ease-in-out", }} >
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p>No se encontraron Pokémon.</p>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Pokemon;

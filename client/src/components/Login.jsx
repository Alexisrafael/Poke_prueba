import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { login } from "../store/authSlice";
import { loginUser } from "../services/authService";
import { useNavigate } from "react-router-dom"; // Importa useNavigate

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate(); // Hook para redireccionar


  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const data = await loginUser(email, password);
      dispatch(login({ user: data.user, token: data.token }));
      navigate("/pokemon"); // Redirige al usuario a /pokemon
    } catch (error) {
      alert("Credenciales incorrectas");
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "10%"}}>
      <h2>Iniciar Sesión</h2>
      <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
        <input type="email" placeholder="Correo" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <br />
        <input type="password" placeholder="Contraseña" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <br />
        <button type="submit">Login</button>
      </form>
      <br />
      <p>¿No tienes cuenta? <button onClick={() => navigate("/register")}>Regístrate</button></p>
    </div>
  );
};

export default Login;


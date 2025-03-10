import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { register } from "../store/authSlice";
import { registerUser } from "../services/authService";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    lastName: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = await registerUser(form.name, form.lastName, form.email, form.password);
      if(data?.user){
        dispatch(register({ user: data.user })); // Actualiza Redux
        
        alert(`Usuario registrado con éxito con el correo: ${form.email}`);
  
        setForm({ name: "", lastName: "", email: "", password: "" }); // Limpia el formulario
  
        navigate("/login"); // Redirige después del registro
      }else{
        alert("Error en el registro de usuario.");
      }

    } catch (error) {
      alert("Error en el registro");
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "8%"}}>
      <h2>Registro</h2>
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
        <br />
        <input type="text" name="name" placeholder="Nombre" value={form.name} onChange={handleChange} required />
        <br />
        <input type="text" name="lastName" placeholder="Apellido" value={form.lastName} onChange={handleChange} required />
        <br />
        <input type="email" name="email" placeholder="Correo" value={form.email} onChange={handleChange} required />
        <br />
        <input type="password" name="password" placeholder="Contraseña" value={form.password} onChange={handleChange} required />
        <br />
        <button type="submit">Registrarse</button>
      </form>
      <br />
      <p>¿Ya tienes cuenta? <button onClick={() => navigate("/login")}>Inicia Sesión</button></p>
    </div>
  );
};

export default Register;


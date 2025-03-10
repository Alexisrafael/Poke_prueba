import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./components/Login";
import Pokemon from "./components/Pokemon";
import PrivateRoute from "./components/PrivateRoute";
import Register from "./components/Register";
import { useSelector } from "react-redux";

function App() {
  const isAuthenticated = useSelector((state) => state.auth?.isAuthenticated ?? false);
  return (
    <Router>
      <Routes>
        <Route path="/login" element={isAuthenticated ? <Navigate to="/pokemon" /> : <Login />} />
        <Route path="/register" element={isAuthenticated ? <Navigate to="/pokemon" /> : <Register />} />
        <Route path="/pokemon" element={<PrivateRoute><Pokemon /></PrivateRoute>} />
        <Route path="/" element={isAuthenticated ? <Navigate to="/pokemon" /> : <Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;


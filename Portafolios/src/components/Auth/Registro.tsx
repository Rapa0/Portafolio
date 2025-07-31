import { useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import "../../styles/Auth.css";

export default function Registro() {
  const { register, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const isValidEmail = (email: string) => /\S+@\S+\.\S+/.test(email);

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMsg("");

    if (!email || !isValidEmail(email)) {
      setErrorMsg("Por favor, ingresa un email válido.");
      return;
    }

    if (!password || password.length < 6) {
      setErrorMsg("La contraseña debe tener al menos 6 caracteres.");
      return;
    }

    if (password !== confirmPassword) {
      setErrorMsg("Las contraseñas no coinciden.");
      return;
    }

    try {
      await register(email, password);
      await logout();
      navigate("/login");
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Error al registrar.";
      setErrorMsg(message);
      console.error("Error en registro:", error);
    }
  };

  return (
    <div className="auth-container">
      <h2>Registro</h2>
      {errorMsg && <p className="error">{errorMsg}</p>}
      <form className="auth-form" onSubmit={handleRegister}>
        <input
          type="email"
          placeholder="Correo electrónico"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Confirmar Contraseña"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
        <button type="submit">Registrar</button>
      </form>
      <div className="auth-link">
        <p>
          ¿Ya tienes cuenta? <Link to="/login">Inicia sesión aquí</Link>
        </p>
      </div>
    </div>
  );
}

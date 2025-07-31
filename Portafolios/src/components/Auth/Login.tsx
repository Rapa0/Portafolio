import { useState, useContext, useEffect } from "react";
import { AuthContext } from "../../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import "../../styles/Auth.css";

export default function Login() {
  const { login, user, loading: authLoading } = useContext(AuthContext);
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const isValidEmail = (email: string) => /\S+@\S+\.\S+/.test(email);

  useEffect(() => {
    if (!authLoading && user) {
      navigate("/");
    }
  }, [user, authLoading, navigate]);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMsg("");

    if (!email || !isValidEmail(email)) {
      setErrorMsg("Por favor, ingresa un email válido.");
      return;
    }

    if (!password) {
      setErrorMsg("Debes ingresar la contraseña.");
      return;
    }

    try {
      await login!(email, password);
    } catch (error: unknown) {
      if (error instanceof Error) {
        setErrorMsg("Credenciales incorrectas o usuario no encontrado.");
      } else {
        setErrorMsg("Error desconocido al iniciar sesión.");
      }
    }
  };

  if (authLoading || user) {
    return null;
  }

  return (
    <div className="auth-container">
      <h2>Iniciar Sesión</h2>
      {errorMsg && <p className="error">{errorMsg}</p>}
      <form className="auth-form" onSubmit={handleLogin}>
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
        <button type="submit">Login</button>
      </form>
      <div className="auth-link">
        <p>
          ¿No tienes cuenta? <Link to="/registro">Regístrate aquí</Link>
        </p>
        <p>
          <Link to="/forgot-password">Olvidé mi contraseña</Link>
        </p>
      </div>
    </div>
  );
}

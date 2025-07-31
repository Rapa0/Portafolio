import React, { useState } from "react";
import { getAuth, sendPasswordResetEmail } from "firebase/auth";
import { useNavigate, Link } from "react-router-dom";
import "../../styles/ForgotPassword.css"; // Ruta corregida para ForgotPassword.css

export default function ForgotPassword() {
  const [email, setEmail] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const auth = getAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMsg("");
    setMessage("");
    setIsLoading(true);
    try {
      await sendPasswordResetEmail(auth, email);
      setMessage("Se ha enviado un correo para restablecer tu contraseña.");
      setTimeout(() => navigate("/login"), 3000);
    } catch (error: unknown) {
      if (error instanceof Error) {
        if ('code' in error && error.code === 'auth/user-not-found') {
          setErrorMsg("No se encontró una cuenta con ese correo electrónico.");
        } else {
          setErrorMsg(error.message);
        }
      } else {
        setErrorMsg("Error desconocido.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="forgot-password-container">
      <h2>Recuperar Contraseña</h2>
      {message && <p className="success">{message}</p>}
      {errorMsg && <p className="error">{errorMsg}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Ingresa tu correo electrónico"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button type="submit" disabled={isLoading}>
          {isLoading ? "Enviando..." : "Enviar correo de recuperación"}
        </button>
      </form>
      <p>
        <Link to="/login">Volver al Login</Link>
      </p>
    </div>
  );
}

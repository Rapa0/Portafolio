
import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext"; 
import "../styles/Home.css"; 

const Home: React.FC = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleProjectsClick = () => {
    navigate("/proyectos"); 
  };

  return (
    <div className="home-container">
      <h1>Bienvenido a Mi Portafolio Personal</h1>
      <p>Explora mis proyectos y descubre más sobre mi trabajo.</p>
      <div className="button-group">
        <a onClick={handleProjectsClick} style={{ cursor: "pointer" }}>
          Ver Proyectos
        </a>
        
      </div>
      {user && (
        <p className="welcome-message">¡Qué bueno verte de nuevo, {user.email}!</p>
      )}
    </div>
  );
};

export default Home;
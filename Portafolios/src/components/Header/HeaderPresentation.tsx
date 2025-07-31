import React from "react";
import { Link } from "react-router-dom";
import styles from "./Header.module.css";
import type { User } from 'firebase/auth'; // Importar el tipo User de firebase/auth

interface HeaderPresentationProps {
  user?: User | null; // Usar el tipo User de firebase/auth, que ya incluye 'isAnonymous'
  onLogout: () => void;
}

const HeaderPresentation: React.FC<HeaderPresentationProps> = ({ user, onLogout }) => {
  return (
    <header className={styles.header}>
      <div className={styles["header-content"]}>
        <div className={styles["logo-container"]}>
          <h1 className={styles.logo}>Mi Portafolio Profesional</h1>
          <Link to="/" className={styles["home-btn"]}>
            Inicio
          </Link>
        </div>
        <nav className={styles["main-nav"]}>
          {/* El enlace a proyectos solo se muestra si el usuario existe Y NO es anónimo */}
          {user && !user.isAnonymous && (
             <Link to="/proyectos" className={styles["nav-link"]}>Proyectos</Link>
          )}
        </nav>
        <div className={styles["auth-info"]}>
          {user && !user.isAnonymous ? (
            // Usuario logeado (no anónimo): mostrar Bienvenido y Cerrar Sesión
            <>
              <p className={styles["user-email"]}>Bienvenido, {user.email}</p>
              <button className={styles["logout-btn"]} onClick={onLogout}>
                Cerrar Sesión
              </button>
            </>
          ) : (
            // Usuario no logeado o usuario anónimo: mostrar Iniciar Sesión
            <Link to="/login" className={styles["login-btn"]}>
              Iniciar Sesión
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default React.memo(HeaderPresentation);

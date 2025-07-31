import React, { useContext } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import styles from './Header.module.css';

const Header: React.FC = () => {
  const { user, logout } = useContext(AuthContext);

  const handleLogout = async () => {
    if (logout) {
      try {
        await logout();
      } catch (error) {
        console.error("Error al cerrar sesión:", error);
      }
    }
  };

  return (
    <header className={styles.header}>
      <div className={styles['header-content']}>
        <div className={styles['logo-container']}>
          <h1 className={styles.logo}>Mi Portafolio</h1>
          <Link to="/" className={styles['home-btn']}>Inicio</Link>
        </div>
        <nav className={styles['main-nav']}>
          <NavLink to="/proyectos" className={({ isActive }) => isActive ? `${styles['nav-link']} ${styles.active}` : styles['nav-link']}>
            Proyectos
          </NavLink>
          {/* Enlaces "Acerca de" y "Contacto" eliminados */}
        </nav>
        <div className={styles['auth-info']}>
          {user ? (
            <>
              <p className={styles['user-email']}>{user.email || 'Usuario Anónimo'}</p>
              <button onClick={handleLogout} className={styles['logout-btn']}>Cerrar Sesión</button>
            </>
          ) : (
            <Link to="/login" className={styles['login-btn']}>Iniciar Sesión</Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;

import React from 'react';
import styles from './Footer.module.css';

const Footer: React.FC = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles['footer-content']}>
        <p>© {new Date().getFullYear()} Mi Portafolio Profesional. Todos los derechos reservados.</p>
        <div className={styles['social-links']}>
          <a href="https://github.com/Rapa0" target="_blank" rel="noopener noreferrer">GitHub</a>
          {/* Puedes añadir más enlaces a redes sociales aquí */}
        </div>
      </div>
    </footer>
  );
};

export default Footer;

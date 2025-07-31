import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthProvider";
import Header from "./components/Header";
import Home from "./components/Home";
import Login from "./components/Auth/Login";
import Registro from "./components/Auth/Registro";
import ForgotPassword from "./components/Auth/ForgotPassword";
import Proyectos from "./components/Proyectos/Proyectos";
import Footer from "./components/Footer/Footer";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "./context/AuthContext";
import type { JSX } from "react";
import './styles/App.css'; 

import { auth as firebaseAuthInstance, db as firestoreDbInstance } from './firebaseConfig';
import type { Auth } from 'firebase/auth';
import type { Firestore } from 'firebase/firestore';
import { signInWithCustomToken } from 'firebase/auth';

declare const __initial_auth_token: string | undefined;

function App() {
  const [db, setDb] = useState<Firestore | null>(null);
  const [auth, setAuth] = useState<Auth | null>(null);
  const [isAuthReady, setIsAuthReady] = useState(false);

  useEffect(() => {
    setDb(firestoreDbInstance);
    setAuth(firebaseAuthInstance);

    const unsubscribe = firebaseAuthInstance.onAuthStateChanged(async (user) => {
      if (!user) {
        if (typeof __initial_auth_token !== 'undefined' && __initial_auth_token) {
          try {
            await signInWithCustomToken(firebaseAuthInstance, __initial_auth_token);
          } catch (error) {
            console.error("Error signing in with custom token:", error);
          }
        }
      }
      setIsAuthReady(true);
    });

    return () => unsubscribe();
  }, []);

  if (!isAuthReady) {
    return <div>Cargando autenticación...</div>;
  }

  return (
    <AuthProvider firebaseDb={db!} firebaseAuth={auth!}>
      <BrowserRouter>
        <Header />
        <div className="app-content-wrapper">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={
              <div className="auth-page-background">
                <Login />
              </div>
            } />
            <Route path="/registro" element={
              <div className="auth-page-background">
                <Registro />
              </div>
            } />
            <Route
              path="/forgot-password"
              element={
                <PublicRoute>
                  <div className="auth-page-background">
                    <ForgotPassword />
                  </div>
                </PublicRoute>
              }
            />
            {/* Ruta /proyectos protegida: solo accesible si el usuario está autenticado Y NO es anónimo */}
            <Route 
              path="/proyectos" 
              element={
                <ProtectedRoute>
                  <Proyectos />
                </ProtectedRoute>
              } 
            />
            {/* Eliminada la ruta duplicada /proyectos y otras no utilizadas */}
            {/* <Route path="/proyectos" element={<div><h1>Mis Proyectos</h1><p>Contenido de proyectos...</p></div>} /> */}
            {/* <Route path="/acerca-de" element={<div><h1>Acerca de Mí</h1><p>Información sobre ti...</p></div>} /> */}
            {/* <Route path="/contacto" element={<div><h1>Contacto</h1><p>Formulario de contacto...</p></div>} /> */}
          </Routes>
        </div>
        <Footer />
      </BrowserRouter>
    </AuthProvider>
  );
}

function ProtectedRoute({ children }: { children: JSX.Element }) {
  const { user, loading } = useContext(AuthContext);
  
  if (loading) {
    return null; 
  }

  if (!user || user.isAnonymous) {
    return <Navigate to="/login" />;
  }

  return children;
}

function PublicRoute({ children }: { children: JSX.Element }) {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return null;
  }

  if (user && !user.isAnonymous) { 
    return <Navigate to="/proyectos" />;
  }

  return children;
}

export default App;

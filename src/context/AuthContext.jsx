import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null);
  const [token, setToken] = useState(null);
  const [cargandoSesion, setCargandoSesion] = useState(true);

  useEffect(() => {
    const usuarioGuardado = localStorage.getItem("helpdesk-user");
    const tokenGuardado = localStorage.getItem("helpdesk-token");

    if (usuarioGuardado && tokenGuardado) {
      setUsuario(JSON.parse(usuarioGuardado));
      setToken(tokenGuardado);
    }

    setCargandoSesion(false);
  }, []);

  const iniciarSesion = ({ usuario, token }) => {
    setUsuario(usuario);
    setToken(token);

    localStorage.setItem("helpdesk-user", JSON.stringify(usuario));
    localStorage.setItem("helpdesk-token", token);
  };

  const cerrarSesion = () => {
    setUsuario(null);
    setToken(null);

    localStorage.removeItem("helpdesk-user");
    localStorage.removeItem("helpdesk-token");
  };

  const estaAutenticado = Boolean(usuario && token);

  return (
    <AuthContext.Provider
      value={{
        usuario,
        token,
        estaAutenticado,
        cargandoSesion,
        iniciarSesion,
        cerrarSesion,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth debe usarse dentro de AuthProvider");
  }

  return context;
}
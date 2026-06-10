import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null);
  const [cargandoSesion, setCargandoSesion] = useState(true);

  useEffect(() => {
    const usuarioGuardado = localStorage.getItem("helpdesk-user");

    if (usuarioGuardado) {
      setUsuario(JSON.parse(usuarioGuardado));
    }

    setCargandoSesion(false);
  }, []);

  const iniciarSesion = (usuarioAutenticado) => {
    setUsuario(usuarioAutenticado);
    localStorage.setItem("helpdesk-user", JSON.stringify(usuarioAutenticado));
  };

  const cerrarSesion = () => {
    setUsuario(null);
    localStorage.removeItem("helpdesk-user");
  };

  const estaAutenticado = Boolean(usuario);

  return (
    <AuthContext.Provider
      value={{
        usuario,
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
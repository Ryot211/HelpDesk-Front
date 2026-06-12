
export const ROLES ={
    ADMIN: "ADMIN",
    SOPORTE:"SOPORTE",
    USUARIO_FINAL : "USUARIO",
};

export const obtenerCodigoRol = (usuario) =>{
    return usuario?.rol?.codigo || "";
};

export const tieneRol =(usuario, rolesPermitidos = [])=>{
    const codigoRol = obtenerCodigoRol(usuario);

    return rolesPermitidos.includes(codigoRol);
}

export const esAdmin = (usuario)=> {
    return obtenerCodigoRol(usuario) === Roles.ADMIN;
};

export const esSoporte = (usuario)=>{
    return obtenerCodigoRol(usuario) === Roles.SOPORTE;
};

export const esUsuarioFinal =(Usuario)=>{
    return obtenerCodigoRol(usuario) === Roles.USUARIO_FINAL;
}
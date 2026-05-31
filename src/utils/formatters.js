export const formatearFecha = (fecha) =>{
    if(!fecha){
        return "No tiene fecha";
    }

    const date = new Date(fecha);

    if(Number.isNaN(date.getTime())){
        return fecha;
    }

    return date.toLocaleDateString("es-Ec",{
        year:"numeric",
        month:"2-digit",
        day:"2-digit",
        hour:"2-digit",
        minute:"2-digit",

        }
    );
};
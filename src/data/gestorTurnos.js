const fs = require('fs');
const path = require('path');

const rutaArchivo = path.join(__dirname, 'turnos.json');

const obtenerTurnos = () => {
    try {
        const datos = fs.readFileSync(rutaArchivo, 'utf-8');
        return JSON.parse(datos);
    } catch (error) {
        return [];
    }
};

const guardarTurno = (datosTurno) => {
    const turnos = obtenerTurnos();
    
    const nuevoTurno = {
        id: turnos.length > 0 ? turnos[turnos.length - 1].id + 1 : 1,
        cliente: datosTurno.cliente.trim(),
        telefono: datosTurno.telefono.trim(),
        dni: datosTurno.dni.trim(),
        fecha: datosTurno.fecha,
        hora: datosTurno.hora,
        servicio: datosTurno.servicio
    };

    turnos.push(nuevoTurno);
    fs.writeFileSync(rutaArchivo, JSON.stringify(turnos, null, 2), 'utf-8');
    return nuevoTurno;
};

module.exports = {
    obtenerTurnos,
    guardarTurno
};
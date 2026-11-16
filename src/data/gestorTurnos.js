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

    try {
        const turnos = obtenerTurnos();

        // Verifica coincidencia de fecha, hora Y servicio
        const turnoOcupado = turnos.some(
            (turno) => 
                turno.fecha === datosTurno.fecha && 
                turno.hora === datosTurno.hora && 
                turno.servicio === datosTurno.servicio
        );

        if (turnoOcupado) {
            throw new Error(`Ya existe un turno reservado para ${datosTurno.servicio} el ${datosTurno.fecha} a las ${datosTurno.hora}.`);
        }
        
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
    
    } catch (error) {
        throw new Error('Error al guardar el turno: ' + error.message);
    }
};

const eliminarTurno = (id) => {
    let turnos = obtenerTurnos();
    // Filtro para dejar todos los turnos excepto el que coincide con el ID
    const turnosFiltrados = turnos.filter(turno => turno.id !== parseInt(id));
    
    // Si la longitud cambió, significa que se eliminó el turno
    if (turnos.length !== turnosFiltrados.length) {
        fs.writeFileSync(rutaArchivo, JSON.stringify(turnosFiltrados, null, 2), 'utf-8');
        return true; // Se eliminó con éxito
    }
    return false; // No se encontró el ID
};

module.exports = {
    obtenerTurnos,
    guardarTurno,
    eliminarTurno // <-- Asegúrate de exportar la nueva función
};
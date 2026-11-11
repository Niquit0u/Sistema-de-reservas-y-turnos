document.addEventListener('DOMContentLoaded', () => {
    cargarTurnos();
});

async function cargarTurnos() {
    const contenedorTabla = document.getElementById('lista-turnos');

    try {
        // Requisito 7: Consumo de endpoint propio con Fetch API
        const response = await fetch('/api/turnos');
        if (!response.ok) {
            throw new Error('Hubo un problema al pedir los datos.');
        }

        const turnos = await response.json();
        contenedorTabla.innerHTML = '';

        if (turnos.length === 0) {
            contenedorTabla.innerHTML = '<tr><td colspan="7">No hay turnos registrados todavía.</td></tr>';
            return;
        }

        // Actualización del DOM con los datos recibidos
        turnos.forEach(turno => {
            const fila = document.createElement('tr');
            fila.innerHTML = `
                <td>#${turno.id}</td>
                <td><strong>${turno.cliente}</strong></td>
                <td>${turno.dni}</td>
                <td>${turno.telefono}</td>
                <td>${turno.fecha}</td>
                <td>${turno.hora}</td>
                <td>${turno.servicio}</td>
            `;
            contenedorTabla.appendChild(fila);
        });
    } catch (error) {
        console.error('Error:', error);
        contenedorTabla.innerHTML = '<tr><td colspan="7">Error al cargar los turnos.</td></tr>';
    }
}
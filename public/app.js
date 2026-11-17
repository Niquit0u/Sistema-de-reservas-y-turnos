document.addEventListener('DOMContentLoaded', () => {
    cargarTurnos();
    document.getElementById('formulario-turno').addEventListener('submit', guardarTurno);
});

let turnosActuales = [];

async function guardarTurno(event) {
    event.preventDefault();

    const formulario = event.currentTarget;
    const boton = formulario.querySelector('button[type="submit"]');
    boton.disabled = true;

    try {
        const response = await fetch(formulario.action, {
            method: formulario.method,
            body: new URLSearchParams(new FormData(formulario))
        });

        if (!response.ok) {
            throw new Error('No se pudo guardar el turno.');
        }

        formulario.reset();
        await cargarTurnos();
    } catch (error) {
        console.error('Error al guardar el turno:', error);
        alert('No se pudo guardar el turno. Intenta nuevamente.');
    } finally {
        boton.disabled = false;
    }
}

async function cargarTurnos() {
    const contenedorTabla = document.getElementById('lista-turnos');

    try {
        // Consumo de endpoint propio con Fetch API
        const response = await fetch('/api/turnos');
        if (!response.ok) {
            throw new Error('Hubo un problema al pedir los datos.');
        }

        const turnos = await response.json();
        turnosActuales = turnos;
        contenedorTabla.innerHTML = '';

        if (turnos.length === 0) {
            contenedorTabla.innerHTML = '<tr><td colspan="8">No hay turnos registrados todavía.</td></tr>';
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
                <td>
                    <button
                type="button"
                class="btn-editarTurno"
                onclick="editarTurno(${turno.id})"
                style="background-color: #2563eb; padding: 5px 10px; margin-top: 0; cursor: pointer;">
                Editar
                    </button>
                    <button
                type="button"
                        class="btn-cancelarTurno"
                        data-id="${turno.id}"
                        onclick="cancelarTurno(${turno.id})"
                        style="background-color: #dc2626; padding: 5px 10px; margin-top: 0; cursor: pointer;">
                        Cancelar
                    </button>
                </td>
            `;
            contenedorTabla.appendChild(fila);
        });
    } catch (error) {
        console.error('Error:', error);
        contenedorTabla.innerHTML = '<tr><td colspan="8">Error al cargar los turnos.</td></tr>';
    }
}

window.editarTurno = function(id) {
    const turno = turnosActuales.find((turnoActual) => turnoActual.id === id);
    const fila = document.querySelector(`button[onclick="editarTurno(${id})"]`).closest('tr');

    fila.innerHTML = `
        <td>#${turno.id}</td>
        <td><strong>${turno.cliente}</strong></td>
        <td>${turno.dni}</td>
        <td><input type="tel" value="${turno.telefono}" data-campo="telefono" required></td>
        <td><input type="date" value="${turno.fecha}" data-campo="fecha" required></td>
        <td><input type="time" value="${turno.hora}" data-campo="hora" required></td>
        <td>
            <select data-campo="servicio" required>
                ${['Consulta General', 'Asesoramiento Técnico', 'Mantenimiento', 'Atención Administrativa']
                    .map((servicio) => `<option ${servicio === turno.servicio ? 'selected' : ''}>${servicio}</option>`)
                    .join('')}
            </select>
        </td>
        <td>
            <button type="button" onclick="guardarEdicion(${turno.id})"
                style="background-color: #16a34a; padding: 5px 10px; margin-top: 0; cursor: pointer;">
                Guardar
            </button>
            <button type="button" onclick="cargarTurnos()"
                style="background-color: #64748b; padding: 5px 10px; margin-top: 0; cursor: pointer;">
                Cancelar
            </button>
        </td>
    `;
};

window.guardarEdicion = async function(id) {
    const fila = document.querySelector(`button[onclick="guardarEdicion(${id})"]`).closest('tr');
    const datos = Object.fromEntries(
        [...fila.querySelectorAll('[data-campo]')].map((campo) => [campo.dataset.campo, campo.value])
    );

    try {
        const response = await fetch(`/api/turnos/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(datos)
        });
        const resultado = await response.json();

        if (!response.ok) {
            throw new Error(resultado.error || 'No se pudo actualizar el turno.');
        }

        await cargarTurnos();
    } catch (error) {
        console.error('Error al actualizar el turno:', error);
        alert(error.message);
    }
};

window.cancelarTurno = async function(id) {
    console.log('Botón presionado. Intentando cancelar ID:', id);
    if (confirm('¿Estás seguro de que deseas cancelar este turno?')) {
        try {
            const response = await fetch(`/api/turnos/${id}`, {
                method: 'DELETE' // Método HTTP DELETE soportado por Fetch
            });
            
            if (response.ok) {
                // refresh
                cargarTurnos();
            } else {
                alert('Error al cancelar el turno.');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    }
}
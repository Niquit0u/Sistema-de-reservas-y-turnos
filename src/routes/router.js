const express = require('express');
const router = express.Router();
const gestorTurnos = require('../data/gestorTurnos');

// RUTA 1: GET /api/turnos -> Devuelve el listado de turnos en formato JSON
router.get('/api/turnos', (req, res) => {
    const turnos = gestorTurnos.obtenerTurnos();
    res.json(turnos);
});

// RUTA 2: POST /turnos -> Recibe el formulario, valida, guarda y redirige
router.post('/turnos', (req, res) => {
    const { cliente, telefono, dni, fecha, hora, servicio } = req.body;

    // Validación básica de los datos recibidos
    if (!cliente || !telefono || !dni || !fecha || !hora || !servicio) {
        return res.status(400).send(`
            <div style="font-family: sans-serif; text-align: center; margin-top: 50px;">
                <h2>Error 400: Datos incompletos</h2>
                <p>Todos los campos (cliente, teléfono, DNI, fecha, hora y servicio) son obligatorios.</p>
                <a href="/">Volver al formulario</a>
            </div>
        `);
    }

    try {
        // Guardar usando el módulo propio (si el turno está ocupado, lanza el error hacia el catch)
        gestorTurnos.guardarTurno({ cliente, telefono, dni, fecha, hora, servicio });
        res.redirect('/');
    } catch (error) {
        // alerta nativa en el navegador con el mensaje y regresa al formulario
        return res.status(400).send(`
            <script>
                alert("${error.message}");
                window.history.back();
            </script>
        `);
    }
});

// RUTA 3: PUT /api/turnos/:id -> Ruta para actualizar un turno por su ID
router.put('/api/turnos/:id', (req, res) => {
    const { telefono, fecha, hora, servicio } = req.body;

    if (!telefono || !fecha || !hora || !servicio) {
        return res.status(400).json({ error: 'Teléfono, fecha, hora y servicio son obligatorios.' });
    }

    try {
        const turnoActualizado = gestorTurnos.actualizarTurno(req.params.id, {
            telefono,
            fecha,
            hora,
            servicio
        });

        if (!turnoActualizado) {
            return res.status(404).json({ error: 'Turno no encontrado.' });
        }

        res.json(turnoActualizado);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// RUTA 4: GET /mis-turnos -> Redireccionamiento desde una ruta alternativa/antigua
router.get('/mis-turnos', (req, res) => {
    res.redirect('/');
});

// RUTA 5: GET /info -> Información del sistema
router.get('/info', (req, res) => {
    res.send(`
        <div style="font-family: sans-serif; max-width: 600px; margin: 40px auto; line-height: 1.6;">
            <h1>Información del Sistema de Turnos</h1>
            <p>Aplicación web desarrollada con Node.js y Express para la Actividad Integradora.</p>
            <ul>
                <li><strong>Campos registrados:</strong> ID, Cliente, Teléfono, DNI, Fecha, Hora y Servicio.</li>
                <li><strong>Endpoint JSON disponible en:</strong> <a href="/api/turnos">/api/turnos</a></li>
            </ul>
            <a href="/">⬅ Volver al inicio</a>
        </div>
    `);
});

// RUTA 6: DELETE /api/turnos/:id -> Ruta para eliminar un turno por su ID
router.delete('/api/turnos/:id', (req, res) => {
    const id = req.params.id;
    const eliminado = gestorTurnos.eliminarTurno(id);
    
    if (eliminado) {
        res.json({ mensaje: 'Turno cancelado exitosamente.' });
    } else {
        res.status(404).json({ error: 'Turno no encontrado.' });
    }
});

module.exports = router;

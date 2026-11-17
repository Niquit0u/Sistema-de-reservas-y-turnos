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
        return res.status(400).json({ error: 'Todos los campos (cliente, teléfono, DNI, fecha, hora y servicio) son obligatorios.' });
    }

    try {
        // Guardar usando el módulo propio (si el turno está ocupado, lanza el error hacia el catch)
        gestorTurnos.guardarTurno({ cliente, telefono, dni, fecha, hora, servicio });
        res.redirect('/');
    } catch (error) {
        return res.status(400).json({ error: error.message });
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
    res.send(`<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Información del Sistema - Turnos</title>
    <link rel="stylesheet" href="/styles.css">
</head>
<body>
    <header>
        <div class="header-contenido">
            <h1>Gestión de Reservas y Turnos</h1>
            <nav>
                <a href="/">Inicio</a>
                <a href="/info">Información del Sistema</a>
                <a href="/api/turnos" target="_blank">Ver JSON</a>
            </nav>
        </div>
    </header>

    <main style="max-width: 700px; margin: 0 auto;">
        <section class="tarjeta" style="line-height: 1.8;">
            <h2>Información del Sistema de Turnos</h2>
            <p>Aplicación web desarrollada con Node.js y Express para la Actividad Integradora.</p>
            <ul style="margin: 15px 0 20px 20px;">
                <li><strong>Campos registrados:</strong> ID, Cliente, Teléfono, DNI, Fecha, Hora y Servicio.</li>
                <li><strong>Validación de turnos:</strong> Debe haber al menos 15 minutos de diferencia entre turnos del mismo servicio y fecha.</li>
                <li><strong>Endpoint JSON disponible en:</strong> <a href="/api/turnos">/api/turnos</a></li>
            </ul>
            <a href="/" style="color: #2563eb; font-weight: 600; text-decoration: none;">⬅ Volver al inicio</a>
        </section>
    </main>
</body>
</html>`);
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

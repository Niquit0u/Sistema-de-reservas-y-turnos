const express = require('express');
const router = express.Router();
const gestorTurnos = require('../data/gestorTurnos');

// RUTA 1: GET /api/turnos -> Devuelve el listado de turnos en formato JSON (Requisito 4)
router.get('/api/turnos', (req, res) => {
    const turnos = gestorTurnos.obtenerTurnos();
    res.json(turnos);
});

// RUTA 2: POST /turnos -> Recibe el formulario, valida, guarda y redirige (Requisitos 4, 5 y 9)
router.post('/turnos', (req, res) => {
    const { cliente, telefono, dni, fecha, hora, servicio } = req.body;

    // Requisito 9: Validación básica de los datos recibidos
    if (!cliente || !telefono || !dni || !fecha || !hora || !servicio) {
        return res.status(400).send(`
            <div style="font-family: sans-serif; text-align: center; margin-top: 50px;">
                <h2>Error 400: Datos incompletos</h2>
                <p>Todos los campos (cliente, teléfono, DNI, fecha, hora y servicio) son obligatorios.</p>
                <a href="/">Volver al formulario</a>
            </div>
        `);
    }

    // Guardar usando el módulo propio
    gestorTurnos.guardarTurno({ cliente, telefono, dni, fecha, hora, servicio });

    // Requisito 5 (Situación 1): Redireccionar después de procesar un formulario POST
    res.redirect('/');
});

// RUTA 3: GET /mis-turnos -> Redireccionamiento desde una ruta alternativa/antigua (Requisito 5 - Situación 2)
router.get('/mis-turnos', (req, res) => {
    res.redirect('/');
});

// RUTA 4: GET /info -> Cuarta ruta obligatoria con información del sistema (Requisito 4)
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

module.exports = router;
const express = require('express');
const path = require('path');
const turnosRoutes = require('./src/routes/turnosRoutes')

const app = express();
const PORT = process.env.PORT || 3000; // Puerto configurable

// Middlewares para procesar JSON y datos de formularios HTML
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware propio de log (visto en el material de Express)
const loggerMiddleware = (req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
};
app.use(loggerMiddleware);

// Servir archivos estáticos del lado del cliente (HTML, CSS, JS)
app.use(express.static(path.join(__dirname, 'src')));

// Usar el módulo de rutas propio
app.use('/', turnosRoutes);

// Requisito 9: Ruta 404 personalizada para rutas no existentes
app.use((req, res) => {
    res.status(404).send(`
        <div style="font-family: sans-serif; text-align: center; margin-top: 50px;">
            <h1>Error 404 - Página no encontrada</h1>
            <p>La ruta <strong>${req.url}</strong> no existe en este sistema de turnos.</p>
            <a href="/">Volver a la página principal</a>
        </div>
    `);
});

app.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
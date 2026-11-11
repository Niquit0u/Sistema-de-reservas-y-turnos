require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path'); // Necesario para la ruta de archivos estáticos
const config = require('./src/config/config');
const router = require('./src/routes/router');

const app = express();

// Middlewares
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true })); // <-- FALTABA: Para leer los datos del form HTML
app.use(cors());

// Servir archivos estáticos del cliente
// Asegúrate de que tu carpeta de frontend se llame 'public'
app.use(express.static(path.join(__dirname, 'public'))); // <-- FALTABA: Para cumplir el Req 6

// Rutas
app.use(router);

// Middleware para Ruta 404 personalizada
app.use((req, res) => {
    res.status(404).send('<h1>Error 404: Página no encontrada</h1><p>La ruta solicitada no existe.</p>');
}); // <-- FALTABA: Para cumplir el Req 9

const port = config.PORT || 5000;
app.listen(port, () => console.log(`Listening on port ${port}!`));
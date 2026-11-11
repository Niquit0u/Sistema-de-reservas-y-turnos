const express = require('express');
const app = express();

// Config para procesar datos (middlewares)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Endpoint de prueba
app.get('/', (req, res) => {
   res.send('Servidor de turnos funcionando');
});

// puerto configurable
const PORT = 3000;
app.listen(PORT, () => {
   console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
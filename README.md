# Sistema de Reservas y Turnos
# Descripción
 
El sistema permite registrar turnos para distintos servicios (consulta general, asesoramiento técnico, mantenimiento y atención administrativa) desde un formulario web y ver el listado de turnos ya registrados.

## Integrantes
 
- Arias Navarrete Nicolás
- Olivera Santiago

## Instalación y ejecución
 
### Requisitos previos
 
- [Node.js](https://nodejs.org/) versión 18 o superior
- npm (viene con Node.js)
### Pasos
 
1. Clonar el repositorio:
```bash
git clone https://github.com/Niquit0u/Sistema-de-reservas-y-turnos.git
cd Sistema-de-reservas-y-turnos
```
 
2. Instalar las dependencias:
```bash
npm install
```
 
3. Crear (o revisar) el archivo `.env` en la raíz del proyecto con el puerto a usar:
```
PORT=3000
```
 
   Si no se define, el servidor usa el puerto 5000.
 
4. Iniciar el servidor:
```bash
npm start
```
 
   o directamente:
 
```bash
node index.js
```
 
5. Abrir en el navegador: <http://localhost:3000>

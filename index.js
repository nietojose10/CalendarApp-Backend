const express = require('express');
require('dotenv').config();
const cors = require('cors')
const { dbConnection } = require('./database/config');


//Crear el servidor de express
const app = express();

//Base de datos
dbConnection();

// CORS
app.use( cors() );

//Directorio Publico
//El use es considerado un middleware( es una funcion que se ejecuta en el momento en que alguien consulta el servidor )
//Usaremos el use para establecer un directorio publico
app.use(  express.static('public') );

//Lectura y parseo del body
app.use( express.json() );

//Rutas
app.use( '/api/auth', require('./routes/auth') );


// TODO: CRUD: Eventos

//Escuchar peticiones
app.listen( process.env.PORT, console.log(`Server running on ${ process.env.PORT }`) );
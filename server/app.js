import express, { json, urlencoded } from 'express';
import cors from 'cors';
import connection from './database/mysql.connection.js';

import { router } from './routes/routes.js';

//conexión de sequelize con la BD
connection.connection();

const app = express()

// Middleware para urlencoded
app.use(json())
app.use(urlencoded({ extended: false }))

app.use(cors())

app.use(router)

const port = process.env.PORT || 3001

app.listen(port, () => console.log(`Server running on port ${port}`))
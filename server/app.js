import express, { json, urlencoded } from 'express';
import cors from 'cors';
import mysql from './database/mysql.js'
import mongo from './database/mongo.js';
import cookieParser from 'cookie-parser';
import { router } from './routes/routes.js';

//conexión de sequelize con la BD
await mysql.connection();

await mongo.connectToMongo();

const app = express()

// Middleware para urlencoded
app.use(json())
app.use(urlencoded({ extended: false }))

app.use(cors())

app.use(cookieParser());

app.use(router)

const port = process.env.PORT || 3001

app.listen(port, () => console.log(`Server running on port ${port}`));
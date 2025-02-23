import express from 'express';
import { Server } from 'socket.io';
import { createServer } from 'node:http';

const port = process.env.PORT ?? 3001;
const app = express();
const server = createServer(app);

const io = new Server(server, {
    cors: {
        origin: '*',
        methods: ["GET", "POST"]
    }
});


//  Configuramos Socket.IO para estar a la escucha de nuevas conexiones.


io.on('connection', async (socket) => {
    console.log('A user has connected!');

    //Imprimimos en consola cada vez que un usuario se desconecte del sistema.

    socket.on('disconnect', () => {
        console.log('A user has disconnected!');
    });


    // Cada nueva conexión deberá estar a la escucha del evento 'chat message', el cual se activa cada vez que un usuario envia un mensaje.

    /* @param  message : Los datos enviados desde el cliente a 
                    través del socket. */


    socket.on('chat_message', async (message) => {
        io.emit('chat_message', message);
    });
});

server.listen(port, () => {
    console.log(`Server running on port ${port}`)
});
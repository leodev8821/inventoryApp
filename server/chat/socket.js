// 1. Conexión al servidor Socket.IO
const socket = io('http://localhost:3001');

// 2. Obtener referencias a elementos del DOM
const inputMensaje = document.getElementById('mensaje-input');
const botonEnviar = document.getElementById('enviar-boton');
const areaChat = document.getElementById('chat-area');

// 3. Evento 'connect' (Opcional, pero útil para depuración)
socket.on('connect', () => {
    console.log('Conectado al servidor Socket.IO');
});

// 4. Evento 'disconnect' (Opcional, también útil para depuración)
socket.on('disconnect', () => {
    console.log('Desconectado del servidor Socket.IO');
});

// 5. Escuchar el evento 'chat_message' del servidor (para recibir mensajes)
socket.on('chat_message', (data) => {
    console.log('Mensaje recibido:', data); // Para depuración, puedes ver el mensaje en la consola del navegador
    mostrarMensajeEnChat(data.message); // Llama a la función para mostrar el mensaje en la interfaz
});

// 6. Evento click del botón "Enviar"
botonEnviar.addEventListener('click', () => {
    const mensaje = inputMensaje.value;
    if (mensaje) {
        enviarMensaje(mensaje); // Llama a la función para enviar el mensaje al servidor
        inputMensaje.value = ''; // Limpiar el input después de enviar
    }
});

// 7. Función para enviar un mensaje al servidor
function enviarMensaje(mensaje) {
    socket.emit('chat_message', { message: mensaje }); // Emitir el evento 'chat_message' al servidor con el mensaje
}

// 8. Función para mostrar un mensaje en el área de chat
function mostrarMensajeEnChat(mensaje) {
    const nuevoMensaje = document.createElement('p'); // Crear un nuevo elemento <p> para el mensaje
    nuevoMensaje.textContent = mensaje; // Establecer el texto del párrafo con el mensaje recibido
    areaChat.appendChild(nuevoMensaje); // Añadir el párrafo al área de chat para que se visualice
    areaChat.scrollTop = areaChat.scrollHeight; // Hacer scroll automático hacia abajo para ver el último mensaje
}
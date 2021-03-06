var socket = io();

var searchParams = new URLSearchParams(window.location.search);

if (!searchParams.has('nombre') || !searchParams.has('sala') || searchParams.get('sala') != 'cgs-sala') {
    window.location = 'index.html';
    //throw new Error('El nombre y sala son necesarios');

}

var usuario = {
    nombre: searchParams.get('nombre'),
    sala: searchParams.get('sala')
};

socket.on('connect', function() {
    console.log(`Conectado a la sala ${usuario.sala}`);

    socket.emit('entrarChat', usuario, function(resp) {
        console.log('Usuarios conectados', resp);
        renderizarUsuarios(resp);
    });
});

// escuchar
socket.on('disconnect', function(resp) {
    console.log('Perdimos conexión con el servidor');
});

socket.on('crearMensaje', (resp) => {
    console.log('Servidor:', resp);
    renderizarMensajes(resp, false);
    scrollBottom();
});


// Cuando un usuario entra o sale del chat
socket.on('listaPersona', (resp) => {
    console.log('Servidor:', resp);
    renderizarUsuarios(resp);
})



//Mensajes privados
socket.on('mensajePrivado', function(mensaje) {
    console.log('Mensaje privado:', mensaje);
});
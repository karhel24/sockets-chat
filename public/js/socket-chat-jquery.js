/**
 * Se va a encargar de todas las funciones de renderizar y modificar el html
 */

var searchParams = new URLSearchParams(window.location.search);
var userNombre = searchParams.get('nombre');
var userSala = searchParams.get('sala');

//Referencias de JQuery

var divUsuarios = $('#divUsuarios');
var formEnviar = $('#formEnviar');
var txtMensaje = $('#txtMensaje');
var divChatbox = $('#divChatbox');

// Funciones para renderizar usuarios

function renderizarUsuarios(personas) {

    console.log(personas);

    var html = '';

    html += '<li>';
    html += '   <a href="javascript:void(0)" class="active"> Chat de <span> ' + searchParams.get('sala') + '</span></a>';
    html += '</li>';

    for (var i = 0; i < personas.length; i++) {

        html += '<li>';
        html += '    <a data-id="' + personas[i].id + '" href="javascript:void(0)"><img src="assets/images/users/' + (i + 1) + '.jpg" alt="user-img" class="img-circle"> <span>' + personas[i].nombre + ' <small class="text-success">online</small></span></a>';
        html += '</li>';

    }

    divUsuarios.html(html);

}

function renderizarMensajes(mensaje, owner) {

    var html = '';
    var fecha = new Date(mensaje.fecha);
    var hora = fecha.getHours() + ':' + fecha.getMinutes();

    var adminClass = 'info';

    if (mensaje.nombre === 'Administrador') {
        adminClass = 'danger';
    }

    if (!owner) {
        html += '<li class="animated fadeIn">'
        if (mensaje.nombre !== 'Administrador') {
            html += '<div class="chat-img"><img src="assets/images/users/1.jpg" alt="user" /></div>'
        }

        html += '<div class="chat-content">'
        html += '<h5>' + mensaje.nombre + '</h5>'
        html += '<div class="box bg-light-' + adminClass + '">' + mensaje.mensaje + '</div>'
        html += '</div>'
        html += '<div class="chat-time">' + hora + '</div>'
        html += '</li>'
    } else {
        html += '<li class="reverse">';
        html += '<div class="chat-content">';
        html += '<h5>' + mensaje.nombre + '</h5>';
        html += '<div class="box bg-light-inverse">' + mensaje.mensaje + '</div>';
        html += '</div>';
        html += '<div class="chat-img"><img src="assets/images/users/2.jpg" alt="user" /></div>';
        html += '<div class="chat-time">' + hora + '</div>';
        html += '</li>';
    }






    divChatbox.append(html);

}

//Listeners JQUery

divUsuarios.on('click', 'a', function() { // clicks sobre los <a> de html de donde estan los usuarios conectados

    var id = $(this).data('id');

    if (id) {
        console.log(id);
    }

});


formEnviar.on('submit', function(event) {

    event.preventDefault(); // Evita que se haga el submit al pulsar intro dentro de la caja de texto (input) donde va el mensaje

    if (txtMensaje.val().trim().length === 0) {
        return;

    }

    socket.emit('crearMensaje', { mensaje: txtMensaje.val() }, function(resp) {
        //Se usará la respuesta del callback del servidor para que en el cliente se borre la caja de texto
        //console.log(resp);
        txtMensaje.val('').focus();
        renderizarMensajes(resp, true);
        scrollBottom();
    });

});


function scrollBottom() {

    // selectors
    var newMessage = divChatbox.children('li:last-child');

    // heights
    var clientHeight = divChatbox.prop('clientHeight');
    var scrollTop = divChatbox.prop('scrollTop');
    var scrollHeight = divChatbox.prop('scrollHeight');
    var newMessageHeight = newMessage.innerHeight();
    var lastMessageHeight = newMessage.prev().innerHeight() || 0;

    if (clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight) {
        divChatbox.scrollTop(scrollHeight);
    }
}
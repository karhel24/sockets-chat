const { io } = require('../server');
const { Usuarios } = require('../classes/usuarios');
const { crearMensaje } = require('../utils/utils');

const usuarios = new Usuarios();

io.on('connection', (client) => {


    client.on('entrarChat', (data, callback) => {

        if (!data.nombre || !data.sala) {
            return callback({
                ok: false,
                err: {
                    message: 'El nombre / sala es necesario'
                }
            });
        }

        // Codigo para conectar un usuario a una sala
        client.join(data.sala);

        let personas = usuarios.agregarPersona(client.id, data.nombre, data.sala);

        let personaConectada = usuarios.getPersona(client.id);

        // Informar al resto de usuarios DE LA SALA conectdos quien se acaba de conectar
        client.broadcast.to(data.sala).emit('crearMensaje', crearMensaje('Administrador', `${personaConectada.nombre} se conectó a la sala ${personaConectada.sala}!`));

        // Cuando una persona ENTRA al chat. Listado de las que estan conectados e informar solo a la SALA
        client.broadcast.to(data.sala).emit('listaPersona', usuarios.getPersonasPorSala(data.sala));



        callback(personas);



    });

    client.on('disconnect', () => {
        let personaBorrada = usuarios.borrarPersona(client.id);


        client.broadcast.to(personaBorrada.sala).emit('crearMensaje',
            crearMensaje('Administrador', `${personaBorrada.nombre} abandonó el chat ${personaBorrada.sala}!`));



        // Cuando una persona SALE del chat. Listado de las que estan conectados
        client.broadcast.to(personaBorrada.sala).emit('listaPersona', usuarios.getPersonasPorSala(personaBorrada.sala));

    });

    // Recine el mensaje del cliente y lo emite a todos los usuarios conectados de la SALA
    client.on('crearMensaje', (data, callback) => {

        let persona = usuarios.getPersona(client.id);
        //console.log('crearMensaje rx', data);
        let mensaje = crearMensaje(persona.nombre, data.mensaje);
        client.broadcast.to(persona.sala).emit('crearMensaje', mensaje);

        callback(mensaje);
    });

    //Mensajes privados
    client.on('mensajePrivado', (data) => {

        if (!data.target) {
            return callback({
                ok: false,
                err: {
                    message: 'El   usuario target destino es necesario'
                }
            });
        }

        let persona = usuarios.getPersona(client.id);

        client.broadcast.to(data.target).emit('mensajePrivado', crearMensaje(persona.nombre, data.mensaje));
    });

});
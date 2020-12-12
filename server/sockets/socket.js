const { io } = require('../server');
const { TicketControl } = require('../classes/ticker-control');

const ticketControl = new TicketControl();


io.on('connection', (client) => {

    client.on('siguienteTicket', (data, callback) => {

        let siguiente = ticketControl.siguiente();
        callback(siguiente);
    });

    //emitir un evento 'estadoActual' 

    client.emit('estadoActual', {
        actual: ticketControl.getUltimoTicket(),
        ultimos4: ticketControl.getUltimos4(),
    })


    client.on('atenderTicket', (data, callback) => {

        if (!data.escritorio) {
            return callback({
                err: true,
                mensaje: 'el escritorio es necesario'
            })
        }

        let atenderTicket = ticketControl.atenderTicket(data.escritorio);

        callback(atenderTicket);

        //TODO: actualizar o notificar cambios en los últimos 4 
        client.broadcast.emit('ultimos4', {
            ultimos4: ticketControl.getUltimos4(),
        })

    })

});
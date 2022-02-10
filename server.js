const express = require('express');
const path = require('path');

const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);

app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'public'));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

app.use('/', (req, res) => {
  res.render('index.html');
})

let messages = [];

/**
 * Toda vez que um novo cliente se conectar ao socket, reproduz uma ação.
 * 
 * A função 'io.on' recebe o socket que acabou de ser criado como callback.
 * 
 * O 'on' é o método "ouvidor", passivo e reagente, quando uma conexão é 
 * solicitada a partir do frontend, o 'on' "connection" é ativado.
 */
io.on('connection', (socket) => {
  console.log(`Socket conectado: ${socket.id}`);

  socket.emit('previousMessages', messages);

  /**
   * Sempre que o socket recebido do front fazer uma ação, ela será
   * ouvida e identificada através do seu nome e assim executado uma 
   * resposta a ela
   * 
   * A função "on" seguinte recebe em "data" os dados enviados pelo front 
   * como "messageObject"
   */
  socket.on('sendMessage', data => {
    messages.push(data);

    /**
     * o Broadcast serve para "mirar" em todos os clientes conectados.
     * 
     * No caso abaixo, ele vai emitir para todo mundo conectado a este
     * socket a mensagem recebida do front.
     */
    socket.broadcast.emit('receiveMessage', data);
  })
})

server.listen(3000, () => console.log('Server is running in http://localhost:3000'));
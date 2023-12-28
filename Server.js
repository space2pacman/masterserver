const net = require('net');
const EventEmitter = require('events');
const { v4: uuidv4 } = require('uuid');

class Server extends EventEmitter{
  constructor(params) {
    super();
    
    this._port = params.port || 80;
    this._server = null;
    this._storage = [];

    this._init();
  }

  _init() {
    this._server = net.createServer((socket) => {
      socket.on('data', (data) => {
        const packets = data.toString().split('\n').filter(Boolean);

        packets.forEach(packet => {
          const type = packet.toString().match(/([^\s]+)/)[0];
          const payload = packet.toString().slice(type.length + 1)

          switch(type) {
            case 'add':
              const item = JSON.parse(payload);

              item.id = uuidv4();

              this._storage.push(JSON.stringify(item));

              socket.write(`add ${JSON.stringify(item)}\n`);

              break;
            case 'get':
              socket.write(`get ${JSON.stringify(this._storage)}\n`);

              break;
          }
        });
      });
    });
    this._server.listen(this._port);
  }
}

module.exports = Server;
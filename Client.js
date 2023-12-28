const net = require('net');
const EventEmitter = require('events');

class Client extends EventEmitter {
  constructor(params) {
    super();

    this._port = params.port || 80;
    this._client = null;

    this._init();
  }

  add(data, callback) {
    this.emit('add', JSON.stringify(data));
    this.once('__add_data_to_server', callback);
  }

  get(callback) {
    this.emit('get');
    this.once('__get_data_from_server', callback);
  }

  _init() {
    this._client = net.Socket();
    
    this._client.connect(this._port, '127.0.0.1', () => {
      this.emit('connected');
    });
    this._client.on('data', (data) => {
      const packets = data.toString().split('\n').filter(Boolean);

      packets.forEach(packet => {
        const type = packet.toString().match(/([^\s]+)/)[0];
        const payload = packet.toString().slice(type.length + 1)
        
        switch(type) {
          case 'add':
            this.emit('__add_data_to_server', JSON.parse(payload));

            break;
          case 'get':
            this.emit('__get_data_from_server', JSON.parse(payload).map(item => JSON.parse(item)));

            break;
        }
      });
    });
    this.on('add', (data) => {
      this._client.write(`add ${data}\n`);
    });
    this.on('get', () => {
      this._client.write(`get\n`);
    });
  }
}

module.exports = Client;
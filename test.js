// Server

const master = require('./index.js');
const server = new master.Server({
  port: 5050,
});

server.on('data', data => {
  console.log('server:', data.toString());
});

// Client

const client = new master.Client({
  port: 5050
});

client.on('connected', () => {
  client.add({
    ip: '127.0.0.1',
    name: 'server name'
  }, (data) => {
    console.log(data)
  });

  client.add({
    ip: '127.0.0.2',
    name: 'server name'
  }, () => {});

  client.add({
    ip: '127.0.0.3',
    name: 'server name'
  }, () => {});

  setTimeout(() => {
    client.get((data) => {
      console.log(data)
    })
  }, 1000);
});
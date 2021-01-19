import Socket from 'socket.io';
import amqp from 'amqplib/callback_api';
import _ from 'lodash';
import http from 'http';
import { EventEmitter } from 'events';
import { environment } from '../environment';

export function connect(server: http.Server) {
  const clients: Socket.Socket[] = [];
  const emitter = new EventEmitter();
  emitter.on('fanout', (evt, msg) => {
    clients.forEach(client => {
      if (client.connected) {
        client.emit(evt, msg);
      }
    });
  });

  // websocket
  const io = Socket(server, { transports: ['websocket'] });
  io.use(async (socket, next) => {
    await next();
  });
  io.on('connection', socket => {
    clients.push(socket);
    socket.on('disconnect', () => {
      _.pullAllBy(clients, [socket], 'id');
    });
    socket.on('close', () => {
      _.pullAllBy(clients, [socket], 'id');
    });
    socket.on('error', () => {
      _.pullAllBy(clients, [socket], 'id');
    });
  });

  // 消息队列处理
  const mqurl = `amqp://${environment.rabbitMQ.username}:${environment.rabbitMQ.password}@${environment.rabbitMQ.host}`;
  amqp.connect(mqurl, (err, connection) => {
    if (err != null) {
      return;
    }
    connection.createChannel((conErr: any, channel) => {
      if (conErr != null) {
        return;
      }
      // 看板刷新推送
      channel.assertQueue('', { exclusive: true }, (channelErr: any, assertQueue) => {
        if (channelErr != null) {
          return;
        }
        // channel.bindQueue(assertQueue.queue, environment.rabbitMQ.exchange, '');
        // channel.consume(
        //   assertQueue.queue,
        //   message => {
        //     const content = message.content.toString();
        //     const body = JSON.parse(content);
        //     emitter.emit('fanout', environment.rabbitMQ.exchange, body);
        //   },
        //   { noAck: true }
        // );
      });
    });
  });
}

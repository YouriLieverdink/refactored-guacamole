import express from 'express';
import ip from 'ip';
import { Database } from 'sqlite3';
import { Internal } from './controllers/internal';
import { Collection } from './services/collection';
import { Queue } from './services/queue';
import { Signal } from './services/signal';
import { Storage } from './services/storage';
import { Computer } from './types/computer';
import { Transaction } from './types/transaction';

const main = (): void => {
    //
    const server = express();
    server.use(express.json());
    server.listen(3001, '0.0.0.0');

    const computers = new Collection<Computer>();
    computers.add({ ip: '10.5.0.5', port: 3001 });

    const me: Computer = { ip: ip.address(), port: 3001 };

    new Signal(server, computers, me);

    const queue = new Queue<Transaction>();

    const database = new Database('db.sqlite3');
    const storage = new Storage(database);

    new Internal(computers, queue, storage, server);
};

main();
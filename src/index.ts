// start all the servers/services and the database
import dotenv from 'dotenv';
dotenv.config();
import {generateKeyPair} from './auth_service/utils/genKeyPair';
generateKeyPair();

import { Database } from './database';
import {authService} from './auth_service';

process.on('uncaughtException', (err) => console.log('Uncaught Exception = ', err));
process.on('unhandledRejection', (err) => console.log('Unhandled Rejection = ', err));
process.on('SIGINT', () => {
    Database.endConnection();
})

Database.initDB()
.then(() => {
    authService.startService();
}).catch(err => {
    console.log('ERROR!', err);
});
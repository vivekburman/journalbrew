// start all the servers/services and the database
import dotenv from 'dotenv';
dotenv.config();
import {generateKeyPair} from './auth_service/utils/genKeyPair';
generateKeyPair();

import { authService } from './auth_service';
import { postService } from './post_service';
import { userInfoService } from './user_info_service';
import { searchService } from './search_service';
import * as http from 'http';
import * as https from 'https';

const servers: Array<Error | null | http.Server | https.Server> = [];

const closeAllServers = () => {
    console.log('closing all servers');
    servers.forEach((i) => {
        i && (i instanceof http.Server || i instanceof https.Server) && i.close();
    });
}

process.on('uncaughtException', (err) => {
    console.log('Uncaught Exception = ', err);
});
process.on('unhandledRejection', (err) => {
    console.log('Unhandled Rejection = ', err);
});

process.on('SIGINT', () => {
    closeAllServers();
});

Promise.all([
    authService.startService(),
    postService.startService(),
    userInfoService.startService(),
    searchService.startService()
])
.then(res => {
    res.forEach((i) => servers.push(i));
})
.catch(err => {
    console.log('ERROR!', err);
});
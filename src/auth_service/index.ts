import {server} from './server/server';
import {config} from './config/config';

const startService = () => {
    // start the server
    console.log('-- Auth Service --');
    server.start(config.serverSettings.port)
    .then(() => console.log(`Auth Server has started in port number = ${config.serverSettings.port}`))
    .catch((err: any) => console.log('Error starting server = ', err));
}

export const authService = Object.assign({}, {startService});
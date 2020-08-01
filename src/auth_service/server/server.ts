import express from 'express';
import morgan from 'morgan';
import helmet from 'helmet';
import { initPassport } from './passport.config';
import * as authRoutes from '../api';
import path from 'path';
import passport from 'passport';

initPassport();

const start: Function = (port:number | string) => {
    return new Promise((resolve, reject) => {
        if(!port) {
            throw new Error('The server must be started with an available port');
        }
        const app = express();
        app.set('views', path.join(__dirname, '../views'));
        app.set('view engine', 'ejs');
        app.engine('ejs', require('ejs').__express);
        app.use(morgan('dev'));
        app.use(helmet());
        app.use(passport.initialize());
        app.use(express.json());
        app.use(express.urlencoded({extended: true}));

        
        app.use((err: string, req: any, res: any, next: Function) => {
            reject(new Error(`Something went wrong = ${err}`));
            res.status(500).send('Something went wrong');
            next();
        });
        app.get('/', (req, res) => {
            res.render('home');
        });
        // add all routes here.
        authRoutes.registerRoutes(app);
        
        // start the server
        app.listen(port, () => resolve(app));
    });
}

export const server: {start: Function} = Object.assign({}, {start});
import express, { Request, Response, NextFunction } from 'express';
import morgan from 'morgan';
import helmet from 'helmet';
import { initPassport } from './passport.config';
import * as authRoutes from '../api';
import path from 'path';
import passport from 'passport';
import { rejects } from 'assert';
import createHttpError from 'http-errors';

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
        
        app.get('/', (req: Request, res: Response) => {
            res.render('home');
        });
        // add all routes here.
        authRoutes.registerRoutes(app);
        
        app.use(async(req, res, next) => {
            next(new createHttpError.NotFound());
        })
        app.use((err:any, req: Request, res: Response, next: NextFunction) => {
            // reject(new Error('Something went wrong'));
            res.status(err.status || 500).json({
                error: {
                    status: err.status || 500,
                    message: err.message
                }
            });
        });
        // start the server
        app.listen(port, () => resolve(app));
    });
}

export const server: {start: Function} = Object.assign({}, {start});
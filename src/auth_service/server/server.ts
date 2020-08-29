import express, { Request, Response, NextFunction, Application } from 'express';
import morgan from 'morgan';
import helmet from 'helmet';
import { initPassport } from './passport.config';
import * as authRoutes from '../api';
import CookieParser from 'cookie-parser';
import passport from 'passport';
import createHttpError from 'http-errors';
import { initRedis } from './redis.server';

const start = (port:number | string):Promise<Error | Application> => {
    initRedis();
    initPassport();
    return new Promise((resolve, reject) => {
        if(!port) {
            throw new Error('The server must be started with an available port');
        }
        const app = express();
        app.use(CookieParser());
        app.use(helmet());
        app.use(passport.initialize());
        app.use(express.json());
        app.use(express.urlencoded({extended: true}));

        // add all routes here.
        authRoutes.registerRoutes(app);
        
        if (process.env.NODE_ENV?.trim() == 'development') {
            console.log('--Starting in DEV mode --');
            app.use(morgan('dev'));
        }
        app.use(async(req, res, next) => {
            next(new createHttpError.NotFound());
        });
        app.use((err:any, req: Request, res: Response, next: NextFunction) => {
            reject(new Error('Something went wrong'));
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

export const server = Object.assign({}, {start});
import postRouter from './post';
import { Application } from 'express';

export const registerRoutes:Function = (app: Application) => {
    app.use('/post', postRouter);
};
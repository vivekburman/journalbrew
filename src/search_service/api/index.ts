import searchRouter from './search';
import { Application } from 'express';

export const registerRoutes:Function = (app: Application) => {
    app.use('/search', searchRouter);
};

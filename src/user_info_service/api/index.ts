import userInfoRouter from './userInfo';
import { Application } from 'express';

export const registerRoutes:Function = (app: Application) => {
    app.use('/user-info', userInfoRouter);
};

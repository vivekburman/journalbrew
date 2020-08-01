import registerRouter from './register';

export const registerRoutes:Function = (app: any) => {
    if (typeof app.use === 'function') {
        app.use('/auth', registerRouter);
    }
};
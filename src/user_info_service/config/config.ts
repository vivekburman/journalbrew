type serverType = {
    port: string | number | undefined
};

const serverSettings: serverType = {
    port: process.env.USER_INFO_SERVICE_PORT
};
export const config: any = Object.assign({}, {serverSettings});
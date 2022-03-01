type serverType = {
    port: string | number | undefined
};

const serverSettings: serverType = {
    port: process.env.SEARCH_SERVICE_PORT
};
export const config: any = Object.assign({}, {serverSettings});
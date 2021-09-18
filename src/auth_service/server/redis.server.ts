import redis, { RedisClient } from 'redis';
import createHttpError from 'http-errors';

let client: RedisClient; 
export const initRedis = () => {
    client =  redis.createClient({
        port: 6379,
        host: '192.168.0.103',
        password: 'topselfnews' 
    });
    
    client.on("error", (err) => {
        console.log('Redis error = ', err);
    });
    
    client.on("connect", () => {
        console.log('--Redis Connected--');
    });
    
    client.on("end", () => {
        console.log('--Closing Redis--');
    });

    process.on('SIGINT', () => {
        client.quit();
    })
};

export const getRedis = (key: string) => {
    return new Promise((resolve, reject) => {
        client.GET(key, (err, reply) => {
            if (err) return reject(new createHttpError.InternalServerError());
            resolve(reply);
        });
    });
};

export const setRedis = (key: string, value: string): Promise<string|undefined> => {
    return new Promise((resolve, reject) => {
        const expireTime = 365 * 24 * 60 * 60;
        client.SET(key, value, 'EX', expireTime, (err, reply) => {
            if (err) return reject(new createHttpError.InternalServerError());
            resolve(reply);
        });
    });
}

export const delRedis = (key: string): Promise<number|undefined> => {
    return new Promise((resolve, reject) => {
        client.DEL(key, (err, reply) => {
            if (err) return reject(new createHttpError.InternalServerError());
            resolve(reply);
        });
    });
}
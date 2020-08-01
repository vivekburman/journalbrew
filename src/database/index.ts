import mysql, { Connection } from 'mysql2/promise';
import { dbQuery } from './db.query';

console.log('--Starting Database Connection --');
type dbQueryFunc = { insertWithValues: Function, updateWithValues: Function, selectWithValues: Function };
let dbQueryHandler: dbQueryFunc;

async function initDB(): Promise<void | Connection> {
    let db;
    try {
        db = await mysql.createConnection({
            host: process.env.DB_HOSTNAME,
            user: process.env.DB_USER,
            password: process.env.DB_PASS,
            database: process.env.DB_DATABASE
        });
    } catch(err) {
        console.log('DB connection error');
        console.log('Closing DB');
        db?.end();
        throw err;
    }
    console.log('DB Connected!');
    dbQueryHandler = dbQuery(db);
}

function getDBQueryHandler(): dbQueryFunc {
    return dbQueryHandler;
}

export const Database = Object.assign({}, {initDB, getDBQueryHandler});
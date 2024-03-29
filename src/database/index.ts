import mysql from 'mysql2/promise';
import createHttpError from "http-errors";
// interface dbQueryFunc { 
//     insertWithValues(query: string, values:any|any[]): Promise<any>,
//     updateWithValues(query: string, values:any|any[]): Promise<any>, 
//     selectWithValues(query: string, values:any|any[]): Promise<any>,
//     updateJSONValues(query:string, values:any|any[]): Promise<any> 
// };

enum QUERY_TYPES {
    INSERT =  'INSERT',
    UPDATE =  'UPDATE',
    SELECT =  'SELECT',
    UPDATE_JSON = 'UPDATE_JSON',
    CTE_SELECT = 'CTE_SELECT',
    DELETE = 'DELETE',
}

class SQL_DB {
    private CONFIG = {
        host: process.env.DB_HOSTNAME,
        user: process.env.DB_USER,
        password: process.env.DB_PASS,
        database: process.env.DB_DATABASE
    };
    public TYPES = QUERY_TYPES;
    private db!: mysql.Connection;
    constructor(connect?: boolean) {
        connect && this.connect();
    }
    connect = () => {
        return new Promise(async (resolve, reject) => {
            try {
                this.db = await mysql.createConnection(this.CONFIG);
                resolve(1);
            } catch(err) {
                this.db?.end();
                reject(err);
            }
        });
    }
    close = () => {
        this.db?.end();
        // console.log('Closing DB');
    }
    initalizeTransc = () => {
        return this.db?.beginTransaction();
    }
    rollbackTransc = () => {
        return this.db?.rollback();
    }
    commitTransc = () => {
        return this.db?.commit();
    }
    insertWithValues = (query: string, values: any | any[] | { [param: string]: any }):Promise<any> => {
        if (query.startsWith('Insert') || query.startsWith('INSERT')) {
            return this.db?.query(query, values)
            .catch(err => {
                console.error('Insertion failed');
                this.logError(query,values, err);
                throw new createHttpError.InternalServerError('SQL Exception');
            });
        }
        return Promise.reject('Not a valid Insert Query');
    }
    updateWithValues = (query: string, values: any | any[] | { [param: string]: any }):Promise<any>  => {
        if (query.startsWith('Update') || query.startsWith('UPDATE')) {
            return this.db?.query(query, values)
            .catch(err => {
                console.log('Updation failed');
                this.logError(query,values, err);
                throw new createHttpError.InternalServerError('SQL Exception');
            });
        }
        return Promise.reject('Not a valid Update Query');
    }
    cteQueryWithValues = (query: string, values: any | any[] | { [param: string]: any }):Promise<any>  => {
        return this.db?.query(query, values)
        .catch(err => {
            console.error('CTE Query failed');
            this.logError(query,values, err);
            throw new createHttpError.InternalServerError('SQL Exception');
        });
    }
    deleteWithValues = (query: string, values: any | any[] | { [param: string]: any }):Promise<any>  => {
        if (query.startsWith('DELETE') || query.startsWith('delete')) {
            return this.db?.query(query, values)
            .catch(err => {
                console.error('Deletion failed');
                this.logError(query,values, err);
                throw new createHttpError.InternalServerError('SQL Exception');
            });
        }
        return Promise.reject('Not a valid Delete Query');
    }
    selectWithValues = (query: string, values: any | any[] | { [param: string]: any }):Promise<any>  => {
        if (query.startsWith('SELECT') || query.startsWith('select')) {
            return this.db?.query(query, values)
            .catch(err => {
                console.error('Selection failed');
                this.logError(query,values, err);
                throw new createHttpError.InternalServerError('SQL Exception');
            });
        }
        return Promise.reject('Not a valid Select Query');
    }
    updateJSONValues = (query: string, values: any|any[]) => {
        return this.db?.query(query, values)
            .catch(err => {
                console.error('Updating JSON values failed');
                this.logError(query,values, err);
                throw new createHttpError.InternalServerError('SQL Exception');
            });
    }
    logError = (query:string, values: any | any[], err: Error):void => {
        console.error(`Query: ${query}`);
        console.error(`Values: ${values}`);
        console.error(`Error: ${err}`);
    }
    exec = async (type: string, query: string, values: any | any[] | { [param: string]: any }) => {
        let res;
        if (type in QUERY_TYPES) {
            try {
                await this.connect();
                await this.initalizeTransc();
                switch(type) {
                    case this.TYPES.INSERT:
                        res = await this.insertWithValues(query, values);
                        break;
                    case this.TYPES.UPDATE:
                        res = await this.updateWithValues(query, values);
                        break;
                    case this.TYPES.SELECT:
                        res = await this.selectWithValues(query, values);
                        break;
                    case this.TYPES.UPDATE_JSON:
                        res = await this.updateJSONValues(query, values);
                        break;
                    case this.TYPES.CTE_SELECT:
                        res = await this.cteQueryWithValues(query, values);
                        break;
                    case this.TYPES.DELETE:
                        res = await this.deleteWithValues(query, values);
                        break;
                }
                if (res && (type != this.TYPES.SELECT && type != this.TYPES.CTE_SELECT) ) {
                    await this.commitTransc();
                }
                return res;
            }catch(err) {
                await this.rollbackTransc();
                return Promise.reject(err);
            } finally{
                this.close();
            }
        }
    }
}
export default SQL_DB;
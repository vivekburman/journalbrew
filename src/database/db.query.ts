import createHttpError from "http-errors";
import { Connection } from "mysql2/promise";


const logError = (query:string, values: any | any[], err: Error):void => {
    console.log(`Query: ${query}`);
    console.log(`Values: ${values}`);
    console.log(`Error: ${err}`);
}

export function dbQuery(db: Connection) {
    return {
        insertWithValues: (query: string, values: any | any[] | { [param: string]: any }): Promise<any>=> {
            if (query.startsWith('Insert') || query.startsWith('INSERT')) {
                return db.query(query, values)
                .catch(err => {
                    console.log('Insertion failed');
                    logError(query,values, err);
                    throw new createHttpError.InternalServerError('SQL Exception');
                });
            }
            return Promise.reject('Not a valid Insert Query');
        },
        updateWithValues: (query: string, values: any | any[] | { [param: string]: any }): Promise<any> => {
            if (query.startsWith('Update') || query.startsWith('UPDATE')) {
                return db.query(query, values)
                .catch(err => {
                    console.log('Updation failed');
                    logError(query,values, err);
                    throw new createHttpError.InternalServerError('SQL Exception');
                });
            }
            return Promise.reject('Not a valid Update Query');
        },
        selectWithValues: (query: string, values: any | any[] | { [param: string]: any }): Promise<any> => {
            if (query.startsWith('SELECT') || query.startsWith('select')) {
                return db.query(query, values)
                .catch(err => {
                    console.log('Selection failed');
                    logError(query,values, err);
                    throw new createHttpError.InternalServerError('SQL Exception');
                });
            }
            return Promise.reject('Not a valid Select Query');
        },
        updateJSONValues: (query: string, values: any|any[]): Promise<any> => {
            return db.query(query, values)
                .catch(err => {
                    console.log('Updating JSON values failed');
                    logError(query,values, err);
                    throw new createHttpError.InternalServerError('SQL Exception');
                });
        }
    }
}
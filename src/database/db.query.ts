import { Connection } from "mysql2/promise";

export function dbQuery(db: Connection) {
    return {
        insertWithValues: (query: string, values: any | any[] | { [param: string]: any }): Promise<any>=> {
            if (query.startsWith('Insert') || query.startsWith('INSERT')) {
                return db.query(query, values)
                .catch(err => {
                    console.log('Insertion failed', err);
                    throw err;
                });
            }
            return Promise.reject('Not a valid Insert Query');
        },
        updateWithValues: (query: string, values: any | any[] | { [param: string]: any }): Promise<any> => {
            if (query.startsWith('Update') || query.startsWith('UPDATE')) {
                return db.query(query, values)
                .catch(err => {
                    console.log('Updation failed', err);
                    throw err;
                });
            }
            return Promise.reject('Not a valid Update Query');
        },
        selectWithValues: (query: string, values: any | any[] | { [param: string]: any }): Promise<any> => {
            if (query.startsWith('SELECT') || query.startsWith('select')) {
                return db.query(query, values)
                .catch(err => {
                    console.log('Selection failed', err);
                    throw err;
                });
            }
            return Promise.reject('Not a valid Select Query');
        },
    }
}
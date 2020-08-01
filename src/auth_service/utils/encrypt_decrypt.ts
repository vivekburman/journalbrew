import bcrypt from 'bcrypt';

const saltRounds: number = 12;

const compare = (param: string, encryptedparam: string): Promise<boolean> => bcrypt.compare(param, encryptedparam);
const compareSync = (param: string, encryptedparam: string): boolean => bcrypt.compareSync(param, encryptedparam);

const encrypt = (param: string, rounds: number = saltRounds): Promise<string> => bcrypt.hash(param, rounds);
const encryptSync = (param: string, rounds: number = saltRounds): string => bcrypt.hashSync(param, rounds);

export const encryptDecrypt = Object.assign({}, {
    compare,
    compareSync,
    encrypt,
    encryptSync
});

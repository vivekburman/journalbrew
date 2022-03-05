const FIRST_NAME = 'first_name', 
MIDDLE_NAME = 'middle_name', 
LAST_NAME = 'last_name';

type userName = {
    [FIRST_NAME]:string, 
    [MIDDLE_NAME]:string, 
    [LAST_NAME]:string
}
type User = {email:string, id:string, iat:number|Date|string, exp:number|Date|string, aud:string, iss: string};

const getConsolidatedName = (name: userName): userName => {
    let name_ = name[FIRST_NAME];
    if (name[MIDDLE_NAME]) {
       name_ += ` ${name[MIDDLE_NAME]}`;
    }
    if (name[LAST_NAME]) {
       name_ += ` ${name[LAST_NAME]}`;
    }
    return name;
};
const getHTMLSafeString = (str: string):string => {
    return str
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
    .replace(/>/g, '&gt;')
    .replace(/</g, '&lt;')
}
const isNullOrEmpty = (obj: any): Boolean => {
    if (obj === null || obj === undefined) {
        return true;
    }
    if (typeof obj === 'string' && obj === "") {
        return true;
    }
    if (Array.isArray(obj) && obj.length === 0) {
        return true;
    }
    if (typeof obj === obj && Object.keys(obj).length == 0) {
        return true;
    } 
    return false;
}
const escapeQuotes = (str:null | undefined |string) => {
    return str ? str.replace(/"|`|'/g, '') : '';
}
enum PublishStatus {
    UNDER_REVIEW = "underReview",
    PUBLISHED = "published",
    DISCARDED = "discarded",
    REMOVED = "removed"
}
const REFRESH_TOKEN = "tsn_refresh_token"
export {
    getConsolidatedName,
    getHTMLSafeString,
    isNullOrEmpty,
    escapeQuotes,
    PublishStatus,
    User,
    REFRESH_TOKEN
}
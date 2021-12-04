const FIRST_NAME = 'first_name', 
MIDDLE_NAME = 'middle_name', 
LAST_NAME = 'last_name';

type userName = {
    [FIRST_NAME]:string, 
    [MIDDLE_NAME]:string, 
    [LAST_NAME]:string
}
const getConsolidatedName = (name: userName) => {
    let name_ = name[FIRST_NAME];
    if (name[MIDDLE_NAME]) {
       name_ += ` ${name[MIDDLE_NAME]}`;
    }
    if (name[LAST_NAME]) {
       name_ += ` ${name[LAST_NAME]}`;
    }
    return name;
};

export {
    getConsolidatedName
}
const UPDATE_TEXT ='UPDATE_TEXT';
const updateText = (e) => {
    return {
    type: UPDATE_TEXT,
    payload: e
    }
};

export {
    updateText,
    UPDATE_TEXT
};
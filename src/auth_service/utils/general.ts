export const convertTime = (time?: number|Date|undefined) => {
    return time ? new Date(time).toISOString().slice(0, 19).replace('T', ' ') 
    : new Date().toISOString().slice(0, 19).replace('T', ' ') 
 };
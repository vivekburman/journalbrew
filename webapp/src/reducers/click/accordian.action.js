const openAccordian = () => ({
    type: 'OPEN_ACCORDIAN',
    payload: true
});
const closeAccordian = () => ({
    type: 'CLOSE_ACCORDIAN',
    payload: false
});
export {
    openAccordian,
    closeAccordian
};
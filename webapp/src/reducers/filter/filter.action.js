const SET_FILTER_TYPE = "SET_FILTER_TYPE";

const setFilterData = (filterText) => ({
    type: SET_FILTER_TYPE,
    payload: filterText
});

export {
    SET_FILTER_TYPE,
    setFilterData,
};
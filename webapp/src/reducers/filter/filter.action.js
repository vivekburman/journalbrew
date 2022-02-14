const SHOW_FILTER_START = "SHOW_FILTER_START";
const SHOW_FILTER_RESULT = "SHOW_FILTER_RESULT";
const SHOW_FILTER_ERROR = "SHOW_FILTER_ERROR";



const setFilterLoading = () => ({
    type: SHOW_FILTER_START,
    payload: {
        loading: true,
        error: false,
        filterResult: []
    }
});
const setFilterData = (filterResult=[]) => ({
    type: SHOW_FILTER_RESULT,
    payload: {
        loading: false,
        error: false,
        filterResult: filterResult
    }
});

const setFilterError = () => ({
    type: SHOW_FILTER_ERROR,
    payload: {
        loading: false,
        error: true,
        filterResult: []
    }
});

export {
    SHOW_FILTER_ERROR,
    SHOW_FILTER_RESULT,
    SHOW_FILTER_START,
    setFilterLoading,
    setFilterData,
    setFilterError
};
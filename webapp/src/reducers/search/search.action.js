const handleSearchRequest = (searchString) => ({
    type: 'SEARCH_REQUEST',
    payload: searchString
});
export default handleSearchRequest;
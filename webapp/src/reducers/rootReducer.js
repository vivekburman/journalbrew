import { combineReducers } from 'redux';
import accordianReducer from './click/accordian.reducer';
import resizeReducer from './window/resize.reducer';
import searchReducer from './search/search.reducer';
import { handleNotificationVisibility } from './click/notification.reducer';
import handleProfileDropDown from './click/profile.dropdown.reducer';
import handleSearchBar from './click/search.bar.reducer';
import handleLoginModal from './click/login.reducer';
import handleSetCurrentUser from './user/user.reducer';
import {handlePostInfo, handleEditorData} from './post/post.reducer';

export default combineReducers({
    accordian: accordianReducer,
    window: resizeReducer,
    search: searchReducer,
    notification: handleNotificationVisibility,
    profileDropDown: handleProfileDropDown,
    searchBar: handleSearchBar,
    loginModal: handleLoginModal,
    user: handleSetCurrentUser,
    post: handlePostInfo,
    editorData: handleEditorData    
});
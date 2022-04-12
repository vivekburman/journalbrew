import React, { useState } from "react";
import { requestFollow, requestUnFollow } from "../../services/userService";
import './follow.card.scss';
import { UserAvatar } from '../avatar.component/avatar';
import { getDisplayName } from '../../helpers/util';
import { useHistory } from 'react-router';



const FollowCard = (props) => {
    const data = props.data;
    const [isFollowing, setFollowing] = useState(data.following);
    const [showFollowLoading, setLoading] = useState(false);
    const history = useHistory();

    const navigateToUserPage = () => {
        history.push(`/user-profile/${props.currentUser}`);
    }
    
    const followRequest = (e) => {
        e.stopPropagation();
        setLoading(true);
        requestFollow({
            followerId: props.currentUser,
            followingId: data.followeeID
        }).then(({ data }) => {
            data.success ? setFollowing(true) : setFollowing(false);
        }).catch(() => {
            setFollowing(false);
        }).finally(() => {
            setLoading(false);
        });
    }
    
    const unFollowRequest = (e) => {
        e.stopPropagation();
        setLoading(true);
        requestUnFollow({
            followerId: props.currentUser,
            followingId: data.followeeID
        }).then(({ data }) => {
            data.success ? setFollowing(false) : setFollowing(true);
        }).catch(() => {
            setFollowing(true);
        }).finally(() => {
            setLoading(false);
        });
    }
    return (
        <div key={props.index} className='follow-card flex-row-nowrap margin-bottom-5 align-items-center cursor-pointer'
        onClick={navigateToUserPage}>
            <UserAvatar url={data.profilePicUrl} size={40}/>
            <div className='margin-left-15 margin-right-15 flex-grow-1 fc-name font-roboto'>
                {getDisplayName(data.firstName, data.middleName, data.lastName)}
            </div>
            {
                props.showFollow && isFollowing ? 
                <div className={"following " + (showFollowLoading ? "tsn-loading" : "")} 
                onClick={unFollowRequest}>Following
                </div>
                :
                <div className={"follow " + (showFollowLoading ? "tsn-loading" : "")} 
                onClick={followRequest}>Follow</div>
            }
        </div>
    )
}
export default FollowCard;
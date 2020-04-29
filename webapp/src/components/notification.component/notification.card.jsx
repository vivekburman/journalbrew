import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import './notification.component.scss';
import ReactAvatar from 'react-avatar';
import SimpleBar from 'simplebar-react';
import 'simplebar/dist/simplebar.min.css';

const dummyData = [
  {
    text: '{Abc} liked {your post}',
    link: 'https://www.google.com',
    read: false,
    avatar: '',
    type: 'google',
    time: new Date().setSeconds(new Date().getSeconds() - 2)
  }, {
    text: 'Your account has been {credited.}',
    link: 'https://www.google.com',
    read: false,
    type: 'google',
    avatar: '',
    time: new Date().setMinutes(new Date().getMinutes() - 2)
  }, {
    text: '{Abc} liked {your post}',
    link: 'https://www.google.com',
    read: true,
    type: 'google',
    time: new Date().setHours(new Date().getHours() - 2),
    avatar: '',
  }, {
    text: 'Your {post} has been reported by someone.',
    link: 'https://www.google.com',
    read: true,
    type: 'google',
    time: new Date().setDate(new Date().getDate() - 2),
    avatar: '',
  }, {
    text: 'We have changed {terms and policies}. Have a look',
    link: 'https://www.google.com',
    read: true,
    type: 'google',
    time: new Date().setMonth(new Date().getMonth() - 2),
    avatar: '',
  }, {
    text: 'Status of {your post} has changed to {uploaded}',
    link: 'https://www.google.com',
    read: false,
    type: 'google',
    time: new Date().setFullYear(new Date().getFullYear() - 2),
    avatar: '',
  }, {
    text: 'Status of {your post} has changed to {review}',
    link: 'https://www.google.com',
    time: new Date(12),
    read: false,
    avatar: '',
  },   {
    text: '{Abc} liked {your post}',
    link: 'https://www.google.com',
    read: false,
    avatar: '',
    type: 'google',
    time: new Date().setSeconds(new Date().getSeconds() - 2)
  }, {
    text: 'Your account has been {credited.}',
    link: 'https://www.google.com',
    read: false,
    type: 'google',
    avatar: '',
    time: new Date().setMinutes(new Date().getMinutes() - 2)
  }, {
    text: '{Abc} liked {your post}',
    link: 'https://www.google.com',
    read: true,
    type: 'google',
    time: new Date().setHours(new Date().getHours() - 2),
    avatar: '',
  }, {
    text: 'Your {post} has been reported by someone.',
    link: 'https://www.google.com',
    read: true,
    type: 'google',
    time: new Date().setDate(new Date().getDate() - 2),
    avatar: '',
  }, {
    text: 'We have changed {terms and policies}. Have a look',
    link: 'https://www.google.com',
    read: true,
    type: 'google',
    time: new Date().setMonth(new Date().getMonth() - 2),
    avatar: '',
  }, {
    text: 'Status of {your post} has changed to {uploaded}',
    link: 'https://www.google.com',
    read: false,
    type: 'google',
    time: new Date().setFullYear(new Date().getFullYear() - 2),
    avatar: '',
  }, {
    text: 'Status of {your post} has changed to {review}',
    link: 'https://www.google.com',
    time: new Date(12),
    read: false,
    avatar: '',
  },   {
    text: '{Abc} liked {your post}',
    link: 'https://www.google.com',
    read: false,
    avatar: '',
    type: 'google',
    time: new Date().setSeconds(new Date().getSeconds() - 2)
  }, {
    text: 'Your account has been {credited.}',
    link: 'https://www.google.com',
    read: false,
    type: 'google',
    avatar: '',
    time: new Date().setMinutes(new Date().getMinutes() - 2)
  }, {
    text: '{Abc} liked {your post}',
    link: 'https://www.google.com',
    read: true,
    type: 'google',
    time: new Date().setHours(new Date().getHours() - 2),
    avatar: '',
  }, {
    text: 'Your {post} has been reported by someone.',
    link: 'https://www.google.com',
    read: true,
    type: 'google',
    time: new Date().setDate(new Date().getDate() - 2),
    avatar: '',
  }, {
    text: 'We have changed {terms and policies}. Have a look',
    link: 'https://www.google.com',
    read: true,
    type: 'google',
    time: new Date().setMonth(new Date().getMonth() - 2),
    avatar: '',
  }, {
    text: 'Status of {your post} has changed to {uploaded}',
    link: 'https://www.google.com',
    read: false,
    type: 'google',
    time: new Date().setFullYear(new Date().getFullYear() - 2),
    avatar: '',
  }, {
    text: 'Status of {your post} has changed to {review}',
    link: 'https://www.google.com',
    time: new Date(12),
    read: false,
    avatar: '',
  },   {
    text: '{Abc} liked {your post}',
    link: 'https://www.google.com',
    read: false,
    avatar: '',
    type: 'google',
    time: new Date().setSeconds(new Date().getSeconds() - 2)
  }, {
    text: 'Your account has been {credited.}',
    link: 'https://www.google.com',
    read: false,
    type: 'google',
    avatar: '',
    time: new Date().setMinutes(new Date().getMinutes() - 2)
  }, {
    text: '{Abc} liked {your post}',
    link: 'https://www.google.com',
    read: true,
    type: 'google',
    time: new Date().setHours(new Date().getHours() - 2),
    avatar: '',
  }, {
    text: 'Your {post} has been reported by someone.',
    link: 'https://www.google.com',
    read: true,
    type: 'google',
    time: new Date().setDate(new Date().getDate() - 2),
    avatar: '',
  }, {
    text: 'We have changed {terms and policies}. Have a look',
    link: 'https://www.google.com',
    read: true,
    type: 'google',
    time: new Date().setMonth(new Date().getMonth() - 2),
    avatar: '',
  }, {
    text: 'Status of {your post} has changed to {uploaded}',
    link: 'https://www.google.com',
    read: false,
    type: 'google',
    time: new Date().setFullYear(new Date().getFullYear() - 2),
    avatar: '',
  }, {
    text: 'Status of {your post} has changed to {review}',
    link: 'https://www.google.com',
    time: new Date(12),
    read: false,
    avatar: '',
  }
];
const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const timeDiff = {};
timeDiff.oneSecond = 1000;
timeDiff.oneMinute = (() => timeDiff.oneSecond * 60)();
timeDiff.oneHour = (() => timeDiff.oneMinute * 60)();
timeDiff.oneDay = (() => timeDiff.oneHour * 24)();
timeDiff.oneWeek = (() => timeDiff.oneDay * 7)();
timeDiff.oneMonth = (() => timeDiff.oneWeek * 4)();
timeDiff.oneYear = (() => timeDiff.oneWeek * 12)();

const timeCalculator = (time) => {
  const _time = new Date(time);
  const diff = Date.now() - _time;
  const yearDiff = new Date().getFullYear() - _time.getFullYear();
  if (yearDiff > 1) {
    return _time.getFullYear();
  } else if (diff < timeDiff.oneMinute) {
    return `${Math.floor(diff / timeDiff.oneSecond)} seconds ago.`;
  } else if (diff < timeDiff.oneHour) {
    return `${Math.floor(diff / timeDiff.oneMinute)} minutes ago.`;
  } else if (diff < timeDiff.oneDay) {
    return `${Math.floor(diff / timeDiff.oneHour)} hours ago.`;
  } else if (diff < timeDiff.oneWeek) {
    return `${Math.floor(diff / timeDiff.oneDay)} days ago.`;
  } else if (diff < timeDiff.oneMonth) {
    return `${Math.floor(diff / timeDiff.oneWeek)} weeks ago.`;
  } else if (diff < timeDiff.oneYear) {
    return `${Math.floor(diff / timeDiff.oneMonth)} months ago.`;
  }
}
const createCard = (data) => {
  if (!data) {
    return (
      <div key={-1} className="notification-item">
        <p className="link-text">
          No new Notifications
        </p>
      </div>
    );
  }
  const list = data.map((entity, index) => {
    const text = entity.text;
    const arr = [];
    let k = 0;
    for (let i = 0; i < text.length; i++) {
      if (text[i] === '{') {
        // copy the string until then
        arr.push(<>{text.substring(k, i)}</>);
        // iterate until }
        let j = i + 1;
        while(j < text.length && text[j] !== '}') {
          j++;
        }
        arr.push(<strong>{text.substring(i + 1, j)}</strong>);
        i = j + 1;
        k = i;
      }
    }
    if (k !== text.length - 1) {
      arr.push(<>{text.substring(k)}</>);
    }
    let avatar;
    const avatarSize = 50;
    switch (entity.type) {
      case 'google':
        avatar = <ReactAvatar googleId={entity.avatar} size={avatarSize} round={true} />
        break;
      case 'facebook':
        avatar = <ReactAvatar facebookId={entity.avatar} size={avatarSize} round={true} />
        break;
      case 'twitter':
        avatar = <ReactAvatar twitterHandle={entity.avatar} size={avatarSize} round={true} />
        break;
      default:
        avatar = <ReactAvatar name={entity.name} size={avatarSize} round={true} />
        break;
    } 
    return (
      <div key={index} className={entity.read ? 'notification-item' : 'notification-item notification-item-unread'}>
        <Link to={ entity.link } className="link">
          <div className="notification-wrapper">
            { avatar }
            <div className="notification-text-wrapper">
              <p className="link-text">
                { index }
              </p>
              <span className="notification-time">{timeCalculator(entity.time)}</span>
            </div>
          </div>
        </Link>
      </div>
    );
  });
  return list;
}
export default class Notification extends Component {
  constructor(props) {
    super(props);
    this.state = {
      notifications: dummyData
    };
    this.ref = React.createRef(null);

  }
  fetchNotifications = () => {
    this.setState({ notifications: [...dummyData, ...dummyData] });
  }
  handleScroll = () => {
    const ref = this.ref.current.contentWrapperEl;
    if (ref.scrollHeight - ref.scrollTop === ref.clientHeight) {
      this.fetchNotifications();
    }
  }
  render() {
    const { notifications } = this.state;
    return (
      <div className="notifications-container">
        <div className="flex-row-nowrap justify-content-between align-items-center notifications-header-container">
          <h1 className="notifications-header">Notifications</h1>
          <span className="mark-read">Mark all read</span>
        </div>
        <div className="notifications-list-container">
          <SimpleBar style={{ maxHeight: 300 }} ref={this.ref} onScroll={this.handleScroll}>
            { createCard(notifications) }
          </SimpleBar>
        </div>
      </div>
    );
  }
}